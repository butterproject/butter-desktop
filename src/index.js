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

import {remote} from 'electron'

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
    PlayerViewContainer,
    ListViewContainer,
} from './containers';

import Logo from './components/logo';

let debug = (e)=> {debugger}
const doOnWindow = (fn) => (
    () => {
        const window = remote.getCurrentWindow()

        if (window) {
            return fn(window)
        }

        return null
    }
)

const windowActions = {
    close: doOnWindow(window => window.close()),
    min: doOnWindow(window => window.minimize()),
    max: doOnWindow(window => window.isMaximized() ? window.unmaximize() : window.maximize()),
//    fullscreen: doOnWindow(window => window.fullscreen())
}

let NinjaWindow = () => (
    <Window title={<Logo />} actions={windowActions}>
        <Switch>
            <Route path='/settings' component={ButterSettingsContainer} />
            <Route path={'/movies/:col/:id/play'} component={PlayerViewContainer} />
            <Route path={'/movies/:col/:id'} component={MovieViewContainer} />
            <Route path='/list' component={ListViewContainer}/>
            <Redirect to='/list' />
        </Switch>
    </Window>
)

let RoutedNinja = () => (
    <Router>
        <NinjaWindow/>
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
