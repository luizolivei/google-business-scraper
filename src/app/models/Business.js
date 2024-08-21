const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const City = require('./City');
const log = require('electron-log');

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
    compromissos: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    city_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    id_title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    processed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'businesses',
    timestamps: true,
});

Business.belongsTo(City, { foreignKey: 'id_citie' });

Business.getBusinessesBySearch = async function(searchId) {
    try {
        const query = `
            SELECT
                b.id,
                b.name,
                b.phone,
                b.address,
                b.rating,
                b."reviewCount",
                b.website,
                b.facebook,
                b.instagram,
                b.category,
                b.page,
                b."order",
                b.description,
                b.compromissos,
                b.city_name
            FROM
                businesses b
                    JOIN
                search_enterprises se ON se.id_enterprise = b.id
            WHERE
                se.id_search = :searchId
        `;

        const businesses = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { searchId }
        });

        return businesses;
    } catch (error) {
        log.error('Erro ao buscar empresas pela pesquisa:', error);
        throw error;
    }
};

module.exports = Business;
