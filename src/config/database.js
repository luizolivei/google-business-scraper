const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const app = require('electron').app;
const log = require('electron-log');
const {getConfigPath} = require("../scripts/mixins/script");

const configPath = getConfigPath();

function initializeDatabase(dbConfig) {
    module.exports = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
        host: dbConfig.host,
        dialect: 'postgres',
        logging: false,
        // dialectOptions: {
        //     ssl: {
        //         require: true,
        //         rejectUnauthorized: false,
        //     }
        // }
    });
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
