const sequelize = require('../../config/database');

//tabelas fora do padrao devem ser consultadas com a querie normal....
async function getAllTitles() {
    try {
        const query = `
            SELECT "Id", "Descricao"
            FROM "titulo"
        `;
        const [results, metadata] = await sequelize.query(query);

        return results;
    } catch (error) {
        console.error('Erro ao carregar os títulos:', error);
        throw error;
    }
}

module.exports = {
    getAllTitles
};
