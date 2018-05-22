'use strict;'

import { connect } from 'react-redux'
import ContentDetail from 'butter-component-content-details'

import {bindPersistActions} from '../redux/persist'
import {providerActions} from '../'

let airing = {}

const ContentDetailContainer = connect(
  ({tabs, collections, persist}, {match, history}) => {
    const tab = tabs[match.params.tab]
    const goBack = {
      action: history.goBack,
      title: tab.name
    }

    try {
      const col = collections[match.params.provider]
      const item = col.cache[match.params.id]

      return {
        item,
        col,
        persist,
        goBack
      }
    } catch (e) {
      return history.push('/')
    }
  },
  undefined,
  ({item, col, ...stateProps}, {dispatch}, {location, history, match}) => {
    const {isFetching, detail} = col
    const actions = {
      ...bindPersistActions(dispatch),
      ...providerActions[match.params.provider],
      play: (item) => history.push(`${location.pathname}/play`),
      show: (item) => history.push(`${location.pathname}/e/${item.episode}`)
    }

    if (detail !== item.id && ! isFetching) {
      if (! airing[item.id]) {
        console.error('dispatching DETAILS')
        airing[item.id] = dispatch(actions.DETAIL(item.id))
      }
    } else {
      delete(airing[item.id])
    }

    return {
      ...stateProps,
      ...item,
      isFetching,
      dispatch,
    }
  }
)(ContentDetail)

export {ContentDetailContainer as default}
