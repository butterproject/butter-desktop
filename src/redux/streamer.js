import {createAsyncAction, createReducer} from 'redux-action-tools'
import {createAction, handleActions} from 'redux-actions'

import {remote} from 'electron'

const StreamServer = remote.require('butter-stream-server')

let server

const SERVE = 'BUTTER/STREAMER/SERVE'
const CLOSE = 'BUTTER/STREAMER/CLOSE'

const actions = {
    CLOSE: createAction(CLOSE),
    SERVE: createAsyncAction(SERVE, (url, dispatch, getState) => {
        if (server) {
            server.close()
        }

        return new Promise((resolve, reject) => {
            console.error('start streamer', url)
            server = new StreamServer(url, {
                progressInterval: 200,
                buffer: 100,
                port: 9999,
                writeDir: '',
            }).on('ready', ({streamUrl}) => {
                console.error('ready--->resolving', streamUrl)
                resolve(`${streamUrl}/0/?${url}`)
            })
        })
    })
}

const serveReducer = createReducer()
    .when(SERVE, ({...state}, {payload}) => ({
        ...state,
        loading: payload,
        loaded: null
    }))
    .done((state, {payload}) => ({
        ...state,
        url: payload,
        loading: false,
        loaded: state.loading
    }))
    .failed((state, action) => ({
        ...state,
        url: null,
        failed: action,
        loading: false
    }))
    .build()

const reducer = (state, action) => {
    if (! state) return {loading: false, loaded: null}

    switch(action.type) {
        case `${SERVE}`:
        case `${SERVE}_COMPLETED`:
        case `${SERVE}_FAILED`:
            return serveReducer(state, action)
        case CLOSE:
            server.close()
            return {...state, loading: false, loaded: null}
        default:
            return state
    }
}
const bindStreamerActions = (dispatch) => ({
    serve: (url) => dispatch(actions.serve(url))
})

const streamer = {
    reducer,
    actions
}

export {streamer as default, bindStreamerActions}
