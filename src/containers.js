import { connect } from 'react-redux'

import List from 'butter-component-list';
import ContentDetail from 'butter-component-content-details';
import ButterSettings from 'butter-component-settings';

import settingsTabs from './settings-tabs'

import ListView from './components/listview'
import PlayerView from './components/player'
import {actionDispatcher} from './redux/persist'

const locationToTabId = (location) => (
    location.pathname.split('/').pop()
)

const tabConnect = ((mapStateToProps, mapDispatchToProps) => (
    connect(({tabs, collections, cache,  ...state}, {location, ...props}) => {
        const tab = tabs[locationToTabId(location)]
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
            show: (item) => history.push(`/movies/${locationToTabId(location)}/${item.id}`),
            play: (item) => history.push(`/movies/${locationToTabId(location)}/${item.id}/play`),
            ...actionDispatcher(dispatch)
        }
    })
)(List)

const ButterSettingsContainer = connect (({settings}, props) => ({
    location: props.location,
    navbar: {goBack: {
        action: () => (props.history.goBack()),
    }},
    tabs: settingsTabs,
    settings
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
