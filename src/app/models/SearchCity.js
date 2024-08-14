const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Search = require('./Search');
const City = require('./City');

const SearchCity = sequelize.define('SearchCity', {
    id_search: {
        type: DataTypes.INTEGER,
        references: {
            model: Search,
            key: 'id',
        }
    },
    id_citie: {
        type: DataTypes.INTEGER,
        references: {
            model: City,
            key: 'id',
        }
    },
}, {
    tableName: 'search_cities',
    timestamps: true,
});

Search.belongsToMany(City, { through: SearchCity, foreignKey: 'id_search' });
City.belongsToMany(Search, { through: SearchCity, foreignKey: 'id_citie' });

module.exports = SearchCity;
