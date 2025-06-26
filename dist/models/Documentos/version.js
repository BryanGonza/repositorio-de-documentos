"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
exports.version = conexion_1.default.define('version', {
    ID_VERSION: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ID_USUARIO: { type: sequelize_1.DataTypes.INTEGER, unique: true },
    NOMBRE: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    CAMBIOS: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true },
    FECHA_ACTU: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, {
    timestamps: false,
    tableName: 'tbl_version',
    freezeTableName: true,
});
