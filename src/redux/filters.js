import {createActions, handleActions} from 'redux-actions'

const actions = createActions({
  SEARCH: undefined
})

const reducer = handleActions({
  SEARCH: (state, {payload}) => ({
    ...state,
    search: payload
  })
}, {search: null})

const bindFiltersActions = (dispatch) => ({
  search: (term) => dispatch(actions.search(term))
})

const filters = {
  reducer,
  actions
}

export {filters as default, bindFiltersActions}
