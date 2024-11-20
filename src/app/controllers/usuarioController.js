const sequelize = require('../../config/database');

//tabelas fora do padrao devem ser consultadas com a querie normal....
async function getAllUsers() {
    try {
        const query = `
            SELECT "Id", "NomeCompleto"
            FROM "usuario"
        `;
        const [results, metadata] = await sequelize.query(query);

        return results;
    } catch (error) {
        console.error('Erro ao carregar os usuarios:', error);
        throw error;
    }
}

async function getUserById(userId) {
    try {
        const query = `
            SELECT "Id", "NomeCompleto"
            FROM "usuario"
            WHERE "Id" = ${userId}
        `;
        const [results, metadata] = await sequelize.query(query);

        return results ? results[0] : [];
    } catch (error) {
        console.error('Erro ao carregar os usuarios:', error);
        throw error;
    }
}

module.exports = {
    getAllUsers,
    getUserById
};
