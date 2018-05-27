'use strict;'

/* redux */
import {compose, createStore, applyMiddleware, combineReducers} from 'redux'
import { routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'
import reduxProviderAdapter from 'butter-redux-provider'
import * as storage from 'redux-storage'
import createEngine from 'redux-storage-engine-localforage'
import debounce from 'redux-storage-decorator-debounce'
import filter from 'redux-storage-decorator-filter'

import LRU from 'lru-cache'

import markers from './redux/markers'
import filters from './redux/filters'

import {remote} from 'electron'

const createCache = (dehydrate) => {
  const cache = LRU({
    max: 1000
  })

  if (dehydrate) {
    LRU.load(dehydrate)
  }

  return cache
}

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

const reducersFromTabs = (tabs, cache) => {
  let providerReducers = {}
  let providerActions = {}

  const tabsReducers = Object.keys(tabs).reduce((acc, k) => {
    const tab = tabs[k]

    const providers = providersFromTab(tab)
    providers.forEach(provider => {
      const reduxer = reduxProviderAdapter(provider, cache)
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
  const persistEngine = debounce(
    filter(
      createEngine('butterstorage'),
      ['markers', 'collections', 'settings']),
    1500)
  const middlewares = [thunk, storage.createMiddleware(persistEngine)]
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const enhancer = composeEnhancers(applyMiddleware(...middlewares))

  const cache = createCache()
  const {providerActions, providerReducers} = reducersFromTabs(tabs, cache)
  const rootReducer = combineReducers({
    ...providerReducers,
    markers: markers.reducer,
    filters: filters.reducer,
    router: routerReducer,
    cache: () => cache,
    settings: (state, action) => ({
      ...settings
    })
  })

  const persistReducer = storage.reducer(rootReducer)

  const store = createStore(persistReducer, enhancer)

  storage.createLoader(persistEngine)(store)
         .catch(() => console.log('Failed to load previous state'))
         .then(() => Object.values(providerActions).map(a => store.dispatch(a.FETCH())))

  return {store, providerActions}
}

export {butterCreateStore as default}
