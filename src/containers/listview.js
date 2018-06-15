'use strict;'

import { connect } from 'react-redux'
import ListView from '../components/listview'

import {bindFiltersActions} from '../redux/filters'

const mapStateToProps = ({tabs, filters, providerActions}, {match}) => {
    const tabId = match.params.tab
    let tab = tabs[tabId]
    tab.id = tabId

    tab.actions = {
        FETCH: tab.providers.map(({id}) => providerActions[id].FETCH)
    }

    const menu = Object.entries(tabs).map(([key, {name}]) => ({
        title: name,
        path: `/list/${key}`
    }))

    const config = tab.providers.reduce((acc, {config}) =>
        Object.assign({}, acc, {filters: config.filters}), {})
    return {
        tab,
        menu,
        filters,
        config,
    }
}


const mergeProps = ({tab, ...stateProps}, {dispatch}, {match, history, ...ownProps}) => {
    const {actions} = tab
    const providerActions = Object.keys(actions).reduce((acc, key) => Object.assign(acc, {
        [key]: (...args) => actions[key].map(action => dispatch(action(...args)))
    }), {})

    return {
        ...stateProps,
        ...ownProps,
        tab,
        actions: {
            settings: () => (history.push('/settings')),
            ...bindFiltersActions(dispatch),
            ...providerActions
        }
    }
}

export default connect(mapStateToProps, undefined, mergeProps)(ListView)
