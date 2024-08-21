const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Titulo = sequelize.define('Titulo', {
    Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false // Garante que valores nulos não são permitidos
    },
    IdTituloLegado: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    IdSecaoLegado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    URL: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    URLRedirect: {
        type: DataTypes.TEXT,
        allowNull: true // Permite valores nulos
    }
}, {
    tableName: 'titulo',
    timestamps: false,
    freezeTableName: true,
    sync: { force: false },
    underscored: true,
    hooks: {
        beforeSync: () => {
            throw new Error("Sync operation not allowed for 'Titulo' model."); // Prevenir sync acidental
        }
    }
});

module.exports = Titulo;
