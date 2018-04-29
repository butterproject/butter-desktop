import { connect } from 'react-redux'

import List from 'butter-component-list';
import ButterSettings from 'butter-component-settings';

import MovieView from './components/movieview'
import ListView from './components/listview'

const locationToKey = (location) => (
    location.pathname.split('/').pop()
)

const ListContainer = connect(
    ({collections}, {location}) => {
        const {items, cache, isFetching, failed} = collections[locationToKey(location)]

        return {
            items: items.map(i => cache[i]),
            isFetching,
            failed,
        }
    },
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

const ListViewContainer = connect(({collections}, {match, ...props}) => {
    return {
        menu: Object.keys(collections)
    }
})(ListView)

export {ListContainer, ButterSettingsContainer, MovieViewContainer, ListViewContainer}
