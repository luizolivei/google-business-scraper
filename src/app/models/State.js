const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const State = sequelize.define('State', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sigla: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'estados',
    timestamps: false
});

module.exports = State;
