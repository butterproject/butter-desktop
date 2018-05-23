'use strict;'

import ButterProvider from 'butter-provider'
import PlayerView from '../components/player'

import {connectItem} from '../utils'

const getShowItem = (item, state, {match}) => {
    /* XXX: should we implement this for TVSHOW too ? */
    if (item.type === ButterProvider.ItemType.TVSHOW2) {
        try {
            /* XXX: grab first not-seen episode */
            const [sid, eid] = [match.params.sid || 1, match.params.eid || 1]
            item = item.seasons[sid - 1].episodes[eid - 1]
        } catch (e) {
            /* maybe we didn't get details yet ? */
        }
    }

    return item
}

const wireGoBack = (item, state, {history}) => ({
    goBack: {
        action: history.goBack,
        title: item.title
    }
})

const PlayerMovieContainer = connectItem(wireGoBack)(PlayerView)

const PlayerShowContainer = connectItem(
    wireGoBack, getShowItem
)(PlayerView)

export {PlayerMovieContainer, PlayerShowContainer}
