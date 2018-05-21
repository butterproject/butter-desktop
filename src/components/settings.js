'use strict;'

import React from 'react'
import tabs from './settings-tabs'

import Settings from 'butter-component-settings'

const SettingsWrapper = (props) => (
    <Settings tabs={tabs} {...props} />
)

