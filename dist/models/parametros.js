"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parametros = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../database/conexion"));
exports.parametros = conexion_1.default.define(
//Tabla parametros
"parametros", {
    ID_PARAMETRO: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    PARAMETRO: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    VALOR: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    ADMIN_INTENTOS_INVALIDOS: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    ID_USUARIO: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    FECHA_CREACION: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    FECHA_MODIFICACION: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, {
    timestamps: false, // Desactivar createdAt y updatedAt
    tableName: "parametros",
    freezeTableName: true,
});
