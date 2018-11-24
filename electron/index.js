import React from 'react'
import { render } from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'

import Butter from '../src'
import i18n from './i18n'

const {Component, store} = Butter

const root = document.getElementById('root')
root.className = 'theme-dark'

store.then(({store}) => render(
    <I18nextProvider i18n={i18n}>
        <Provider store={store}>
            <Component />
        </Provider>
    </I18nextProvider>,
    root))

