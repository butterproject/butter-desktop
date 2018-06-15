import {createAction, handleActions} from 'redux-actions'
import debounce from 'debounce'

const SEARCH = 'BUTTER/FILTERS/SEARCH'
const GENRE = 'BUTTER/FILTERS/GENRE'
const SORTER = 'BUTTER/FILTERS/SORTER'
const ORDER = 'BUTTER/FILTERS/ORDER'

const actions = {
  SEARCH: createAction(SEARCH),
  GENRE: createAction(GENRE),
  SORTER: createAction(SORTER),
  ORDER: createAction(ORDER)
}

const mapToState = (key) => (state, {payload}) => Object.assign({}, state, {[key]: payload})

const reducer = handleActions({
  [SEARCH]: mapToState('search'),
  [GENRE]: mapToState('genre'),
  [SORTER]: mapToState('sorter'),
  [ORDER]: mapToState('order'),
}, {search: null, genre: null, sorter: 'trending', order: 'desc'})

const bindFiltersActions = (dispatch) => ({
  search: debounce((term) => dispatch(actions.SEARCH(term)), 250),
  genre: (genre) => dispatch(actions.GENRE(genre)),
  sorter: (sorter) => dispatch(actions.SORTER(sorter)),
  order: (order) => dispatch(actions.ORDER(order))
})

const filters = {
  reducer,
  actions
}

export {filters as default, bindFiltersActions}
