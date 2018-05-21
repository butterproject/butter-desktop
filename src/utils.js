import React from 'react'

import {Toolbar} from 'butter-base-components'

/* electron */
import {remote} from 'electron'

const doOnWindow = (fn) =>
  (arg) => {
    const window = remote.getCurrentWindow()

    if (window) {
      return fn(window, arg)
    }

    return null
  }

const windowActions = {
  close: doOnWindow(window => window.close()),
  min: doOnWindow(window => window.minimize()),
  max: doOnWindow(window => window.isMaximized() ? window.unmaximize() : window.maximize()),
  fullscreen: doOnWindow((window, active) => window.setFullScreen(active))
}

const relativePath = (location, path) => {
  const basepath = location.pathname.split('/').slice(0, -1).join('/')

  path.replace(/^\//g, '')

  console.error('path', `${basepath}/${path}`)
  return `${basepath}/${path}`
}

const defaultToolbar = (history) => (
  <Toolbar search buttons={[
    {title: 'settings', icon: 'settings', action: () => (history.push('/settings'))}
  ]} />
)

export {
  relativePath,
  defaultToolbar,
  windowActions
}
