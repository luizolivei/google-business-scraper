const { ipcMain } = require('electron');
const log = require('electron-log');
const { getAllCities, getCitiesByIds } = require('../../app/controllers/cityController');
const { getAllTitles } = require('../../app/controllers/tituloController');
const { createSearchForCities, markSearchAsCompleted } = require('../../app/controllers/searchController');
const { createSearchEnterpriseEntries } = require('../../app/controllers/searchEnterpriseController');
const { saveBusinessInfo } = require('../../app/controllers/businessController');
const getDataFromSearch = require('../../scripts/scraping/index.js');
const { removeAccents } = require('../../scripts/mixins/script');
const { Notification } = require('electron');

function setupIpcMainHandlers() {
    ipcMain.on('load-cities', async (event) => {
        try {
            const cities = await getAllCities();
            event.sender.send('load-cities', cities);
        } catch (error) {
            log.error('Erro ao carregar as cidades:', error);
            event.sender.send('load-cities', { error: 'Erro ao carregar as cidades' });
        }
    });

    ipcMain.on('load-titles', async (event) => {
        try {
            const titles = await getAllTitles();
            event.sender.send('load-titles', titles);
        } catch (error) {
            log.error('Erro ao carregar os títulos:', error);
            event.sender.send('load-titles', { error: 'Erro ao carregar os títulos' });
        }
    });

    ipcMain.on('search', async (event, { term, location, title }) => {
        try {
            const mySearch = await createSearchForCities(term, location, 'admin');
            const selectedCities = await getCitiesByIds(location);

            const businessIds = [];
            for (const city of selectedCities) {
                const searchTerm = removeAccents(`${term}+em+${city.nome}%2C+${city.estado.sigla}`).replace(/ /g, '+');
                const result = await getDataFromSearch(searchTerm);

                for (const searchResult of result) {
                    for (const [index, business] of searchResult.businesses.entries()) {
                        business.page = searchResult.page;
                        business.order = index + 1;
                        business.id_citie = city.id;
                        business.codigo_ibge = city.codigo_ibge;
                        business.city_name = city.nome;
                        business.id_title = title;

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

            event.sender.send('search-results', { success: true });
        } catch (error) {
            log.error('Erro ao processar a busca e salvar os dados:', error);
            event.sender.send('search-results', { error: 'Erro ao processar a busca' });
            new Notification({
                title: 'Erro na pesquisa',
                body: 'Ocorreu um erro durante a pesquisa.',
            }).show();
        }
    });
}

module.exports = {
    setupIpcMainHandlers,
};
