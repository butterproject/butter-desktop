import {createActions, handleActions} from 'redux-actions'

const actions = createActions({
    ADD: undefined,
    ADD_BULK: undefined
})

const reducer = handleActions({
    ADD: (state, {payload}) => {
        state[payload.id] = payload
        return state
    },
    ADD_BULK: (state, {payload}) => ({
        ...state,
        ...payload.reduce((acc, cur) => (
            Object.assign(acc, {
                [cur.id]: cur
            })
        ), {})
    })
}, {})

const cache = {actions, reducer}

export { cache as default }
