const City = require('../models/City');

const getAllCities = async () => {
    try {
        const cities = await City.findAll({
            attributes: ['id', 'nome'] // Inclua apenas os campos que você deseja retornar
        });
        return cities.map(city => city.get({ plain: true }));
    } catch (error) {
        console.error('Erro ao carregar as cidades:', error);
        throw error; // Deixe o erro propagar para ser tratado onde o método for chamado
    }
};

const getCitiesByIds = async (ids) => {
    try {
        const cities = await City.findAll({
            where: {
                id: ids
            },
            attributes: ['nome'] // Inclua apenas os campos que você deseja retornar
        });
        return cities.map(city => city.get({ plain: true }));
    } catch (error) {
        console.error('Erro ao buscar cidades pelos IDs:', error);
        throw error; // Deixe o erro propagar para ser tratado onde o método for chamado
    }
};

module.exports = {
    getAllCities,
    getCitiesByIds
};
