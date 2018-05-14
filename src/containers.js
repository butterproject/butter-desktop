import { connect } from 'react-redux'

import List from 'butter-component-list';
import ButterSettings from 'butter-component-settings';
import ContentDetail from 'butter-component-content-details';

import ListView from './components/listview'
import PlayerView from './components/player'

import {actions} from './actions'

const persistActions = (dispatch) => ({
    favourites: {
        add: (id) => dispatch(actions.favourites.add(id)),
        remove: (id) => dispatch(actions.favourites.remove(id)),
    },  seen: {
        add: (id) => dispatch(actions.seen.add(id)),
        remove: (id) => dispatch(actions.seen.remove(id)),
    }
})

const locationToKey = (location) => (
    location.pathname.split('/').pop()
)

const collectionConnect = ((mapStateToProps, mapDispatchToProps) => (
    connect(({collections, ...state}, {location, ...props}) => (
        mapStateToProps({
            ...collections[locationToKey(location)],
            ...state
        }, {
            ...props,
            location
        })
    ), mapDispatchToProps)
))


const ListContainer = collectionConnect(
    ({items, cache, persist, isFetching, failed}) => ({
        items: items.map(i => cache[i]),
        isFetching,
        failed,
        persist
    }),
    (dispatch, {location, history}) => ({
        actions: {
            show: (item) => history.push(`/movies/${locationToKey(location)}/${item.id}`),
            ...persistActions(dispatch)
        }
    })
)(List)

const ButterSettingsContainer = connect (({settings}, props) => ({
    location: props.location,
    navbar: {goBack: () => (props.history.goBack())},
    ...settings
}))(ButterSettings)

const itemFromCache = (collection, id) => {
    const {items, cache} = collection

    return items
        .map(i => cache[i])
        .filter((i) => (i.id === id))
        .pop()
}

const MovieViewContainer = connect (
    ({collections}, {match, history}) => {
        const item = itemFromCache(collections[match.params.col], match.params.id)

        return {
            ...item,
            goBack: {
                action: history.goBack,
                title: 'Movies'
            }
        }
    },
    (dispatch, {location, history}) => ({
        actions: {
            ...persistActions(dispatch),
            play: () => history.push(`${location.pathname}/play`)
        }
    })
)(ContentDetail)

const PlayerViewContainer = connect (
    ({collections}, {match, history}) => {
        const item = itemFromCache(collections[match.params.col], match.params.id)

        if (! item) {
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

const ListViewContainer = connect(({providers}, {match, ...props}) => {
    return {
        providers,
    }
})(ListView)

export {ListContainer, ButterSettingsContainer, MovieViewContainer, PlayerViewContainer, ListViewContainer}
