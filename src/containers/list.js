'use strict;'

import { connect } from 'react-redux'
import List from 'butter-component-list'
import ButterProvider from 'butter-provider'

import {bindMarkersActions} from '../redux/markers'

import memoize from 'memoizee'

const itemURL = (item) => {
    switch(item.type) {
        case 'tvshow2':
            return `${item.provider}/${item.id}/s/1`
        default:
            return `${item.provider}/${item.id}`
    }
}

const getItems = (ids, provider, cache, search) => {
    const sortedIds = Object.keys(ids)
                            .sort()
                            .reduce((acc, k) => acc.concat(ids[k]), [])
    const items = sortedIds.map(id => Object.assign({provider}, cache.get(id)))
    if (! search || ! items.length) {
        return items
    }

    return items.filter(item => item.title.match(search))
}

const processTabState = (providers, collections, filters, cache, providerActions) => {
    const search = filters.search ? new RegExp(filters.search, 'i'): null

    return providers.reduce((acc, provider) => {
        const col = collections[provider.id]

        return {
            items: acc.items.concat(getItems(col.ids, provider.id, cache, search)),
            isFetching: acc.isFetching ? acc.isFetching : col.isFetching,
            failed: acc.failed.concat(col.failed ? [col.failed] : []),
            providers: acc.providers.concat([{
                name: provider.id,
                actions: providerActions[provider.id],
                isFetching: col.isFetching
            }])
        }
    }, {items: [], failed: [], providers: []})
}

const memoizedProcessTabState = memoize (processTabState)

const mapStateToProps =  ({markers, collections, filters, cache, providerActions}, {tab}) => {
    console.error('list', tab, filters)
    let url = `/list/${tab.id}`

    /**
     * XXX: we pass the long argument list for memoization to work
     * I know it's tempting to just pass state, but don't
     */
    try {
        const tabState = memoizedProcessTabState(
            tab.providers, collections, filters, cache, providerActions
        )

        return {
            ...tabState,
            markers,
            collections
        }
    } catch (e) {
        console.error('error in list', e)
        return {
            markers,
            collections,
            items: []
        }
    }
}

const mapDispatchToProps = (dispatch, {match, history}) => ({
    dispatch,
    actions: {
        ...bindMarkersActions(dispatch),
        show: (item) => history.push(`${match.url}/${itemURL(item)}`),
        play: (item) => history.push(`${match.url}/${itemURL(item)}/play`)
    }
})

const mergeProps = ({providers, collections, ...stateProps}, {dispatch, ...dispatchProps}, {tab}) => ({
    ...stateProps,
    ...dispatchProps,
    ...tab.options,
    onStarve: (e) => providers.map(
        provider => provider.isFetching || do {
            const {ids} = collections[provider.name]
            const page = Object.keys(ids).sort().pop() || 0
            dispatch(
                provider.actions.FETCH({page: Number(page) + 1})
            )
        }
    )
})

const ListContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(List)

export {ListContainer as default}
