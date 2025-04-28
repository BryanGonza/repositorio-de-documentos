"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caracteristica = exports.tipo_archivo = exports.clases = exports.s_categoria = exports.categoria = exports.departamentos = exports.tipoDocumentoCaracteristica = exports.version = exports.documentoVersiones = exports.documentoDet = exports.documentos = exports.ms_usuarios = exports.parametros = exports.ms_objetos = exports.permisos = void 0;
const departamentos_1 = require("./UNAH/departamentos");
Object.defineProperty(exports, "departamentos", { enumerable: true, get: function () { return departamentos_1.departamentos; } });
const categoria_1 = require("./Documentos/categoria");
Object.defineProperty(exports, "categoria", { enumerable: true, get: function () { return categoria_1.categoria; } });
const s_categoria_1 = require("./Documentos/s_categoria");
Object.defineProperty(exports, "s_categoria", { enumerable: true, get: function () { return s_categoria_1.s_categoria; } });
const clase_1 = require("./UNAH/clase");
Object.defineProperty(exports, "clases", { enumerable: true, get: function () { return clase_1.clases; } });
const tipo_archivo_1 = require("./Documentos/tipo_archivo");
Object.defineProperty(exports, "tipo_archivo", { enumerable: true, get: function () { return tipo_archivo_1.tipo_archivo; } });
const caracteristica_1 = require("./Documentos/caracteristica");
Object.defineProperty(exports, "caracteristica", { enumerable: true, get: function () { return caracteristica_1.caracteristica; } });
const permisos_1 = require("./permisos");
Object.defineProperty(exports, "permisos", { enumerable: true, get: function () { return permisos_1.permisos; } });
const objetos_1 = require("./objetos");
Object.defineProperty(exports, "ms_objetos", { enumerable: true, get: function () { return objetos_1.ms_objetos; } });
const parametros_1 = require("./parametros");
Object.defineProperty(exports, "parametros", { enumerable: true, get: function () { return parametros_1.parametros; } });
const ms_usuarios_1 = require("./ms_usuarios");
Object.defineProperty(exports, "ms_usuarios", { enumerable: true, get: function () { return ms_usuarios_1.ms_usuarios; } });
const Documentos_model_1 = require("./Documentos/Documentos.model");
Object.defineProperty(exports, "documentos", { enumerable: true, get: function () { return Documentos_model_1.documentos; } });
const docuemtosDet_1 = require("./Documentos/docuemtosDet");
Object.defineProperty(exports, "documentoDet", { enumerable: true, get: function () { return docuemtosDet_1.documentoDet; } });
const docVersion_1 = require("./Documentos/docVersion");
Object.defineProperty(exports, "documentoVersiones", { enumerable: true, get: function () { return docVersion_1.documentoVersiones; } });
const version_1 = require("./Documentos/version");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_1.version; } });
const TipoDocCaracteristica_1 = require("./Documentos/TipoDocCaracteristica");
Object.defineProperty(exports, "tipoDocumentoCaracteristica", { enumerable: true, get: function () { return TipoDocCaracteristica_1.tipoDocumentoCaracteristica; } });
// Asociaciones permisos
objetos_1.ms_objetos.hasMany(permisos_1.permisos, {
    foreignKey: 'ID_OBJETO',
    as: 'permisos'
});
// Asociaciones parámetros / usuarios
parametros_1.parametros.belongsTo(ms_usuarios_1.ms_usuarios, {
    foreignKey: 'ID_USUARIO',
    targetKey: 'ID_USUARIO'
});
// Documentos ↔ detalle
Documentos_model_1.documentos.hasMany(docuemtosDet_1.documentoDet, {
    foreignKey: 'ID_DOCUMENTO',
    as: 'detalles'
});
docuemtosDet_1.documentoDet.belongsTo(Documentos_model_1.documentos, {
    foreignKey: 'ID_DOCUMENTO',
    targetKey: 'ID_DOCUMENTO',
    as: 'documento'
});
// Detalle ↔ versiones
docuemtosDet_1.documentoDet.hasMany(docVersion_1.documentoVersiones, {
    foreignKey: 'ID_DOCUMENTO_DET',
    as: 'versiones'
});
docVersion_1.documentoVersiones.belongsTo(docuemtosDet_1.documentoDet, {
    foreignKey: 'ID_DOCUMENTO_DET',
    targetKey: 'ID_DOCUMENTO_DET',
    as: 'detalle'
});
// Versión ↔ documento_versiones
version_1.version.hasMany(docVersion_1.documentoVersiones, {
    foreignKey: 'ID_VERSION',
    as: 'documentoVersiones'
});
docVersion_1.documentoVersiones.belongsTo(version_1.version, {
    foreignKey: 'ID_VERSION',
    targetKey: 'ID_VERSION',
    as: 'version'
});
// Detalle ↔ dimensiones fijas
docuemtosDet_1.documentoDet.belongsTo(departamentos_1.departamentos, {
    foreignKey: 'ID_DEPARTAMENTO',
    targetKey: 'ID_DEPARTAMENTO',
    as: 'departamento'
});
docuemtosDet_1.documentoDet.belongsTo(categoria_1.categoria, {
    foreignKey: 'ID_CATEGORIA',
    targetKey: 'ID_CATEGORIA',
    as: 'categoria'
});
docuemtosDet_1.documentoDet.belongsTo(s_categoria_1.s_categoria, {
    foreignKey: 'ID_SUB_CATEGORIA',
    targetKey: 'ID_SUB_CATEGORIA',
    as: 'subCategoria'
});
docuemtosDet_1.documentoDet.belongsTo(clase_1.clases, {
    foreignKey: 'ID_CLASE',
    targetKey: 'ID_CLASE',
    as: 'clase'
});
docuemtosDet_1.documentoDet.belongsTo(tipo_archivo_1.tipo_archivo, {
    foreignKey: 'ID_TIPO_ARCHIVO',
    targetKey: 'ID_TIPO_ARCHIVO',
    as: 'tipoArchivo'
});
// Detalle ↔ característica dinámica
docuemtosDet_1.documentoDet.belongsTo(TipoDocCaracteristica_1.tipoDocumentoCaracteristica, {
    foreignKey: 'ID_TIPO_DOCUMENTO_CARACTERISTICA',
    targetKey: 'ID_TIPO_DOCUMENTO_CARACTERISTICA',
    as: 'caracteristica'
});
// Característica dinámica ↔ documentos
TipoDocCaracteristica_1.tipoDocumentoCaracteristica.belongsTo(Documentos_model_1.documentos, {
    foreignKey: 'ID_DOCUMENTO',
    targetKey: 'ID_DOCUMENTO',
    as: 'documento'
});
// Característica dinámica ↔ usuarios
TipoDocCaracteristica_1.tipoDocumentoCaracteristica.belongsTo(ms_usuarios_1.ms_usuarios, {
    foreignKey: 'ID_USUARIO',
    targetKey: 'ID_USUARIO',
    as: 'usuario'
});
// Característica dinámica ↔ catálogo de características
TipoDocCaracteristica_1.tipoDocumentoCaracteristica.belongsTo(caracteristica_1.caracteristica, {
    foreignKey: 'ID_CARACTERISTICA',
    targetKey: 'ID_CARACTERISTICA',
    as: 'def'
});
// Característica dinámica ↔ detalle y versiones
TipoDocCaracteristica_1.tipoDocumentoCaracteristica.hasMany(docuemtosDet_1.documentoDet, {
    foreignKey: 'ID_TIPO_DOCUMENTO_CARACTERISTICA',
    as: 'detallesCaracteristica'
});
TipoDocCaracteristica_1.tipoDocumentoCaracteristica.hasMany(docVersion_1.documentoVersiones, {
    foreignKey: 'ID_TIPO_DOCUMENTO_CARACTERISTICA',
    as: 'versionesCaracteristica'
});
