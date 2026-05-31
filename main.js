const { app, BrowserWindow, Menu, ipcMain } = require('electron');

// Creates the controller window where the user configures and spawns panes
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 420,
        height: 660, // initial height — auto-corrected after load
        title: "Overlay",
        webPreferences: {
            nodeIntegration: true,   // allows index.html to use require()
            contextIsolation: false, // required for nodeIntegration to work
        },
    });
    mainWindow.loadFile('index.html');

    // Once the page has rendered, resize the window to exactly fit its content
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript('document.body.scrollHeight').then(height => {
            const [width] = mainWindow.getContentSize();
            mainWindow.setContentSize(width, height);
        });
    });
}

// Maps pane type to the Windows background material — 'acrylic' gives the blur/frosted effect
const MATERIAL_MAP = {
    blur: 'acrylic',
    color: 'none',
};

// Listens for a 'create-pane' message from index.html and opens a new pane window
ipcMain.on('create-pane', (event, config) => {
    let pane = new BrowserWindow({
    backgroundMaterial: MATERIAL_MAP[config.type] ?? 'none',
    width: config.width,
    height: config.height,
    frame: false,      // no title bar or borders
    transparent: true, // allows the pane background to be see-through
    alwaysOnTop: config.layer === 'top',
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
});
    pane.loadFile('pane.html');
    // setOpacity controls the whole window's transparency (0 = invisible, 1 = fully opaque)
    pane.setOpacity(Number(config.opacity));

    // Send the config to pane.html once it has finished loading so it can apply the color
    pane.webContents.on('did-finish-load', () => {
        pane.webContents.send('init-pane', config);
    });
});

app.whenReady().then(createMainWindow);