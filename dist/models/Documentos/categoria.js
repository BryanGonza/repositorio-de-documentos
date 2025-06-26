"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoria = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
exports.categoria = conexion_1.default.define('categoria', {
    ID_CATEGORIA: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    CATEGORIA: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    ESTADO: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true },
}, {
    timestamps: false,
    tableName: 'tbl_categoria',
    freezeTableName: true,
});
