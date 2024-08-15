const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { createMainWindow } = require('./window');

const configPath = path.join(app.getPath('userData'), 'dbConfig.json');

function promptForDbConfig() {
    const promptWindow = new BrowserWindow({
        width: 450,
        height: 500,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    promptWindow.loadFile('src/renderer/views/dbConfig.html');
    promptWindow.on('closed', () => {
        app.quit();
    });

    const { ipcMain } = require('electron');
    ipcMain.on('save-db-config', (event, config) => {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        promptWindow.close();
        createMainWindow();
    });
}

function loadDbConfig() {
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
    return null;
}

app.whenReady().then(() => {
    const dbConfig = loadDbConfig();

    if (!dbConfig) {
        promptForDbConfig();
    } else {
        const { initializeDatabase } = require('../config/database');
        initializeDatabase(dbConfig); // Inicializa o banco de dados com a configuração existente
        const { setupIpcHandlers } = require('./ipcHandlers');
        createMainWindow();
        setupIpcHandlers();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});
