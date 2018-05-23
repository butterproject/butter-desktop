// Basic init
const electron = require('electron')
const {app, BrowserWindow} = electron

// To avoid being garbage collected
let mainWindow
let config = {
  width: 800,
  height: 600,
  frame: false,
  transparent: true,
  defaultEncoding: 'utf8'
}

const createWindow = () => {
  if (process.env.NODE_ENV === 'development') {
    config.frame = true

    require('electron-reload')(`${__dirname}/../build`)

      const {
          default: installExtension,
          REACT_DEVELOPER_TOOLS,
          REDUX_DEVTOOLS
      } = require('electron-devtools-installer')

        ;[REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].map(e => (
      installExtension(e)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
    ))
  }

  mainWindow = new BrowserWindow(config)

  mainWindow.loadURL(`file://${__dirname}/index.html`)
}

app.on('ready', () => {
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
