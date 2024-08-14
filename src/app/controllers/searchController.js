const Search = require('../models/Search');
const Business = require('../models/Business');
const City = require('../models/City');
const SearchCity = require('../models/SearchCity');

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
        console.error("Erro ao buscar empresas por termo de busca:", error);
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

        console.log(`Busca "${searchTerm}" foi criada com sucesso para as cidades de IDs: ${cityIds.join(', ')}`);

        return newSearch.id;
    } catch (error) {
        console.error('Erro ao criar a busca:', error);
        throw error;
    }
};

const markSearchAsCompleted = async (searchId) => {
    try {
        const search = await Search.findByPk(searchId);

        if (!search) {
            console.log(`Busca com ID ${searchId} não encontrada.`);
            return null;
        }

        search.completed = true;
        await search.save();

        console.log(`Busca com ID ${searchId} foi marcada como completada.`);
        return search;
    } catch (error) {
        console.error('Erro ao atualizar a busca:', error);
        throw error;
    }
};

module.exports = {
    getEnterprisesBySearch,
    createSearchForCities,
    markSearchAsCompleted
};
