'use strict;'

import { connect } from 'react-redux'
import ButterSettings from 'butter-component-settings'

import settingsTabs from '../settings-tabs'
import { bindSettingsActions } from '../redux/settings'

const mapStateToProps = ({settings}, props) => ({
  location: props.location,
  navbar: {goBack: {
    action: () => (props.history.goBack())
  }},
  tabs: settingsTabs,
  settings
})

const mergeProps = ({settings, ...stateProps}, {dispatch}, ownProps) => {
  const actions = bindSettingsActions(dispatch)

  return {
    ...stateProps,
    ...ownProps,
    settings: {
      ...settings,
      set: actions.set
    }
  }
}

const ButterSettingsContainer = connect(
  mapStateToProps,
  undefined,
  mergeProps
)(ButterSettings)

export {ButterSettingsContainer as default}
