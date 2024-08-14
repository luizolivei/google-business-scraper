const { app, BrowserWindow } = require('electron');
const path = require('path');
const { createMainWindow, createHistoryWindow } = require('./window');
const { setupIpcHandlers } = require('./ipcHandlers');

// Sincroniza o banco para atualizar no cliente
require('../scripts/database/syncTables');

app.whenReady().then(() => {
    createMainWindow();
    setupIpcHandlers();
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
