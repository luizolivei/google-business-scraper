const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sequelize = require('../config/database');
const getDataFromSearch = require('../scripts/scraping/index.js');
const { saveBusinessInfo } = require('../app/controllers/businessController');

async function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    });

    mainWindow.loadFile('src/renderer/views/index.html');

    // Sincronizar o banco de dados quando a janela principal é criada
    try {
        await sequelize.sync();
        console.log('Banco de dados sincronizado com sucesso.');
    } catch (error) {
        console.error('Erro ao sincronizar com o banco de dados:', error);
    }
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

    try {
        // Obter resultados da pesquisa (scraping)
        const result = await getDataFromSearch();

        // Salvar cada resultado no banco de dados
        for (const searchResult of result) {
        for (let business of searchResult["businesses"]) {
            business["page"] = searchResult["page"]
            await saveBusinessInfo(business);
        }
        }

        // Enviar os resultados para o renderer
        event.sender.send('search-results', result);
    } catch (error) {
        console.error('Erro ao processar a busca e salvar os dados:', error);
        event.sender.send('search-results', { error: 'Erro ao processar a busca' });
    }
});
