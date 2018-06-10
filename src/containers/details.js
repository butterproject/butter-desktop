'use strict;'

import ContentDetail from 'butter-component-content-details'

import {connectItem, fetchDetail} from '../utils'

const mapStateToProps = (item, {tabs, markers}, {match, history}) => ({
  goBack: {
    action: history.goBack,
    title: tabs[match.params.tab].name
  },
  markers
})

const mergeProps = ({actions, ...props}) => {
  const {match, history} = props
  const episodePath = (item) => item.episode ? `/e/${item.episode}` : ''
  const seasonPath = (item) => item.season ? `/s/${item.season}` : ''

  return fetchDetail({
    ...props,
    actions: {
      ...actions,
      play: (item) => history.push(`${match.url}${seasonPath(item)}${episodePath(item)}/play`),
      show: (item) => history.push(`${match.url}${seasonPath(item)}${episodePath(item)}`)
    }
  })
}

const ContentDetailContainer = connectItem(
  mapStateToProps, undefined, mergeProps)(ContentDetail)

export {ContentDetailContainer as default}
