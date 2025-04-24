"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ms_usuarios = exports.parametros = exports.ms_objetos = exports.permisos = void 0;
// models/index.ts
const permisos_1 = require("./permisos");
Object.defineProperty(exports, "permisos", { enumerable: true, get: function () { return permisos_1.permisos; } });
const objetos_1 = require("./objetos");
Object.defineProperty(exports, "ms_objetos", { enumerable: true, get: function () { return objetos_1.ms_objetos; } });
const parametros_1 = require("./parametros");
Object.defineProperty(exports, "parametros", { enumerable: true, get: function () { return parametros_1.parametros; } });
const ms_usuarios_1 = require("./ms_usuarios");
Object.defineProperty(exports, "ms_usuarios", { enumerable: true, get: function () { return ms_usuarios_1.ms_usuarios; } });
objetos_1.ms_objetos.hasMany(permisos_1.permisos, {
    foreignKey: 'ID_OBJETO',
    as: 'permisos'
});
parametros_1.parametros.belongsTo(ms_usuarios_1.ms_usuarios, {
    foreignKey: 'ID_USUARIO',
    targetKey: 'ID_USUARIO',
});
