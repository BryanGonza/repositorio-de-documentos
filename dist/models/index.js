"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ms_objetos = exports.permisos = void 0;
// models/index.ts
const permisos_1 = require("./permisos");
Object.defineProperty(exports, "permisos", { enumerable: true, get: function () { return permisos_1.permisos; } });
const objetos_1 = require("./objetos");
Object.defineProperty(exports, "ms_objetos", { enumerable: true, get: function () { return objetos_1.ms_objetos; } });
// Ya definiste la asociación en permisos.ts, pero si querés también definir la inversa:
objetos_1.ms_objetos.hasMany(permisos_1.permisos, {
    foreignKey: 'ID_OBJETO',
    as: 'permisos'
});
