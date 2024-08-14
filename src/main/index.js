const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const getDataFromSearch = require('../scripts/scraping/index.js');
const {saveBusinessInfo} = require('../app/controllers/businessController');
const {createSearchForCities, markSearchAsCompleted} = require("../app/controllers/searchController");
const {createSearchEnterpriseEntries} = require("../app/controllers/searchEnterpriseController");
const {getAllCities, getCitiesByIds} = require('../app/controllers/cityController');

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

ipcMain.on('load-cities', async (event) => {
    try {
        const cities = await getAllCities(); // Usando o controller para carregar todas as cidades
        event.sender.send('load-cities', cities);
    } catch (error) {
        event.sender.send('load-cities', {error: 'Erro ao carregar as cidades'});
    }
});

// ipcMain.on('load-search-history', async (event) => {
//     try {
//         const searches = await getAllSearches(); // Supondo que você tenha um método para buscar todas as pesquisas
//         event.sender.send('search-history', searches);
//     } catch (error) {
//         console.error('Erro ao carregar o histórico de pesquisas:', error);
//         event.sender.send('search-history', {error: 'Erro ao carregar o histórico de pesquisas'});
//     }
// });


ipcMain.on('search', async (event, {term, location}) => {
    console.log("term", term);
    console.log("location", location);

    try {
        const mySearch = await createSearchForCities(term, location, "admin");

        const selectedCities = await getCitiesByIds(location);

        const businessIds = [];
        for (const city of selectedCities) {
            const searchTerm = removeAccents(term + "+em+" + city.nome + ", " + city.estado.sigla).replace(/ /g, "+");
            const result = await getDataFromSearch(searchTerm);

            for (const searchResult of result) {
                for (let business of searchResult["businesses"]) {
                    business["page"] = searchResult["page"];
                    const businessId = await saveBusinessInfo(business);
                    businessIds.push(businessId);
                }
            }
        }
        await createSearchEnterpriseEntries(mySearch, businessIds);
        await markSearchAsCompleted(mySearch);

        event.sender.send('search-results', businessIds);
    } catch (error) {
        console.error('Erro ao processar a busca e salvar os dados:', error);
        event.sender.send('search-results', {error: 'Erro ao processar a busca'});
    }
});
