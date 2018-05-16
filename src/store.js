'use strict;'

/* redux */
import {compose, createStore, applyMiddleware, combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk'
import persistState from 'redux-localstorage'
import reduxProviderAdapter from 'butter-redux-provider';

import {reducer as persistReducer} from './actions'

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

const butterCreateStore = (providers) => {
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

    return store
}

export {butterCreateStore as default}
