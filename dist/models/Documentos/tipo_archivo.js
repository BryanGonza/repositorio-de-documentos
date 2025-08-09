"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tipo_archivo = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
exports.tipo_archivo = conexion_1.default.define('tipo_archivo', {
    ID_TIPO_ARCHIVO: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    TIPO_ARCHIVO: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    LIMITE_ALMACENAMIENTO: { type: sequelize_1.DataTypes.BIGINT, allowNull: true },
}, {
    timestamps: false,
    tableName: 'tbl_tipo_archivo',
    freezeTableName: true,
});
