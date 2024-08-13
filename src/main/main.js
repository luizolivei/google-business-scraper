const { app, BrowserWindow, ipcMain } = require('electron');
const getDataFromSearch = require('../scripts/scraping/index.js');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    });

    mainWindow.loadFile('src/renderer/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('search', async (event, { term, location }) => {
    console.log("term", term);
    console.log("location", location);
    const result = await getDataFromSearch();
    event.sender.send('search-results', result);
});