'use strict;'

import { connect } from 'react-redux'

import PlayerView from '../components/player'

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

export {PlayerViewContainer as default}
