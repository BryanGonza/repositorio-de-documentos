"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentoCaracteristica = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../../database/conexion"));
const Documentos_model_1 = require("./Documentos.model");
const TipoDocCaracteristica_1 = require("./TipoDocCaracteristica");
class DocumentoCaracteristica extends sequelize_1.Model {
}
exports.DocumentoCaracteristica = DocumentoCaracteristica;
DocumentoCaracteristica.init({
    ID_DOCUMENTO_CARACTERISTICA: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: "ID_DOCUMENTO_CARACTERISTICA",
    },
    ID_DOCUMENTO: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "ID_DOCUMENTO",
    },
    ID_TIPO_DOCUMENTO_CARACTERISTICA: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'ID_TIPO_DOCUMENTO_CARACTERISTICA'
    },
    VALOR: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        field: 'VALOR'
    },
}, {
    tableName: "tbl_documento_caracteristica",
    sequelize: conexion_1.default,
    timestamps: false,
    underscored: false,
});
// Relaciones
// Un documento puede tener muchas instancias de caracteristicas
Documentos_model_1.documentos.hasMany(DocumentoCaracteristica, {
    foreignKey: "ID_DOCUMENTO",
    as: "caracteristicas",
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
});
DocumentoCaracteristica.belongsTo(Documentos_model_1.documentos, {
    foreignKey: { name: "ID_DOCUMENTO", field: "ID_DOCUMENTO" },
    as: "documento",
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
});
// La plantilla de caracteristica (definicion) tiene muchas instancias
TipoDocCaracteristica_1.tipoDocumentoCaracteristica.hasMany(DocumentoCaracteristica, {
    foreignKey: "ID_TIPO_DOCUMENTO_CARACTERISTICA",
    as: "instancias",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
});
DocumentoCaracteristica.belongsTo(TipoDocCaracteristica_1.tipoDocumentoCaracteristica, {
    foreignKey: {
        name: "ID_TIPO_DOCUMENTO_CARACTERISTICA",
        field: "ID_TIPO_DOCUMENTO_CARACTERISTICA",
    },
    as: "definicion",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
});
exports.default = DocumentoCaracteristica;
