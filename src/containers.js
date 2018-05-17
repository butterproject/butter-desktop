import { connect } from 'react-redux'

import List from 'butter-component-list';
import ButterSettings from 'butter-component-settings';
import ContentDetail from 'butter-component-content-details';

import ListView from './components/listview'
import PlayerView from './components/player'

import {actionDispatcher} from './redux/persist'

const locationToKey = (location) => (
    location.pathname.split('/').pop()
)

const tabConnect = ((mapStateToProps, mapDispatchToProps) => (
    connect(({tabs, collections, cache,  ...state}, {location, ...props}) => {
        const tab = tabs[locationToKey(location)]
        const cols = tab.providers.map(provider => collections[provider])

        const tabState = cols.reduce((acc, col) => ({
            items: acc.items.concat(
                col.items.map(i => cache[i])
            ),
            isFetching: acc.isFetching ? acc.isFetching : col.isFetching,
            failed: acc.failed ? acc.failed : col.failed
        }), {items: []})

        return mapStateToProps({
            ...state,
            tabState

        }, {
            ...props,
            location
        })
    }, mapDispatchToProps)
))

const ListContainer = tabConnect(
    ({tabState, persist}) => ({
        ...tabState,
        persist
    }),
    (dispatch, {location, history}) => ({
        actions: {
            show: (item) => history.push(`/movies/${locationToKey(location)}/${item.id}`),
            ...actionDispatcher(dispatch)
        }
    })
)(List)

const ButterSettingsContainer = connect (({settings, tabs}, props) => ({
    location: props.location,
    navbar: {goBack: () => (props.history.goBack())},
    settings,
    tabs
}))(ButterSettings)

const MovieViewContainer = connect (
    ({cache}, {match, history}) => {
        const item = cache[match.params.id]

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
            ...actionDispatcher(dispatch),
            play: () => history.push(`${location.pathname}/play`)
        }
    })
)(ContentDetail)

const PlayerViewContainer = connect (
    ({cache}, {match, history}) => {
        const item = cache[match.params.id]

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

const ListViewContainer = connect(({tabs}) => ({
    tabs,
}))(ListView)

export {ListContainer, ButterSettingsContainer, MovieViewContainer, PlayerViewContainer, ListViewContainer}
