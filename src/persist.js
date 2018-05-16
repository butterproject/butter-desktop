import {createActions, handleActions} from 'redux-actions'

const CRUDActions = {
    ADD: undefined,
    REMOVE: undefined,
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

export {actions, reducer}
