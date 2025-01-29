"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ms_usuarios = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../database/conexion"));
exports.ms_usuarios = conexion_1.default.define(
//Tabla usuarios
'ms_usuarios', {
    ID_USUARIO: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NUM_IDENTIDAD: { type: sequelize_1.DataTypes.INTEGER, unique: true, allowNull: true },
    ID_CARGO: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    DIRECCION_1: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    DIRECCION_2: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    USUARIO: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    NOMBRE_USUARIO: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    ESTADO_USUARIO: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    CONTRASEÑA: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    ID_ROL: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    FECHA_ULTIMA_CONEXION: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    PREGUNTAS_CONTESTADAS: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    FECHA_CREACION: { type: sequelize_1.DataTypes.DATE, unique: true, allowNull: true },
    CREADO_POR: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    FECHA_MODIFICACION: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    MODIFICADO_POR: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    PRIMER_INGRESO: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    FECHA_VENCIMIENTO: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    CORREO_ELECTRONICO: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false },
}, {
    timestamps: false // Desactivar createdAt y updatedAt 
});
