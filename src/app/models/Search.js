const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Search = sequelize.define('Search', {
    search: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_name: {
        type: DataTypes.STRING,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'searches',
    timestamps: true,
});

module.exports = Search;
