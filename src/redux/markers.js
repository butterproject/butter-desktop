import {createActions, handleActions} from 'redux-actions'

const MARKERSActions = {
  ADD: undefined,
  REMOVE: undefined
}

const actions = createActions({
  FAVOURITES: MARKERSActions,
  SEEN: MARKERSActions
})

const MARKERSHandlers = (item) => ({
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
  FAVOURITES: MARKERSHandlers('favourites'),
  SEEN: MARKERSHandlers('seen')
}, {favourites: {}, seen: {}})

const bindMarkersActions = (dispatch) =>
  Object.keys(actions)
    .reduce((acc, action) =>
      Object.assign(acc, {
        [action]: {
          add: (id) => dispatch(actions[action].add(id)),
          remove: (id) => dispatch(actions[action].remove(id))
        }
      }), {})

const markers = {
  reducer,
  actions
}

export {markers as default, bindMarkersActions}
