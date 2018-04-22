import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Switch, Route, NavLink, Redirect } from 'react-router-dom';

require('./style.css')

import Router from './router';
import {Window,  Menu} from 'butter-base-components';

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

let NinjaWindow = ({settings, ...props}) => (
    <Window title={<Logo />}>
        <Switch>
            <Route path='/settings' component={ButterSettingsContainer} />
            <Route path={'/movies/:col/:id'} component={MovieViewContainer} />
            <Route path='/list' component={ListViewContainer}/>
            <Redirect to='/list' />
        </Switch>
    </Window>)

let ButterNinja = (props) => (
    <div>
        <RotatingImages imgs={imgs}/>
        <NinjaWindow {...props} />
    </div>
)

let RoutedNinja = (props) => (
    <Router>
        <ButterNinja />
    </Router>
)

export default RoutedNinja;
