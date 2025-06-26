"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.caracteristica = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
exports.caracteristica = conexion_1.default.define('caracteristica', {
    ID_CARACTERISTICA: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ID_TIPO_CARACTERISTICA: { type: sequelize_1.DataTypes.STRING, unique: true },
    CARACTERISTICA: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    VALORES_PREDETERMINADOS: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true }
}, {
    timestamps: false,
    tableName: 'tbl_caracteristica',
    freezeTableName: true,
});
