const { ipcMain } = require('electron');
const log = require('electron-log');
const { createHistoryWindow } = require('../window');
const { getAllSearches } = require('../../app/controllers/searchController');
const { getBusinessesBySearch } = require('../../app/controllers/businessController');
const { generateExcelFile } = require('../../scripts/excelGenerator');

function setupIpcHistoryHandlers() {
    ipcMain.on('open-history-page', () => {
        createHistoryWindow();
    });

    ipcMain.on('load-search-history', async (event) => {
        try {
            const searches = await getAllSearches();
            event.sender.send('search-history', searches);
        } catch (error) {
            log.error('Erro ao carregar o histórico de pesquisas:', error);
            event.sender.send('search-history', { error: 'Erro ao carregar o histórico de pesquisas' });
        }
    });

    ipcMain.on('download-search', async (event, searchId) => {
        try {
            const businesses = await getBusinessesBySearch(searchId);
            const filePath = await generateExcelFile(businesses, searchId);

            event.sender.send('download-ready', { filePath });
        } catch (error) {
            log.error('Erro ao gerar o arquivo Excel:', error);
            event.sender.send('download-ready', { error: 'Erro ao gerar o arquivo Excel' });
        }
    });
}

module.exports = {
    setupIpcHistoryHandlers,
};
