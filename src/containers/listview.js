'use strict;'

import { connect } from 'react-redux'
import ListView from '../components/listview'

import {bindFiltersActions} from '../redux/filters'

const mapStateToProps = ({tabs}, {match}) => {
    const tabId = match.params.tab
    let tab = tabs[tabId]
    tab.id = tabId

    const menu = Object.entries(tabs).map(([key, {name}]) => ({
        title: name,
        path: `/list/${key}`
    }))

    return {
        tab,
        menu,
    }
}

const mapDispatchToProps = (dispatch, {match, history}) => {
    const tabId = match.params.tab

    return {
        actions: {
            settings: () => (history.push('/settings')),
            ...bindFiltersActions(dispatch)
        }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(ListView)
