'use strict;'

import { connect } from 'react-redux'
import List from 'butter-component-list'

import {bindPersistActions} from '../redux/persist'

const ListContainer = connect(
    ({tabs, collections, cache, ...state}, {tab, history}) => {
        console.error('here', tab)

        const cols = tab.providers.map(provider =>
            Object.assign(collections[provider], {id: provider})
        )

        const tabState = cols.reduce((acc, col) => {
            let url = `/list/${tab.id}/${col.id}`

            console.error('url', url)

            return {
                items: acc.items.concat(
                    col.items.map(id => Object.assign({}, cache[id], {
                        actions: {
                            show: () => history.push(`${url}/${id}`),
                            play: () => history.push(`${url}/${id}/play`),
                        }
                    }))
                ),
                isFetching: acc.isFetching ? acc.isFetching : col.isFetching,
                failed: acc.failed ? acc.failed : col.failed
            }
        }, {items: []})

        return {
            ...state,
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
