'use strict;'

import React from 'react'

import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import {Window} from 'butter-base-components'

import {windowActions} from './utils'
import createStore from './store'
import Settings from './settings'

import ButterSettingsContainer from './containers/settings'
import ContentDetailContainer from './containers/details'
import { PlayerShowContainer, LoadContainer, PlayContainer } from './containers/player'
import ListViewContainer from './containers/listview'

import Logo from './components/logo'

require('./style.css')

const ButterDesktop = (Settings = Settings) => ({
    Component: () => {
        const firstTab = Object.keys(Settings.tabs)[0]
        return (
            <Router>
                <Window title={<Logo />} actions={windowActions}>
                    <Switch>
                        <Route path='/settings' component={ButterSettingsContainer} />
                        <Route path='/play/:id' component={PlayContainer} />
                        <Route path='/list/:tab/:provider/:id/s/:sid/e/:eid/play' component={PlayerShowContainer} />
                        <Route path='/list/:tab/:provider/:id/s/:sid/play' component={PlayerShowContainer} />
                        <Route path='/list/:tab/:provider/:id/play' component={PlayerShowContainer} />
                        <Route path='/list/:tab/:provider/:id' component={ContentDetailContainer} />
                        <Route path='/list/:tab' component={ListViewContainer} />
                        <Route path='/details/:id' component={ContentDetailContainer} />
                        <Redirect to={`/list/${firstTab}`} />
                    </Switch>
                </Window>
            </Router>
        )
    },
    store: createStore(Settings)
})

const Butter = ButterDesktop(Settings)
export { Butter as default, ButterDesktop }
