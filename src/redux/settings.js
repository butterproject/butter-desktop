import {createAction, handleActions} from 'redux-actions'

const SET = 'BUTTER/SETTINGS/SET'
const SET_ALL = 'BUTTER/SETTINGS/SET_ALL'

const actions = {
    SET: createAction(SET),
    SET_ALL: createAction(SET_ALL)
}

const reducerCreator = (cachedSettings) => handleActions({
    [SET]: (state, {payload}) => {
        const {key, value} = payload

        return {
            ...state,
            [key]: value
        }
    },
    [SET_ALL]: (state, {payload}) => ({...state, ...payload})
}, cachedSettings)

const bindSettingsActions = (dispatch) => ({
    set: (key, value) => dispatch(actions.SET({key, value})),
    setAll: (values) =>  dispatch(actions.SET_ALL(values)),
})

const settings = {
    reducerCreator,
    actions
}

export {settings as default, bindSettingsActions}
