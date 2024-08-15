const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const City = require('./City');

const Business = sequelize.define('Business', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    facebook: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    instagram: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    page: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    id_citie: {
        type: DataTypes.INTEGER,
        references: {
            model: City,
            key: 'id',
        }
    },
}, {
    tableName: 'businesses',
    timestamps: true,
});

Business.belongsTo(City, { foreignKey: 'id_citie' });

module.exports = Business;
