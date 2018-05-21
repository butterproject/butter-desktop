'use strict;'

import { connect } from 'react-redux'
import List from 'butter-component-list'

import {bindPersistActions} from '../redux/persist'

const mergeItems = (col, makeActions) => {
    try {
        return col.items.map(id => Object.assign({}, col.cache[id], {
            actions: makeActions(id)
        }))
    } catch (e) {
        return []
    }
}

const ListContainer = connect(
    ({collections}, {tab, history}) => {
        console.error('list view', tab)
        let url = `/list/${tab.id}/`

        const tabState = tab.providers.reduce((acc, provider) => {
            const makeActions = (id) => ({
                actions: {
                    show: () => history.push(`${url}/${provider}/${id}`),
                    play: () => history.push(`${url}/${provider}${id}/play`),
                }
            })
            const col = collections[provider]

            return {
                items: acc.items.concat(mergeItems(col, makeActions)),
                isFetching: acc.isFetching ? acc.isFetching : col.isFetching,
                failed: acc.failed ? acc.failed : col.failed
            }
        }, {items: []})

        return {
            ...tabState,
        }
    },
    (dispatch) => ({
        actions: {
            ...bindPersistActions(dispatch)
        }
    })
)(List)

export {ListContainer as default}
