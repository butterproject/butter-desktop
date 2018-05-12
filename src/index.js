'use strict;'
/* react */
import React, { Component } from 'react';
import { Switch, Route, NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

/* redux */
import {compose, createStore, applyMiddleware, combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk'
import persistState from 'redux-localstorage'

/* Providers */
import reduxProviderAdapter from 'butter-redux-provider';

const providers = [
    require('butter-provider-gdocs'),
    //    require('butter-provider-vodo'),
    require('butter-provider-ccc')
]

/* Components */
import {Window,  Menu} from 'butter-base-components';

require('./style.css')
import Router from './router';
import {reducer as persistReducer} from './actions'

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

const Identity = a => a
const hashify = (source, transformKey=Identity, transformValue=Identity) => (
    source.reduce((a, c) => (
        Object.assign(a, {
            [transformKey(c)]: transformValue(c)
        })
    ), {})
)

const hashifyReduxers = (source, resource) => (
    hashify(source,
            reduxer => reduxer.provider.config.name,
            reduxer => reduxer[resource])
)

const providerReduxers = providers.map((p) => (reduxProviderAdapter(p)))
const providerReducers = hashifyReduxers(providerReduxers, 'reducer')
const providerActions = hashifyReduxers(providerReduxers, 'actions')

const reducers = {
    collections: combineReducers({
        ...providerReducers
    }),
    providers: (state, action) => ({
        ...state,
        ...hashifyReduxers(providerReduxers, 'provider')
    })
}

const actions = {
    ...providerActions

}

const middlewares = [thunk]
const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(...middlewares), persistState('persist'))


const store = createStore(combineReducers({
    ...reducers,
    persist: persistReducer,
    router: routerReducer
}), enhancer)

Object.values(actions).map(a => store.dispatch(a.FETCH()))

export {RoutedNinja as default, store};
