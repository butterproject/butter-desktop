'use strict;'

/* redux */
import {compose, createStore, applyMiddleware, combineReducers} from 'redux'
import { routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'
import reduxProviderAdapter from 'butter-redux-provider'

/* storage */
import * as storage from 'redux-storage'
import createEngine from 'redux-storage-engine-localforage'
import debounce from 'redux-storage-decorator-debounce'
import filter from 'redux-storage-decorator-filter'
import localforage from 'localforage'
import LRU from 'lru-cache'

/* reducers/actions */
import markers from './redux/markers'
import filters from './redux/filters'
import streamer from './redux/streamer'

import {remote} from 'electron'

const forageConfig = {
  name: 'Butter',
  version: 1.0,
  size: 4980736
}

const loadCache = () => {
  const store = localforage.createInstance(Object.assign({storeName: 'butter_cache'},
    forageConfig))
  return store.keys().then((keys) => (
    Promise.all(keys.map(k => store.getItem(k)))
  )).then(dehydrate => createCache(store, dehydrate))
}

const createCache = (store, dehydrate = []) => {
  const cache = LRU({
    max: 1000,
    dispose: (k) => store.removeItem(k)
  })

  cache.load(dehydrate)

  cache.tick = setTimeout(() => {
    console.error('saving cache')
    cache.dump().map(hit => setTimeout(() => store.setItem(hit.k, hit), 0))
  }, 15000)

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

const buildRootReducer = (tabs, settings, cache) => {
  const {providerActions, providerReducers} = reducersFromTabs(tabs, cache)
  return combineReducers({
    ...providerReducers,
    markers: markers.reducer,
    filters: filters.reducer,
    streamer: streamer.reducer,
    router: routerReducer,
    cache: () => cache,
    providerActions: () => providerActions,
    settings: (state, action) => ({
      ...settings
    })
  })
}

const butterCreateStore = ({tabs, ...settings}) => {
  const persistEngine = debounce(
    filter(
      createEngine('butterstorage',
        Object.assign({
          storeName: 'redux_storage'
        }, forageConfig)
      ), ['markers', 'settings']),
    1500)
  const middlewares = [thunk, storage.createMiddleware(persistEngine)]
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const enhancer = composeEnhancers(applyMiddleware(...middlewares))

  return loadCache()
    .then(cache => {
      const rootReducer = buildRootReducer(tabs, settings, cache)
      const persistReducer = storage.reducer(rootReducer)
      const store = createStore(persistReducer, enhancer)

      storage.createLoader(persistEngine)(store)
        .catch(() => console.log('Failed to load previous state'))
        .then(() => {
          const {providerActions} = store.getState()

          Object.values(providerActions)
            .map(a => store.dispatch(a.FETCH({page: 0})))
        })

      return {store}
    })
}

export {butterCreateStore as default}
