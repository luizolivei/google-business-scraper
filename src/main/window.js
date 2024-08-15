const { BrowserWindow } = require('electron');
const path = require('path');

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 768,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    });

    mainWindow.loadFile('src/renderer/views/index.html');
    return mainWindow;
}

function createHistoryWindow() {
    const newWindow = new BrowserWindow({
        width: 900,
        height: 650,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    });

    newWindow.loadFile('src/renderer/views/history.html');
    return newWindow;
}

module.exports = {
    createMainWindow,
    createHistoryWindow
};
