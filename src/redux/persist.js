import {createActions, handleActions} from 'redux-actions'

const CRUDActions = {
    ADD: undefined,
    REMOVE: undefined,
}

const actions = createActions({
    FAVOURITES: CRUDActions,
    SEEN: CRUDActions,
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
    SEEN: CRUDHandlers('seen'),
}, {favourites: {}, seen: {}})

const persistActionsDispatcher = (dispatch) => ({
    favourites: {
        add: (id) => dispatch(actions.favourites.add(id)),
        remove: (id) => dispatch(actions.favourites.remove(id)),
    },  seen: {
        add: (id) => dispatch(actions.seen.add(id)),
        remove: (id) => dispatch(actions.seen.remove(id)),
    }
})

const persist = {
    reducer,
    actions
}

export {persist as default, persistActionsDispatcher}
