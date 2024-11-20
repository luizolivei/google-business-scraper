const { setupIpcMainHandlers } = require('./ipcMain');
const { setupIpcHistoryHandlers } = require('./ipcHistory');

function setupIpcHandlers() {
    setupIpcMainHandlers();
    setupIpcHistoryHandlers();
}

module.exports = {
    setupIpcHandlers,
};
