import { connect } from 'react-redux'

import List from 'butter-component-list';
import ButterSettings from 'butter-component-settings';

import MovieView from './components/movieview'
import ListView from './components/listview'

const locationToKey = (location) => (
    location.pathname.split('/').pop()
)

const ListContainer = connect(
    ({items}, {location}) => ({
        items: items[locationToKey(location)]
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

const MovieViewContainer = connect (({items}, {match, ...props}) => ({
    item: items[match.params.col].filter(
        (i) => (i.title === match.params.id)
    ).pop()
}))(MovieView)

const ListViewContainer = connect((state, props) => ({
    menu: Object.keys(state.items),
    items: state.items
}))(ListView)

export {ListContainer, ButterSettingsContainer, MovieViewContainer, ListViewContainer}
