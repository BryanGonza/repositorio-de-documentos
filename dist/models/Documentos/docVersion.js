"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentoVersiones = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
// Modelo para la tabla "documentos_versiones"
exports.documentoVersiones = conexion_1.default.define('documentos_versiones', // nombre real de la tabla en la base
{
    ID_DOCUMENTO_VERSIONES: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ID_VERSION: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    ID_DOCUMENTO_DET: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    FECHA_DESDE: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    FECHA_HASTA: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    ESTADO: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false
    },
    DESCRIPCION: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: true
    }
}, {
    tableName: 'documentos_versiones',
    timestamps: false,
    freezeTableName: true
});
// Asociaciones (FK)
exports.documentoVersiones.associate = (models) => {
    // Relacion con tabla 'version' (modelo 'version')
    exports.documentoVersiones.belongsTo(models.version, {
        foreignKey: 'ID_VERSION',
        targetKey: 'ID_VERSION',
        as: 'version'
    });
    // Relacion con tabla 'documentos_det' (modelo 'documentoDet')
    exports.documentoVersiones.belongsTo(models.documentoDet, {
        foreignKey: 'ID_DOCUMENTO_DET',
        targetKey: 'ID_DOCUMENTO_DET',
        as: 'detalle'
    });
};
