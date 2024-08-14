const { ipcMain } = require('electron');
const { getAllCities, getCitiesByIds } = require('../app/controllers/cityController');
const { createSearchForCities, markSearchAsCompleted } = require("../app/controllers/searchController");
const { createSearchEnterpriseEntries } = require('../app/controllers/searchEnterpriseController');
const { saveBusinessInfo } = require('../app/controllers/businessController');
const getDataFromSearch = require('../scripts/scraping/index.js');
const removeAccents = require("../scripts/mixins/script");
const { createHistoryWindow } = require("./window");

function setupIpcHandlers() {
    ipcMain.on('load-cities', async (event) => {
        try {
            const cities = await getAllCities();
            event.sender.send('load-cities', cities);
        } catch (error) {
            event.sender.send('load-cities', { error: 'Erro ao carregar as cidades' });
        }
    });

    ipcMain.on('search', async (event, { term, location }) => {
        console.log("term", term);
        console.log("location", location);

        try {
            const mySearch = await createSearchForCities(term, location, "admin");
            const selectedCities = await getCitiesByIds(location);

            const businessIds = [];
            for (const city of selectedCities) {
                const searchTerm = removeAccents(`${term}+em+${city.nome},+${city.estado.sigla}`).replace(/ /g, "+");
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

            event.sender.send('search-results', { success: true });
        } catch (error) {
            console.error('Erro ao processar a busca e salvar os dados:', error);
            event.sender.send('search-results', { error: 'Erro ao processar a busca' });
        }
    });

    ipcMain.on('open-history-page', () => {
        createHistoryWindow();
    });
}

module.exports = {
    setupIpcHandlers
};
