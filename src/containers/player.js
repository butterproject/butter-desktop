'use strict;'

import ButterProvider from 'butter-provider'
import PlayerView from '../components/player'

import {connectItem, fetchDetail} from '../utils'
import StreamerReduxer from '../redux/streamer'

const getOrder = (array, order) => (
    array.filter(element => Number(element.order) === Number(order))[0]
)

const getShowItem = (item, state, {match, ...props}) => {
    let retItem = item

    if (item.type === ButterProvider.ItemType.TVSHOW2) {
        try {/* XXX: should we implement this for TVSHOW too ? */
            /* XXX: grab first not-seen episode */
            const [sid, eid] = [match.params.sid || 1, match.params.eid || 1]
            const season = getOrder(item.seasons, sid)

            retItem = getOrder(season.episodes, eid)
        }  catch (e) {
            /* maybe we didn't get details yet ? */
            console.error("fetch details")
            return {
                ...props,
                shouldFetch: true
            }
        }
    }

    return retItem
}

let loading = false
const startStreamer = (props) => {
    const {isFetching, retItem, dispatch, streamer, history} = props

    if (retItem.shouldFetch) {
        return fetchDetail(props)
    }

    if (isFetching) {
        return props
    }

    if (streamer.loading) {
        loading = false
    }

    const quality = Object.keys(retItem.sources).pop()
    const url = retItem.sources[quality].url
    if (streamer.loaded === url || streamer.loading || loading) {
        console.error('already loading/loaded this content')
    } else {
        loading = true
        console.error('dispatching SERVE', url)
        dispatch(StreamerReduxer.actions.SERVE(url))
    }

    return {
        ...props,
        goBack: {
            action: () => {
                history.goBack()
                console.error('dispatching CLOSE')
                setTimeout(() => (
                    dispatch(StreamerReduxer.actions.CLOSE())
                ), 0)

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
