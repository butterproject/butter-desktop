// Basic init
const electron = require('electron')
const {app, BrowserWindow} = electron

// To avoid being garbage collected
let mainWindow

app.on('ready', () => {
    if (process.env.NODE_ENV === 'development') {
        require('electron-reload')(`${__dirname}/../build`)

        const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF } = require('electron-devtools-installer');

        ;[REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF].map(e => (
            installExtension(e)
                .then((name) => console.log(`Added Extension:  ${name}`))
                .catch((err) => console.log('An error occurred: ', err))
        ))
    }

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        transparent: true,
        defaultEncoding: 'utf8'
    })

    mainWindow.loadURL(`file://${__dirname}/../index.html`)

})
