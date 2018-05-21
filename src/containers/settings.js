'use strict;'

import { connect } from 'react-redux'
import ButterSettings from 'butter-component-settings'

import settingsTabs from '../settings-tabs'

const ButterSettingsContainer = connect(({settings}, props) => ({
  location: props.location,
  navbar: {goBack: {
    action: () => (props.history.goBack())
  }},
  tabs: settingsTabs,
  settings
}))(ButterSettings)

export {ButterSettingsContainer as default}
