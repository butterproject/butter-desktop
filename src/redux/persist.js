import {createActions, handleActions} from 'redux-actions'

const CRUDActions = {
  ADD: undefined,
  REMOVE: undefined
}

const actions = createActions({
  FAVOURITES: CRUDActions,
  SEEN: CRUDActions
})

const CRUDHandlers = (item) => ({
  ADD: (state, {payload}) => {
    state[item][payload] = true
    return state
  },
  REMOVE: (state, {payload}) => {
    delete state[item][payload]
    return state
  }
})

const reducer = handleActions({
  FAVOURITES: CRUDHandlers('favourites'),
  SEEN: CRUDHandlers('seen')
}, {favourites: {}, seen: {}})

const bindPersistActions = (dispatch) =>
  Object.keys(actions)
    .reduce((acc, action) =>
      Object.assign(acc, {
        [action]: {
          add: (id) => dispatch(actions[action].add(id)),
          remove: (id) => dispatch(actions[action].remove(id))
        }
      }), {})

const persist = {
  reducer,
  actions
}

export {persist as default, bindPersistActions}
