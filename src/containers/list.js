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

const processTabState = (providers, collections, filters, cache) => {
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
            failed: acc.failed.concat(col.failed ? [col.failed] : [])
        }
    }, {items: [], failed: []})

}

const memoizedProcessTabState = memoize (processTabState)

const ListContainer = connect(
    ({collections, markers, filters, cache}, {tab}) => {
        console.error('list', tab, filters)
        let url = `/list/${tab.id}`

        const tabState = memoizedProcessTabState(tab.providers, collections, filters, cache)

        return {
            ...tabState,
            ...markers
        }
    },
    (dispatch, {match, history}) => ({
        actions: {
            ...bindMarkersActions(dispatch),
            show: (item) => history.push(`${match.url}/${itemURL(item)}`),
            play: (item) => history.push(`${match.url}/${itemURL(item)}/play`)
    }
  })
)(List)

export {ListContainer as default}
