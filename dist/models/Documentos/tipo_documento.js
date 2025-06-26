"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tipo_documento = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
exports.tipo_documento = conexion_1.default.define('tipo_documento', {
    ID_TIPO_DOCUMENTO: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    TIPO_DOCUMENTO: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    ESTADO: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true },
}, {
    timestamps: false,
    tableName: 'tbl_tipo_documento',
    freezeTableName: true,
});
