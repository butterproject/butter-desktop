'use strict;'

import ContentDetail from 'butter-component-content-details'

import {connectItem} from '../utils'

const wireGoBack = (item, {tabs}, {match, history}) => ({
  goBack: {
    action: history.goBack,
    title: tabs[match.params.tab].name
  }
})

const ContentDetailContainer = connectItem(
  wireGoBack, undefined, ({match, history}) => {
    const episodePath = (item) => item.episode ? `/e/${item.episode}` : ''
    const seasonPath = (item) => item.season ? `/e/${item.season}` : ''

    return {
      play: (item) => history.push(`${match.url}${seasonPath(item)}${episodePath(item)}/play`),
      show: (item) => history.push(`${match.url}${seasonPath(item)}${episodePath(item)}`)
    }
  })(ContentDetail)

export {ContentDetailContainer as default}
