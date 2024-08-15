const {ipcMain} = require('electron');
const {getAllCities, getCitiesByIds} = require('../app/controllers/cityController');
const {createSearchForCities, markSearchAsCompleted} = require("../app/controllers/searchController");
const {createSearchEnterpriseEntries} = require('../app/controllers/searchEnterpriseController');
const {saveBusinessInfo, getBusinessesBySearch} = require('../app/controllers/businessController');
const getDataFromSearch = require('../scripts/scraping/index.js');
const removeAccents = require("../scripts/mixins/script");
const {createHistoryWindow} = require("./window");
const {getAllSearches} = require('../app/controllers/searchController');
const {generateExcelFile} = require("../scripts/excelGenerator");

function setupIpcHandlers() {
    ipcMain.on('load-cities', async (event) => {
        try {
            const cities = await getAllCities();
            event.sender.send('load-cities', cities);
        } catch (error) {
            event.sender.send('load-cities', {error: 'Erro ao carregar as cidades'});
        }
    });

    ipcMain.on('search', async (event, {term, location}) => {
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

            event.sender.send('search-results', {success: true});
        } catch (error) {
            console.error('Erro ao processar a busca e salvar os dados:', error);
            event.sender.send('search-results', {error: 'Erro ao processar a busca'});
        }
    });

    ipcMain.on('open-history-page', () => {
        createHistoryWindow();
    });

    ipcMain.on('load-search-history', async (event) => {
        try {
            const searches = await getAllSearches();
            event.sender.send('search-history', searches);
        } catch (error) {
            console.error('Erro ao carregar o histórico de pesquisas:', error);
            event.sender.send('search-history', {error: 'Erro ao carregar o histórico de pesquisas'});
        }
    });

    ipcMain.on('download-search', async (event, searchId) => {
        try {
            const businesses = await getBusinessesBySearch(searchId);
            const filePath = await generateExcelFile(businesses, searchId);

            // Enviar o caminho do arquivo para o frontend
            event.sender.send('download-ready', { filePath });

        } catch (error) {
            console.error('Erro ao gerar o arquivo Excel:', error);
            event.sender.send('download-ready', { error: 'Erro ao gerar o arquivo Excel' });
        }
    });

    module.exports = {
        setupIpcHandlers
    };

}

module.exports = {
    setupIpcHandlers
};
