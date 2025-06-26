"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tipoDocumentoCaracteristica = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
// Modelo para la tabla tipo_documento_caracteristica
exports.tipoDocumentoCaracteristica = conexion_1.default.define('tipo_documento_caracteristica', {
    ID_TIPO_DOCUMENTO_CARACTERISTICA: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ID_CARACTERISTICA: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    ID_DOCUMENTO: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    VALOR: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: true
    }
}, {
    tableName: 'tbl_tipo_documento_caracteristica',
    timestamps: false,
    freezeTableName: true
});
// Asociaciones (FK)
exports.tipoDocumentoCaracteristica.associate = (models) => {
    // Relacion con la tabla caracteristica
    exports.tipoDocumentoCaracteristica.belongsTo(models.caracteristica, {
        foreignKey: 'ID_CARACTERISTICA',
        targetKey: 'ID_CARACTERISTICA',
        as: 'caracteristica'
    });
    // Relacion con la tabla documentos
    exports.tipoDocumentoCaracteristica.belongsTo(models.documentos, {
        foreignKey: 'ID_DOCUMENTO',
        targetKey: 'ID_DOCUMENTO',
        as: 'documento'
    });
};
