"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentos = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
exports.documentos = conexion_1.default.define(
// Tabla documentos
'documentos', {
    ID_DOCUMENTO: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ID_USUARIO: { type: sequelize_1.DataTypes.NUMBER, allowNull: false },
    ID_VERSION: { type: sequelize_1.DataTypes.NUMBER, allowNull: true },
    ID_ESTADO: { type: sequelize_1.DataTypes.NUMBER, allowNull: false },
    ID_TIPO_DOCUMENTO: { type: sequelize_1.DataTypes.NUMBER, allowNull: true },
    NOMBRE: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    FORMATO: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    URL: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    URl_DOW: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    FECHA_SUBIDA: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    DRIVE_ID: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    ES_PUBLICO: { type: sequelize_1.DataTypes.NUMBER, allowNull: true },
    DESCRIPCION: { type: sequelize_1.DataTypes.STRING, allowNull: true }
}, {
    timestamps: false, // Desactivar createdAt y updatedAt 
    tableName: 'documentos',
    freezeTableName: true,
});
