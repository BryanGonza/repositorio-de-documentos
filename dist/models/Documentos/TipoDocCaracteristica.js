"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tipoDocumentoCaracteristica = void 0;
exports.setupTipoDocumentoCaracteristicaAssociations = setupTipoDocumentoCaracteristicaAssociations;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
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
    ID_TIPO_DOCUMENTO: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'tbl_tipo_documento_caracteristica',
    timestamps: false,
    freezeTableName: true
});
// Definición completa de asociaciones
function setupTipoDocumentoCaracteristicaAssociations(models) {
    exports.tipoDocumentoCaracteristica.belongsTo(models.caracteristica, {
        foreignKey: 'ID_CARACTERISTICA',
        targetKey: 'ID_CARACTERISTICA',
        as: 'caracteristica'
    });
    exports.tipoDocumentoCaracteristica.belongsTo(models.tipo_documento, {
        foreignKey: 'ID_TIPO_DOCUMENTO',
        targetKey: 'ID_TIPO_DOCUMENTO',
        as: 'tipoDocumento'
    });
}
