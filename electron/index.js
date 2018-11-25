import React from 'react'
import { render } from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'

import i18n from './i18n'
import Butter from 'btm_src'

const {Component, store} = Butter

const root = document.getElementById('root')
root.className = 'theme-dark'

store.then(({store}) => render(
    React.createElement(
        I18nextProvider, {i18n},
        React.createElement(
            Provider, {store},
            React.createElement(Component)
        )
    ), root))

