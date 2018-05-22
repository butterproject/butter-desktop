'use strict;'

/* redux */
import {compose, createStore, applyMiddleware, combineReducers} from 'redux'
import { routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'
import persistState from 'redux-localstorage'
import reduxProviderAdapter from 'butter-redux-provider'

import persist from './redux/persist'

import {remote} from 'electron'

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
        console.error('couldnt load provider', name)
        return null
      }

      return instance
    }).filter(e => e)

    providers.forEach(provider => {
      const reduxer = reduxProviderAdapter(provider)
      providerReducers[provider.id] = reduxer.reducer
      providerActions[provider.id] = reduxer.actions
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
      ...reducedTabs
    })
  }

  const middlewares = [thunk]
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares),
    persistState(['persist', 'settings'])
  )

  const store = createStore(combineReducers({
    ...reducers,
    persist: persist.reducer,
    router: routerReducer
  }), enhancer)

  Object.values(providerActions).map(a => store.dispatch(a.FETCH()))

  return {store, providerActions}
}

export {butterCreateStore as default}
