'use strict;'

import { connect } from 'react-redux'

import ButterProvider from 'butter-provider'
import PlayerView from '../components/player'

const PlayerShowContainer = connect(
  ({collections}, {match, history}) => {
    let episode
    /* XXX: grab first not-seen episode */
    const [sid, eid] = [match.params.sid || 1, match.params.eid || 1]

    try {
      const col = collections[match.params.provider]
      const show = col.cache[match.params.id]
      const season = show.seasons[sid - 1]
      episode = season.episodes[eid - 1]
      if (!episode) {
        throw new Error('Episode undefined')
      }
    } catch (e) {
      return {}
    }

    return {
      ...episode,
      goBack: {
        action: history.goBack,
        title: episode.title
      }
    }
  }
)(PlayerView)

const PlayerMovieContainer = connect(
  ({collections}, {match, history}) => {
    let item

    try {
      const col = collections[match.params.provider]
      item = col.cache[match.params.id]

      /* XXX: should we implement this for TVSHOW too ? */
      if (item.type === ButterProvider.ItemType.TVSHOW2) {
        item = item.seasons[0].episodes[0] /* XXX: grab first not-seen episode */
      }

      if (!item) {
        throw new Error('Content undefined')
      }
    } catch (e) {
      return {}
    }

    return {
      ...item,
      goBack: {
        action: history.goBack,
        title: item.title
      }
    }
  }
)(PlayerView)

export {PlayerMovieContainer, PlayerShowContainer}
