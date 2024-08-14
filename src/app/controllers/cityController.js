const City = require('../models/City');
const State = require('../models/State');

const getAllCities = async () => {
    try {
        const cities = await City.findAll({
            attributes: ['id', 'nome'],
            include: {
                model: State,
                as: 'estado',
                attributes: ['sigla']
            }
        });
        return cities.map(city => city.get({ plain: true }));
    } catch (error) {
        console.error('Erro ao carregar as cidades:', error);
        throw error;
    }
};

const getCitiesByIds = async (ids) => {
    try {
        const cities = await City.findAll({
            where: {
                id: ids
            },
            attributes: ['id', 'nome'],
            include: {
                model: State,
                as: 'estado',
                attributes: ['sigla']
            }
        });
        return cities.map(city => city.get({ plain: true }));
    } catch (error) {
        console.error('Erro ao buscar cidades pelos IDs:', error);
        throw error;
    }
};

module.exports = {
    getAllCities,
    getCitiesByIds
};
