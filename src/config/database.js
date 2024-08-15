const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('guiafacil', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

module.exports = sequelize;
