import {createActions, handleActions} from 'redux-actions'
import debounce from 'debounce'

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
  search: debounce((term) => dispatch(actions.search(term)), 250)
})

const filters = {
  reducer,
  actions
}

export {filters as default, bindFiltersActions}
