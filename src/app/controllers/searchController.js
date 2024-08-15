const Search = require('../models/Search');
const Business = require('../models/Business');
const City = require('../models/City');
const SearchCity = require('../models/SearchCity');
const sequelize = require('../../config/database');

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

const getAllSearches = async () => {
    try {
        const searches = await sequelize.query(
            `SELECT 
                s.id as search_id, 
                s.search as term, 
                s.completed as completed, 
                s."createdAt" as created_at, 
                string_agg(c.nome, ', ') as cities
            FROM 
                searches s
            JOIN 
                search_cities sc ON s.id = sc.id_search
            JOIN 
                cidades c ON sc.id_citie = c.id
            GROUP BY 
                s.id
            ORDER BY 
                s."createdAt" DESC`,
            {
                type: sequelize.QueryTypes.SELECT
            }
        );

        return searches.map(search => ({
            id: search.search_id,
            term: search.term,
            completed: search.completed,
            createdAt: search.created_at,
            cities: search.cities.split(', ')
        }));
    } catch (error) {
        console.error('Erro ao buscar todas as pesquisas:', error);
        throw error;
    }
};
module.exports = {
    getEnterprisesBySearch,
    createSearchForCities,
    getAllSearches,
    markSearchAsCompleted
};
