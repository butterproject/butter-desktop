import {connect} from 'react-redux'

import {bindMarkersActions} from './redux/markers'

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

let airing = {}

const extractItemFromState = (processExtraProps = () => {}, processItem = Identity) =>
  (state, props) => {
    const {collections, cache, providerActions} = state
    const {match, history} = props
    let item, retItem, collection
    let extraProps = {}

    try {
      collection = collections[match.params.provider]
      item = cache.get(match.params.id)
      retItem = processItem(item, state, {...props, collection}) || item

      if (!retItem) {
        throw new Error('Content undefined')
      }

      extraProps = processExtraProps(retItem, state, {...props, collection})
    } catch (e) {
      /**
       *  we're in a weird state where we couldn't even get the first item ref,
       *  go back home
       **/
      history.push('/')
    }

    return {
      item,
      collection,
      retItem,
      providerActions,
      ...extraProps
    }
  }

const fetchDetail = ({item, collection, ...props}) => {
  const {dispatch, actions} = props
  let {isFetching} = collection
  const {detail} = collection

  if (detail === item.id) {
    delete (airing[item.id])
  } else {
    if (isFetching || airing[item.id]) {
      console.log('already fetching')
    } else {
      console.error('dispatching DETAILS', item)
      airing[item.id] = dispatch(actions.DETAIL(item))
      isFetching = true
    }
  }

  return {
    ...props,
    isFetching
  }
}

const filterProps = ({item, retItem, collection, ...props}) => ({
  ...props,
  ...retItem
})

const mergeProps = (enrichProps = Identity) =>
  ({retItem, collection, providerActions, ...stateProps},
    {dispatch, ...dispatchProps},
    {match, ...ownProps}) => {
    if (!retItem || !collection) {
      return {...stateProps, ...dispatchProps, ...ownProps, dispatch, match}
    }

    const actions = {
      ...bindMarkersActions(dispatch),
      ...providerActions[match.params.provider]
    }

    return filterProps(enrichProps({
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      retItem,
      collection,
      match,
      dispatch,
      actions
    }))
  }

const connectItem = (processExtraProps, processItem, enrichProps) => (
  connect(
    extractItemFromState(processExtraProps, processItem),
    undefined,
    mergeProps(enrichProps)
  )
)

export {
  relativePath,
  windowActions,
  fetchDetail,
  extractItemFromState,
  mergeProps,
  connectItem
}
