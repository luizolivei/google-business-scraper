const { app, BrowserWindow } = require('electron');
const { promptForDbConfig, loadDbConfig } = require('../config/databaseConfigGenerator');
const { createMainWindow } = require('./window');

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
        const { setupIpcHandlers } = require('./ipc/ipcHandlers');
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
