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

    mainWindow.loadURL(`file://${__dirname}/index.html`)
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
