'use strict;'

import { connect } from 'react-redux'
import ListView from '../components/listview'

const ListViewContainer = connect(({tabs}, {match}) => {
    const tab = Object.assign({id: match.params.tab}, tabs[match.params.tab])
    const menu = Object.entries(tabs).map(([key, value]) => ({
        title: value.name,
        path: `/list/${key}`
    }))

    return {
        tab,
        menu,
    }
})(ListView)

export {ListViewContainer as default}
