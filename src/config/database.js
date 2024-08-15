const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const app = require('electron').app;

// Caminho do arquivo de configuração
const configPath = path.join(app.getPath('userData'), 'dbConfig.json');

// Função para inicializar o Sequelize
function initializeDatabase(dbConfig) {
    const sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
        host: dbConfig.host,
        dialect: 'postgres',
        logging: false,
    });

    module.exports = sequelize;
}

if (fs.existsSync(configPath)) {
    const dbConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    initializeDatabase(dbConfig);
} else {
    console.error('Arquivo de configuração do banco de dados não encontrado.');
    app.quit(); // Fecha o aplicativo se o arquivo de configuração não for encontrado
}

module.exports = {
    initializeDatabase,
};
