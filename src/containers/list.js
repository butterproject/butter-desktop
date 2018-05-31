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

const processTabState = (providers, collections, filters, cache, providerActions) => {
    const search = filters.search ? new RegExp(filters.search, 'i'): null

    return providers.reduce((acc, provider) => {
        const col = collections[provider]

        return {
            items: acc.items.concat(col.items.map(id => {
                const item = cache.get(id)
                if (search && ! item.title.match(search)) {
                    return null
                }

                return Object.assign({provider}, cache.get(id))
            }).filter(i => i)),
            isFetching: acc.isFetching ? acc.isFetching : col.isFetching,
            failed: acc.failed.concat(col.failed ? [col.failed] : []),
            providers: acc.providers.concat([{
                name: provider,
                actions: providerActions[provider],
                isFetching: col.isFetching
            }])
        }
    }, {items: [], failed: [], providers: []})

}

const memoizedProcessTabState = memoize (processTabState)

const ListContainer = connect(
    ({markers, collections, filters, cache, providerActions}, {tab}) => {
        console.error('list', tab, filters)
        let url = `/list/${tab.id}`

        /**
         * XXX: we pass the long argument list for memoization to work
         * I know it's tempting to just pass state, but don't
         */
        const tabState = memoizedProcessTabState(
            tab.providers, collections, filters, cache, providerActions
        )

        return {
            ...tabState,
            ...markers
        }
    },
    (dispatch, {match, history}) => ({
        dispatch,
        actions: {
            ...bindMarkersActions(dispatch),
            show: (item) => history.push(`${match.url}/${itemURL(item)}`),
            play: (item) => history.push(`${match.url}/${itemURL(item)}/play`)
        }
    }),
    ({providers, ...stateProps}, {dispatch, ...dispatchProps}, ownProps) => ({
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        onStarve: (e, page) => providers.map(
            provider => provider.isFetching || dispatch(
                provider.actions.FETCH({page,})
            )
        )
    })
)(List)

export {ListContainer as default}
