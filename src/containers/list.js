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
    ({collections, markers}, {tab}) => {
        console.error('list view', tab)
        let url = `/list/${tab.id}`

        const tabState = tab.providers.reduce((acc, provider) => {
            const col = collections[provider]

            return {
                items: acc.items.concat(col.items.map(
                    id => Object.assign({provider}, col.cache[id])) || []),
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
