"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Facultad = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
exports.Facultad = conexion_1.default.define('Facultad', {
    ID_FACULTAD: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    NOMBRE: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    ESTADO: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true }
}, {
    timestamps: false,
    tableName: 'tbl_facultad',
    freezeTableName: true,
});
