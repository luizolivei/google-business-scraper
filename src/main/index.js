const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { createMainWindow, createDBConfigWindow } = require('./window');

const configPath = path.join(app.getPath('userData'), 'dbConfig.json');

function promptForDbConfig() {
    promptWindow = createDBConfigWindow()

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
    if (process.platform === 'win32')
    {
        app.setAppUserModelId(app.name);
    }

    const dbConfig = loadDbConfig();

    if (!dbConfig) {
        promptForDbConfig();
    } else {
        const { initializeDatabase } = require('../config/database');
        initializeDatabase(dbConfig);
        require('../scripts/database/syncTables');
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
