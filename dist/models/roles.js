"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ms_roles = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../database/conexion"));
exports.ms_roles = conexion_1.default.define('ms_roles', {
    ID_ROL: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
    },
    ROL: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    DESCRIPCION: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    FECHA_CREACION: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    CREADO_POR: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    FECHA_MODIFICACION: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    MODIFICADO_POR: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, {
    timestamps: false, // Desactivar createdAt y updatedAt 
    tableName: 'tbl_roles',
    freezeTableName: true,
});
