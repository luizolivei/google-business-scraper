const { BrowserWindow, app} = require('electron');
const path = require('path');

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 768,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../../assets/icons/icon.ico'),
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
        icon: path.join(__dirname, '../../assets/icons/icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    });

    newWindow.loadFile('src/renderer/views/history.html');
    return newWindow;
}

function createDBConfigWindow() {
    const promptWindow = new BrowserWindow({
        width: 450,
        height: 520,
        resizable: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../../assets/icons/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    promptWindow.loadFile('src/renderer/views/dbConfig.html');
    promptWindow.on('closed', () => {
        app.quit();
    });

    return promptWindow;
}

module.exports = {
    createDBConfigWindow,
    createMainWindow,
    createHistoryWindow
};
