import React from 'react';
import { render } from 'react-dom';
import { I18nextProvider} from 'react-i18next';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk'

import Component, {actions, reducers} from './src';
import i18n from './i18n';

const root = document.getElementById('root')
root.className = 'theme-dark';

const middlewares = [thunk]
const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(combineReducers({
    ...reducers,
    router: routerReducer
}), composeEnhancers(applyMiddleware(...middlewares)))

Object.values(actions).map(a => store.dispatch(a.FETCH()))

render(
    <I18nextProvider i18n={ i18n }>
        <Provider store={store}>
            <Component/>
        </Provider>
    </I18nextProvider>,
    root);

