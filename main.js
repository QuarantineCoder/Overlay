const { app, BrowserWindow, Menu, ipcMain } = require('electron');

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 400,
        height: 300,
        title: "Overlay",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    mainWindow.loadFile('index.html');
}

ipcMain.on('create-pane', (event, config) => {
    let pane = new BrowserWindow({
    width: 200,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    backgroundColor: '#00000000',
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
});

    // We create a second HTML file just for the panes
    pane.loadFile('pane.html');

    // Once the pane is ready, tell it what color to be
    pane.webContents.on('did-finish-load', () => {
        pane.webContents.send('init-pane', config);
    });
    console.log("Spawn request received!", config);
});
app.whenReady().then(createMainWindow);