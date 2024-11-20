const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

//Esse modelo esta completamente fora do padrao pois a tabela ja existia...

const Usuario = sequelize.define('Usuario', {
    Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    IdConsultorLegado: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    IdGuidConsultorLegado: {
        type: DataTypes.UUID,
        allowNull: true
    },
    NomeDominio: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    SenhaDominio: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    NomeCompleto: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    CelularCorporativo: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    SetorId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    FuncaoId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    DataInclusao: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    Excluido: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    Foto: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Nivel: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    GeraComissao: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    PercentualComissao: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    Ramal: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Prime2B: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    SenhaAdmin: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ClicksignKey: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    DataNascimento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    Documento: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    ClicksignSecret: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    NomeAbreviado: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    HashId: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'usuario',
    timestamps: false,
    freezeTableName: true,
    sync: { force: false },
    underscored: true,
    hooks: {
        beforeSync: () => {
            throw new Error("Sync operation not allowed for 'Usuario' model."); // Prevenir sync acidental
        }
    }
});

module.exports = Usuario;
