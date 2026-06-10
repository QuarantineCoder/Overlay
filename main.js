const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');

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
    image: 'none',
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

// Duplicates a pane — offsets the new window by 20px and reads live size so resized panes copy correctly
ipcMain.on('duplicate-pane', (event, config) => {
    const origin = BrowserWindow.fromWebContents(event.sender);
    const [x, y] = origin.getPosition();
    const [currentWidth, currentHeight] = origin.getSize(); // actual size, not the original config value

    let pane = new BrowserWindow({
        backgroundMaterial: MATERIAL_MAP[config.type] ?? 'none',
        width: currentWidth,
        height: currentHeight,
        x: x + 20,
        y: y + 20,
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

// Opens a native file picker and returns the selected image path to the renderer
ipcMain.handle('pick-image', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'] }],
    });
    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

app.whenReady().then(createMainWindow);