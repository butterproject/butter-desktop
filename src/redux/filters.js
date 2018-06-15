import {createActions, handleActions} from 'redux-actions'
import debounce from 'debounce'

const actions = createActions({
  SEARCH: undefined,
  GENRE: undefined,
  SORTER: undefined
})

const mapToState = (key) => (state, {payload}) => Object.assign({}, state, {[key]: payload})

const reducer = handleActions({
  SEARCH: mapToState('search'),
  GENRE: mapToState('genre'),
  SORTER: mapToState('sorter'),
}, {search: null, genre: null, sorter: 'trending'})

const bindFiltersActions = (dispatch) => ({
  search: debounce((term) => dispatch(actions.search(term)), 250),
  genre: (genre) => dispatch(actions.genre(genre)),
  sorter: (sorter) => dispatch(actions.sorter(sorter))
})

const filters = {
  reducer,
  actions
}

export {filters as default, bindFiltersActions}
