import React from 'react'

import {Toolbar} from 'butter-base-components'
import {connect} from 'react-redux'

import {bindPersistActions} from './redux/persist'
import {providerActions} from './'


/* electron */
import {remote} from 'electron'

const Identity = (a) => a

const doOnWindow = (fn) =>
    (arg) => {
        const window = remote.getCurrentWindow()

        if (window) {
            return fn(window, arg)
        }

        return null
    }

const windowActions = {
    close: doOnWindow(window => window.close()),
    min: doOnWindow(window => window.minimize()),
    max: doOnWindow(window => window.isMaximized() ? window.unmaximize() : window.maximize()),
    fullscreen: doOnWindow((window, active) => window.setFullScreen(active))
}

const relativePath = (location, path) => {
    const basepath = location.pathname.split('/').slice(0, -1).join('/')

    path.replace(/^\//g, '')

    console.error('path', `${basepath}/${path}`)
    return `${basepath}/${path}`
}

const defaultToolbar = (history) => (
    <Toolbar search buttons={[
        {title: 'settings', icon: 'settings', action: () => (history.push('/settings'))}
    ]} />
)

let airing = {}

const extractItemFromState = (processExtraProps = () => {}, processItem = Identity) => (
    (state, props) => {
        const {collections} = state
        const {match, history} = props
        let item, retItem, collection, title, extraProps = {}

        try {
            collection = collections[match.params.provider]
            item = collection.cache[match.params.id]
            retItem = processItem(item, state, {...props, collection}) || item

            if (!retItem) {
                throw new Error('Content undefined')
            }

            extraProps = processExtraProps(retItem, state, {...props, collection})
        } catch (e) {
            /*
               we're in a weird state where we couldn't even get the first item ref,
               go back home
             */
            history.push('/')
        }

        return {
            item,
            collection,
            retItem,
            ...extraProps
        }
    }
)

const mergePropsWithActions = (extraActions = () => {}) => (
    ({item, retItem, collection, ...stateProps},
     {dispatch, ...dispatchProps},
     {match, ...ownProps}) => {
        if (!retItem) {
            return {...stateProps, ...dispatchProps, ...ownProps, dispatch, match}
        }

        let {isFetching} = collection
        const {detail} = collection
        const actions = {
            ...bindPersistActions(dispatch),
            ...providerActions[match.params.provider],
        }

        if (detail === item.id) {
            delete(airing[item.id])
        } else {
            if (isFetching || airing[item.id]) {
                console.log('already fetching')
            } else {
                console.error('dispatching DETAILS', item)
                airing[item.id] = dispatch(actions.DETAIL(item.id))
                isFetching = true
            }
        }

         const props = {
             ...stateProps,
             ...dispatchProps,
             ...ownProps,
             ...retItem,
             isFetching,
             match,
             dispatch,
             actions,
         }

         return {
             ...props
             actions: {
                 ...actions,
                 ...extraActions(props)
             }
         }
     }
)

const connectItem = (processExtraProps, processItem, extraActions) => (
    connect(
        extractItemFromState(processExtraProps, processItem),
        undefined,
        mergePropsWithActions(extraActions)
    )
)

export {
    relativePath,
    defaultToolbar,
    windowActions,
    extractItemFromState,
    mergePropsWithActions,
    connectItem
}
