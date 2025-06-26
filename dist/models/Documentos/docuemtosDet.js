"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentoDet = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
// Modelo para la tabla documentos_det (detalle de documentos)
exports.documentoDet = conexion_1.default.define("documentos_det", {
    ID_DOCUMENTO_DET: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    ID_DOCUMENTO: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    ID_DEPARTAMENTO: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    ID_CLASE: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    ID_ESTRUCTURA_ARCHIVOS: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    ID_TIPO_ARCHIVO: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    ID_TIPO_DOCUMENTO_CARACTERISTICA: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    ID_CATEGORIA: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    ID_SUB_CATEGORIA: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    FORMATO: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: true,
    },
    NOMBRE: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: true,
    },
}, {
    tableName: "tbl_documentos_det",
    timestamps: false,
    freezeTableName: true,
});
// Asociaciones 
exports.documentoDet.associate = (models) => {
    exports.documentoDet.belongsTo(models.documentos, {
        foreignKey: "ID_DOCUMENTO",
        targetKey: "ID_DOCUMENTO",
        as: "documento",
    });
    exports.documentoDet.belongsTo(models.departamentos, {
        foreignKey: "ID_DEPARTAMENTO",
        targetKey: "ID_DEPARTAMENTO",
        as: "departamento",
    });
    exports.documentoDet.belongsTo(models.clase, {
        foreignKey: "ID_CLASE",
        targetKey: "ID_CLASE",
        as: "clase",
    });
    exports.documentoDet.belongsTo(models.estructura_archivos, {
        foreignKey: "ID_ESTRUCTURA_ARCHIVOS",
        targetKey: "ID_ESTRUCTURA_ARCHIVOS",
        as: "estructuraArchivo",
    });
    exports.documentoDet.belongsTo(models.tipo_archivo, {
        foreignKey: "ID_TIPO_ARCHIVO",
        targetKey: "ID_TIPO_ARCHIVO",
        as: "tipoArchivo",
    });
    exports.documentoDet.belongsTo(models.tipo_documento_caracteristica, {
        foreignKey: "ID_TIPO_DOCUMENTO_CARACTERISTICA",
        targetKey: "ID_TIPO_DOCUMENTO_CARACTERISTICA",
        as: "caracteristica",
    });
    exports.documentoDet.belongsTo(models.categoria, {
        foreignKey: "ID_CATEGORIA",
        targetKey: "ID_CATEGORIA",
        as: "categoria",
    });
    exports.documentoDet.belongsTo(models.sub_categoria, {
        foreignKey: "ID_SUB_CATEGORIA",
        targetKey: "ID_SUB_CATEGORIA",
        as: "subCategoria",
    });
};
