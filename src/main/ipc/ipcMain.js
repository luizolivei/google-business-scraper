const { ipcMain } = require('electron');
const log = require('electron-log');
const { getAllCities, getCitiesByIds } = require('../../app/controllers/cityController');
const { getAllTitles } = require('../../app/controllers/tituloController');
const { createSearch, markSearchAsCompleted } = require('../../app/controllers/searchController');
const { createSearchEnterpriseEntries } = require('../../app/controllers/searchEnterpriseController');
const { saveBusinessInfo } = require('../../app/controllers/businessController');
const getDataFromSearch = require('../../scripts/scraping/index.js');
const { removeAccents, getConfigPath} = require('../../scripts/mixins/script');
const { Notification } = require('electron');
const {getAllUsers, getUserById} = require("../../app/controllers/usuarioController");
const fs = require("fs");

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

    ipcMain.on('load-users', async (event) => {
        try {
            // Inicializa as variáveis
            const configPath = getConfigPath();
            let config = {};
            let usersToInput = {};

            // Lê e parseia o arquivo de configuração
            try {
                const configFileContent = fs.readFileSync(configPath, 'utf-8');
                config = JSON.parse(configFileContent);
            } catch (readError) {
                log.warn('Arquivo de configuração não encontrado ou inválido:', readError);
            }

            const appUser = config?.appUser;

            if (!appUser) {
                // Caso nenhum usuário esteja configurado, carrega todos os usuários
                const users = await getAllUsers();
                usersToInput = {
                    isBlocked: false,
                    users: users
                };
            } else {
                // Caso um usuário específico esteja configurado
                const user = await getUserById(appUser);
                usersToInput = {
                    isBlocked: true,
                    users: user ? [user] : []
                };
            }

            // Envia os dados para o frontend
            event.sender.send('load-users', usersToInput);
        } catch (error) {
            log.error('Erro ao carregar os usuários:', error);
            event.sender.send('load-users', { error: 'Erro ao carregar os usuários' });
        }
    });


    ipcMain.on('search', async (event, { term, location, title, user }) => {
        try {
            const mySearch = await createSearch(term, location, user);
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
