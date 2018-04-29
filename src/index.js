'use strict;'
/* General Imports */
import {combineReducers} from 'redux';
import React, { Component } from 'react';
import { Switch, Route, NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

/* Providers */
import ButterReduxProvider from 'butter-redux-provider';
import ButterProviderGDocs from 'butter-provider-gdocs';

/* Components */
import {Window,  Menu} from 'butter-base-components';

require('./style.css')
import Router from './router';

import {
    ButterSettingsContainer,
    MovieViewContainer,
    ListViewContainer
} from './containers';

import RotatingImages from './components/images';
import Logo from './components/logo';

let imgs = [
    'https://farm1.staticflickr.com/751/22609797817_f2e2ff56eb_o_d.jpg',
    'https://farm6.staticflickr.com/5800/31223777911_7b960ddaae_k_d.jpg',
    'https://farm6.staticflickr.com/5512/31337144505_0d1b06879c_k_d.jpg'
]

let debug = (e)=> {debugger}

let NinjaWindow = () => (
    <Window title={<Logo />}>
        <Switch>
            <Route path='/settings' component={ButterSettingsContainer} />
            <Route path={'/movies/:col/:id'} component={MovieViewContainer} />
            <Route path='/list' component={ListViewContainer}/>
            <Redirect to='/list' />
        </Switch>
    </Window>)

let ButterNinja = () => (
    <div>
        <RotatingImages imgs={imgs}/>
        <NinjaWindow />
    </div>
)

let RoutedNinja = () => (
    <Router>
        <ButterNinja />
    </Router>
)

const gdocsProvider = new ButterProviderGDocs()
const GDocsReduxProvider = new ButterReduxProvider(gdocsProvider)
const reducers = {
    collections: combineReducers({
        gdocs: GDocsReduxProvider.reducer,
    })
}

const actions = {
    gdocs: GDocsReduxProvider.actions,
}

export {RoutedNinja as default, reducers, actions};
