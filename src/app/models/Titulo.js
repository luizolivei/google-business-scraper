const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

//Esse modelo esta completamente fora do padrao pois a tabela ja existia...

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
        type: DataTypes.BIGINT,
        allowNull: false
    },
    Descricao: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    URL: {
        type: DataTypes.STRING(80),
        allowNull: true
    },
    URLRedirect: {
        type: DataTypes.STRING(80),
        allowNull: true
    },
    HabilitaVenda: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    dsHTitulo: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dsTitle: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dsDescription: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dsTextoSEO: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dsTitleBairro: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dsHTituloBairro: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dsDescriptionBairro: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dsTextoBairroSEO: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dsTitleLogradouro: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dsHTituloLogradouro: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dsDescriptionLogradouro: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dsTextoLogradouroSEO: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dsAltImagem: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Usuario: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    UsuarioId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    Excluido: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    DataInclusao: {
        type: DataTypes.DATE,
        allowNull: true
    },
    TituloHabilitadoId: {
        type: DataTypes.BIGINT,
        allowNull: true
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
