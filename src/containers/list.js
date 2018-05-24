'use strict;'

import { connect } from 'react-redux'
import List from 'butter-component-list'
import ButterProvider from 'butter-provider'

import {bindMarkersActions} from '../redux/markers'

const itemURL = (item) => {
    switch(item.type) {
        case 'tvshow2':
            return `${item.provider}/${item.id}/s/1`
        default:
            return `${item.provider}/${item.id}`
    }
}

const ListContainer = connect(
    ({collections, markers, filters}, {tab}) => {
        console.error('list view', tab, filters)
        const search = filters.search ? new RegExp(filters.search, 'i'): null
        let url = `/list/${tab.id}`

        const tabState = tab.providers.reduce((acc, provider) => {
            const col = collections[provider]

            return {
                items: acc.items.concat(col.items.map(id => {
                    const item = col.cache[id]
                    if (search && ! item.title.match(search)) {
                        return null
                    }

                    return Object.assign({provider}, col.cache[id])
                }).filter(i => i)),
                isFetching: acc.isFetching ? acc.isFetching : col.isFetching,
                failed: acc.failed.concat(col.failed ? [col.failed] : [])
            }
        }, {items: [], failed: []})

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
