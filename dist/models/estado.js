"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estado = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../database/conexion"));
exports.estado = conexion_1.default.define('estado', {
    ID_ESTADO: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ESTADO: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, {
    timestamps: false,
    tableName: 'estado',
    freezeTableName: true,
});
