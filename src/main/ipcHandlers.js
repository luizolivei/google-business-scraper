const {ipcMain} = require('electron');
const log = require('electron-log');
const {getAllCities, getCitiesByIds} = require('../app/controllers/cityController');
const {createSearchForCities, markSearchAsCompleted} = require("../app/controllers/searchController");
const {createSearchEnterpriseEntries} = require('../app/controllers/searchEnterpriseController');
const {saveBusinessInfo, getBusinessesBySearch} = require('../app/controllers/businessController');
const getDataFromSearch = require('../scripts/scraping/index.js');
const removeAccents = require("../scripts/mixins/script");
const {createHistoryWindow} = require("./window");
const {getAllSearches} = require('../app/controllers/searchController');
const {generateExcelFile} = require("../scripts/excelGenerator");
const { Notification } = require('electron');

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
                const searchTerm = removeAccents(`${term}+em+${city.nome}%2C+${city.estado.sigla}`).replace(/ /g, "+");
                const result = await getDataFromSearch(searchTerm);

                for (const searchResult of result) {
                    for (const [index, business] of searchResult["businesses"].entries()) {
                        business["page"] = searchResult["page"];
                        business["order"] = index + 1;
                        business["id_citie"] = city.id
                        business["city_name"] = city.nome

                        const businessId = await saveBusinessInfo(business);
                        businessIds.push(businessId);
                    }
                }
            }
            await createSearchEnterpriseEntries(mySearch, businessIds);
            await markSearchAsCompleted(mySearch);

            new Notification({
                title: 'Busca finalizada!',
                body: `Sua pesquisa sobre ${term} foi finalizada`,
            }).show();

            event.sender.send('search-results', {success: true});
        } catch (error) {
            event.sender.send('search-results', {error: 'Erro ao processar a busca'});
            log.error('Erro ao processar a busca e salvar os dados:', error);
            new Notification({
                title: 'Erro na pesquisa',
                body: error,
            }).show();
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
            log.error('Erro ao carregar o histórico de pesquisas:', error);
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
            log.error('Erro ao gerar o arquivo Excel:', error);
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
