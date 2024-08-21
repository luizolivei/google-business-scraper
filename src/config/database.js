const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const app = require('electron').app;
const log = require('electron-log');

const configPath = path.join(app.getPath('userData'), 'dbConfig.json');

function initializeDatabase(dbConfig) {
    const sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
        host: dbConfig.host,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            }
        }
    });


    module.exports = sequelize;
}

if (fs.existsSync(configPath)) {
    const dbConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    initializeDatabase(dbConfig);
} else {
    log.error('Arquivo de configuração do banco de dados não encontrado.');
    app.quit();
}

module.exports = {
    initializeDatabase,
};
