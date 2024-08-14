const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const City = sequelize.define('City', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    codigo_ibge: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    estado_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    populacao_2010: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    densidade_demo: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    gentilico: {
        type: DataTypes.STRING(250),
        allowNull: true,
    },
    area: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
}, {
    tableName: 'cidades',
    timestamps: false,
});

module.exports = City;
