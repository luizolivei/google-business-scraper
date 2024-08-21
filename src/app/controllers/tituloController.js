const Titulo = require('../models/Titulo');

async function getAllTitles() {
    try {
        const titles = await Titulo.findAll({
            attributes: ['id', 'descricao']
        });
        return titles.map(title => title.get({ plain: true }));
    } catch (error) {
        console.error('Erro ao carregar os títulos:', error);
        throw error;
    }
}

module.exports = {
    getAllTitles
};
