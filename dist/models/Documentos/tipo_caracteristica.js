"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tipo_caracteristica = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
exports.tipo_caracteristica = conexion_1.default.define('tipo_caracteristica', {
    ID_TIPO_CARACTERISTICA: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    TIPO_CARACTERISTICA: { type: sequelize_1.DataTypes.STRING, allowNull: true }
}, {
    timestamps: false,
    tableName: 'tipo_caracteristica',
    freezeTableName: true,
});
