import React from 'react'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'
import { HashRouter } from 'react-router-dom'

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

let Router = ({children}) => (
    <HashRouter history={history}>
        {children}
    </HashRouter>
)

export {Router as default}
