const Search = require('../models/Search');
const Business = require('../models/Business');
const City = require('../models/City');
const SearchCity = require('../models/SearchCity');
const sequelize = require('../../config/database');
const log = require('electron-log');

const getEnterprisesBySearch = async (searchTerm) => {
    try {
        const enterprises = await Business.findAll({
            include: [
                {
                    model: Search,
                    where: { search: searchTerm },
                    through: { attributes: [] }
                },
                {
                    model: City
                }
            ],
            order: [[City, 'cidade', 'ASC'], [City, 'estado', 'ASC']]
        });
        return enterprises;
    } catch (error) {
        log.error("Erro ao buscar empresas por termo de busca:", error);
        throw error;
    }
};

const createSearchForCities = async (searchTerm, cityIds, userName) => {
    try {
        const newSearch = await Search.create({
            search: searchTerm,
            user_name: userName,
            completed: false
        });

        const searchCityEntries = cityIds.map(cityId => {
            return {
                id_search: newSearch.id,
                id_citie: cityId
            };
        });

        await SearchCity.bulkCreate(searchCityEntries);

        log.info(`Busca "${searchTerm}" foi criada com sucesso para as cidades de IDs: ${cityIds.join(', ')}`);

        return newSearch.id;
    } catch (error) {
        log.error('Erro ao criar a busca:', error);
        throw error;
    }
};

const markSearchAsCompleted = async (searchId) => {
    try {
        const search = await Search.findByPk(searchId);

        if (!search) {
            log.info(`Busca com ID ${searchId} não encontrada.`);
            return null;
        }

        search.completed = true;
        await search.save();

        log.info(`Busca com ID ${searchId} foi marcada como completada.`);
        return search;
    } catch (error) {
        log.error('Erro ao atualizar a busca:', error);
        throw error;
    }
};

const getAllSearches = async () => {
    try {
        return await Search.getAllSearches()
    } catch (error) {
        log.error('Erro ao buscar todas as pesquisas:', error);
        throw error;
    }
};
module.exports = {
    getEnterprisesBySearch,
    createSearchForCities,
    getAllSearches,
    markSearchAsCompleted
};
