"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estructura_archivos = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
exports.estructura_archivos = conexion_1.default.define('estructura_archivos', {
    ID_ESTRUCTURA_ARCHIVOS: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ID_DEPARTAMENTO: { type: sequelize_1.DataTypes.INTEGER, unique: true },
    ESPACIO_ALMACENAMIENTO: { type: sequelize_1.DataTypes.BIGINT, allowNull: true },
    NOMBRE: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    UBICACION: { type: sequelize_1.DataTypes.STRING, allowNull: true }
}, {
    timestamps: false,
    tableName: 'estructura_archivos',
    freezeTableName: true,
});
