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

Search.getAllSearches = async function() {
    try {
        const searches = await sequelize.query(
            `SELECT 
                s.id as search_id, 
                s.search as term, 
                s.completed as completed, 
                s."createdAt" as created_at, 
                string_agg(c.nome, ', ') as cities
            FROM 
                searches s
            JOIN 
                search_cities sc ON s.id = sc.id_search
            JOIN 
                cidades c ON sc.id_citie = c.id
            GROUP BY 
                s.id
            ORDER BY 
                s."createdAt" DESC`,
            {
                type: sequelize.QueryTypes.SELECT
            }
        );

        return searches.map(search => ({
            id: search.search_id,
            term: search.term,
            completed: search.completed,
            createdAt: search.created_at,
            cities: search.cities.split(', ')
        }));
    } catch (error) {
        log.error('Erro ao buscar todas as pesquisas:', error);
        throw error;
    }
};

module.exports = Search;
