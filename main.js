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

const MATERIAL_MAP = {
    blur: 'acrylic',
    color: 'none',
};

ipcMain.on('create-pane', (event, config) => {
    let pane = new BrowserWindow({
    backgroundMaterial: MATERIAL_MAP[config.type] ?? 'none',
    width: config.width,
    height: config.height,
    frame: false,
    transparent: true,
    alwaysOnTop: config.layer === 'top',
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
});
    pane.loadFile('pane.html');
    pane.setOpacity(Number(config.opacity));
    
    pane.webContents.on('did-finish-load', () => {
        pane.webContents.send('init-pane', config);
    });
});
app.whenReady().then(createMainWindow);