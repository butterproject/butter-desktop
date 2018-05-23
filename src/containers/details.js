'use strict;'

import ContentDetail from 'butter-component-content-details'

import {connectItem} from '../utils'

const wireGoBack = (item, {tabs}, {match, history}) => ({
  goBack: {
    action: history.goBack,
    title: tabs[match.params.tab].name
  }
})

const ContentDetailContainer = connectItem(wireGoBack, undefined, {
  play: (item) => history.push(`${location.pathname}/play`),
  show: (item) => history.push(`${location.pathname}/e/${item.episode}`)
})(ContentDetail)

export {ContentDetailContainer as default}
