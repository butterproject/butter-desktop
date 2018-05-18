'use strict;'
/* react */
import React, { Component } from 'react';
import { Switch, Route, NavLink, Redirect } from 'react-router-dom';

/* electron */
import {remote} from 'electron'

/* Components */
import {Window,  Menu} from 'butter-base-components';
import Logo from './logo';
import Router from '../router';

import {
    ButterSettingsContainer,
    MovieViewContainer,
    PlayerViewContainer,
    ListViewContainer,
} from '../containers';


require('./style.css')

const doOnWindow = (fn) => (
    (arg) => {
        const window = remote.getCurrentWindow()

        if (window) {
            return fn(window, arg)
        }

        return null
    }
)

const windowActions = {
    close: doOnWindow(window => window.close()),
    min: doOnWindow(window => window.minimize()),
    max: doOnWindow(window => window.isMaximized() ? window.unmaximize() : window.maximize()),
    fullscreen: doOnWindow((window, active) => window.setFullScreen(active))
}

const NinjaWindow = () => (
    <Window title={<Logo />} actions={windowActions}>
        <Switch>
            <Route path='/settings' component={ButterSettingsContainer} />
            <Route path={'/movies/:provider/:id/play'} component={PlayerViewContainer} />
            <Route path={'/movies/:provider/:id'} component={MovieViewContainer} />
            <Route path='/list' component={ListViewContainer}/>
            <Redirect to='/list' />
        </Switch>
    </Window>
)

const RoutedNinja = () => (
    <Router>
        <NinjaWindow/>
    </Router>
)

export {RoutedNinja as default}
