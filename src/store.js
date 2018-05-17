'use strict;'

/* redux */
import {compose, createStore, applyMiddleware, combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk'
import persistState from 'redux-localstorage'
import reduxProviderAdapter from 'butter-redux-provider';

import persist from './redux/persist'
import cache from './redux/cache'

import {remote} from 'electron'

const Identity = a => a

const hashifyReduxers = (source, resource) => (
    source.reduce((acc, reduxer) => (
        Object.assign(acc, {
            [reduxer.provider.id]: reduxer[resource]
        })
    ), {})
)

const butterCreateStore = ({tabs, ...settings}) => {
    let providerReducers = {}
    let providerActions = {}

    const reducedTabs = Object.keys(tabs).reduce((acc, k) => {
        const tab = tabs[k]

        const providers = tab.providers.map(uri => {
            const name = uri.split('?')[0]
            let instance = null

            try {
                const Provider = remote.require(`butter-provider-${name}`)
                instance = new Provider(uri)
            } catch (e) {
                return null
n            }

            return instance
        }).filter(e => e)

        providers.forEach(provider => {
            const reduxer =  reduxProviderAdapter(provider, cache.actions)
            providerReducers[provider.id] = reduxer.reducer
            providerActions[provider.id]  = reduxer.actions
        })

        return Object.assign(acc, {
            [k]: Object.assign(tab, {
                providers: providers.map(provider => provider.id)
            })
        })
    }, {})

    const reducers = {
        collections: combineReducers({
            ...providerReducers
        }),
        settings: (state, action) => ({
            ...settings
        }),
        tabs: (state, action) => ({
            ...tabs
        })
    }

    const actions = {
        ...providerActions
    }

    const middlewares = [thunk]
    const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const enhancer = composeEnhancers(
        applyMiddleware(...middlewares),
        persistState(['persist', 'cache', 'settings'])
    )

    const store = createStore(combineReducers({
        ...reducers,
        cache: cache.reducer,
        persist: persist.reducer,
        router: routerReducer
    }), enhancer)

    Object.values(actions).map(a => store.dispatch(a.FETCH()))

    return store
}

export {butterCreateStore as default}
