'use strict;'

/* redux */
import {compose, createStore, applyMiddleware, combineReducers} from 'redux'
import { routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'
import reduxProviderAdapter from 'butter-redux-provider'

import persist from './redux/persist'

import {remote} from 'electron'

const providersFromTab = (tab) => (
  tab.providers.map(uri => {
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
)

const reducersFromTabs = (tabs) => {
  let providerReducers = {}
  let providerActions = {}

  const tabsReducers = Object.keys(tabs).reduce((acc, k) => {
    const tab = tabs[k]

    const providers = providersFromTab(tab)
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

  return {
    providerReducers: {
      collections: combineReducers(providerReducers),
      tabs: (state, action) => ({
        ...tabsReducers
      })
    },
    providerActions
  }
}

const butterCreateStore = ({tabs, ...settings}) => {
  const middlewares = [thunk]
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const enhancer = applyMiddleware(...middlewares)

  const {providerActions, providerReducers} = reducersFromTabs(tabs)
  const rootReducer = combineReducers({
    ...providerReducers,
    persist: persist.reducer,
    router: routerReducer,
    settings: (state, action) => ({
      ...settings
    })
  })

  const store = createStore(rootReducer, enhancer)

  Object.values(providerActions).map(a => store.dispatch(a.FETCH()))

  return {store, providerActions}
}

export {butterCreateStore as default}
