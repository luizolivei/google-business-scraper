const {createDBConfigWindow, createMainWindow} = require("../main/window");
const {ipcMain, app} = require("electron");
const fs = require("fs");
const path = require("path");

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


module.exports = {
    promptForDbConfig,
    loadDbConfig,
};
