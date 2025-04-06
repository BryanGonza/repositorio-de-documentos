"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permisos = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../database/conexion"));
exports.permisos = conexion_1.default.define('TBL_PERMISOS', {
    ID_PERMISO: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ID_ROL: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    PERMISO_INSERCION: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    PERMISO_ELIMINACION: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    PERMISO_ACTUALIZACION: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    PERMISO_CONSULTAR: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    CREADO_POR: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    MODIFICADO_POR: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    FECHA_CREACION: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    FECHA_MODIFICACION: { type: sequelize_1.DataTypes.DATE, allowNull: true }
}, {
    timestamps: false,
    tableName: 'TBL_PERMISOS',
    freezeTableName: true,
});
