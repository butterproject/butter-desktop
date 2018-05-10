import { connect } from 'react-redux'

import List from 'butter-component-list';
import ButterSettings from 'butter-component-settings';

import MovieView from './components/movieview'
import ListView from './components/listview'

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
    ({items, cache, isFetching, failed}) => ({
        items: items.map(i => cache[i]),
        isFetching,
        failed,
    }),
    (dispatch, {location, history}) => ({
        action: (item) => history.push(`/movies/${locationToKey(location)}/${item.title}`)
    })
)(List)

const ButterSettingsContainer = connect (({settings}, props) => ({
    location: props.location,
    navbar: {goBack: () => (props.history.goBack())},
    ...settings
}))(ButterSettings)

const MovieViewContainer = connect (({collections}, {match, ...props}) => {
    const {items, cache} = collections[match.params.col]

    return {
        item: items
            .map(i => cache[i])
            .filter(
                (i) => (i.title === match.params.id)
            ).pop()
    }
})(MovieView)

const ListViewContainer = connect(({providers}, {match, ...props}) => {
    return {
        providers,
    }
})(ListView)

export {ListContainer, ButterSettingsContainer, MovieViewContainer, ListViewContainer}
