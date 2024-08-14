const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Search = require('./Search');
const Business = require('./Business');

const SearchEnterprise = sequelize.define('SearchEnterprise', {
    id_search: {
        type: DataTypes.INTEGER,
        references: {
            model: Search,
            key: 'id',
        }
    },
    id_enterprise: {
        type: DataTypes.INTEGER,
        references: {
            model: Business,
            key: 'id',
        }
    },
}, {
    tableName: 'search_enterprises',
    timestamps: true,
});

Search.belongsToMany(Business, { through: SearchEnterprise, foreignKey: 'id_search' });
Business.belongsToMany(Search, { through: SearchEnterprise, foreignKey: 'id_enterprise' });

module.exports = SearchEnterprise;
