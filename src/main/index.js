const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const getDataFromSearch = require('../scripts/scraping/index.js');
const {saveBusinessInfo} = require('../app/controllers/businessController');
const {createSearchForCities, markSearchAsCompleted} = require("../app/controllers/searchController");
const {createSearchEnterpriseEntries} = require("../app/controllers/searchEnterpriseController");

//todo obviamente nao acessar o modelo aqui, so para testes mesmo
const City = require('../app/models/City');

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

    mainWindow.webContents.on('did-finish-load', async () => {
        try {
            const cities = await City.findAll({
                attributes: ['id', 'nome'],
                order: [['nome', 'ASC']]
            });
            mainWindow.webContents.send('load-cities', cities);
        } catch (error) {
            console.error('Erro ao carregar as cidades:', error);
        }
    });
}

//sincroniza o banco para atualizar no cliente
require('../scripts/database/syncTables');
const removeAccents = require("../scripts/mixin/script");

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

ipcMain.on('search', async (event, {term, location}) => {
    console.log("term", term);
    console.log("location", location);

    try {
        let searchTerm = term + " em " + location;
        const mySearch = await createSearchForCities(searchTerm, [5557, 5531], "jose")
        searchTerm = removeAccents(searchTerm).replace(/ /g, "+"); //made for google search
        const result = await getDataFromSearch(searchTerm);
        const businessIds = [];

        for (const searchResult of result) {
            for (let business of searchResult["businesses"]) {
                business["page"] = searchResult["page"];
                const businessId = await saveBusinessInfo(business);
                businessIds.push(businessId);
            }
        }

        await createSearchEnterpriseEntries(mySearch, businessIds);
        await markSearchAsCompleted(mySearch)

        event.sender.send('search-results', result);
    } catch (error) {
        console.error('Erro ao processar a busca e salvar os dados:', error);
        event.sender.send('search-results', {error: 'Erro ao processar a busca'});
    }
});
