'use strict;'

import { connect } from 'react-redux'
import List from 'butter-component-list'

import {bindPersistActions} from '../redux/persist'

const mergeItems = (col, mangleItem) => {
  try {
    return col.items.map(id => Object.assign({}, col.cache[id], mangleItem(id)))
  } catch (e) {
    console.error(e)
    return []
  }
}

const ListContainer = connect(
  ({collections, persist}, {tab, history}) => {
    console.error('list view', tab)
    let url = `/list/${tab.id}`

    const tabState = tab.providers.reduce((acc, provider) => {
      const mangleItem = (id) => ({
        actions: {
          show: () => history.push(`${url}/${provider}/${id}`),
          play: () => history.push(`${url}/${provider}/${id}/play`)
        }
      })

      const col = collections[provider]

      return {
        items: acc.items.concat(mergeItems(col, mangleItem)),
        isFetching: acc.isFetching ? acc.isFetching : col.isFetching,
        failed: acc.failed.concat(col.failed ? [col.failed] : [])
      }
    }, {items: [], failed: []})

    return {
      ...tabState,
      persist
    }
  },
  (dispatch) => ({
    actions: {
      ...bindPersistActions(dispatch)
    }
  })
)(List)

export {ListContainer as default}
