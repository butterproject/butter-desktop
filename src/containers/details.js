'use strict;'

import { connect } from 'react-redux'
import ContentDetail from 'butter-component-content-details';

import {bindPersistActions} from '../redux/persist'
import {providerActions} from '../'

const ContentDetailContainer = connect (
    ({cache, tabs, collections}, {match, history}) => {
        const item = cache[match.params.id]
        const tab = tabs[match.params.tab]
        const {isFetching} = collections[match.params.provider]

        return {
            ...item,
            isFetching,
            goBack: {
                action: history.goBack,
                title: tab.name
            }
        }
    },
    (dispatch, {location, history, match}) => ({
        dispatch,
        actions: {
            ...bindPersistActions(dispatch),
            ...providerActions[match.params.provider],
            play: () => history.push(`${location.pathname}/play`)
        }
    })
)(ContentDetail)

export {ContentDetailContainer as default}
