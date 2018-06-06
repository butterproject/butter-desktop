'use strict;'

import ButterProvider from 'butter-provider'
import PlayerView from '../components/player'

import {connectItem, fetchDetail} from '../utils'
import StreamerReduxer from '../redux/streamer'

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

let loading = false
const startStreamer = (props) => {
    const newProps = fetchDetail(props)
    const {isFetching, retItem, dispatch, streamer, history} = newProps

    if (isFetching) {
        return newProps
    }

    if (streamer.loading) {
        loading = false
    }

    const url = retItem.sources[0].url
    if (streamer.loaded === url || streamer.loading || loading) {
        console.error('already loading/loaded this content')
    } else {
        loading = true
        console.error('dispatching SERVE', url)
        dispatch(StreamerReduxer.actions.SERVE(url))
    }

    return {
        ...newProps,
        goBack: {
            action: () => {
                history.goBack()
                setTimeout(() => (
                    dispatch(StreamerReduxer.actions.CLOSE())
                ), 1000)

            },
            title: retItem.title
        }
    }
}

const processExtraProps = (item, {streamer}) => ({
    streamer,
})

const PlayerMovieContainer = connectItem(
    processExtraProps, undefined,  startStreamer
)(PlayerView)

const PlayerShowContainer = connectItem(
    processExtraProps, getShowItem, startStreamer
)(PlayerView)

export {PlayerMovieContainer, PlayerShowContainer}
