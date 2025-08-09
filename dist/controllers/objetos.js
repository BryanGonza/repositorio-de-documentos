"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjetosConPermisos = exports.deleteObjetos = exports.updateObjetos = exports.getObjetos = exports.createObjetos = void 0;
const conexion_1 = __importDefault(require("../database/conexion")); // Asegúrate de que esta ruta sea correcta
// Crear un objeto usando procedimiento almacenado
const createObjetos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { OBJETO, TIPO_OBJETO, DESCRIPCION, CREADO_POR } = req.body;
    try {
        yield conexion_1.default.query(`CALL crear_objeto(:OBJETO, :TIPO_OBJETO, :DESCRIPCION, :CREADO_POR);`, {
            replacements: {
                OBJETO,
                TIPO_OBJETO,
                DESCRIPCION,
                CREADO_POR,
            },
        });
        res.json({
            msg: "Objeto creado correctamente",
        });
    }
    catch (error) {
        console.error("Error al crear Objeto:", error);
        res.status(500).json({
            msg: "Error al crear Objeto",
            error,
        });
    }
});
exports.createObjetos = createObjetos;
// Obtener todos los objetos usando procedimiento almacenado
const getObjetos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Lista_Objetos = yield conexion_1.default.query(`CALL obtener_objetos();`);
        res.json({ Lista_Objetos });
    }
    catch (error) {
        console.error("Error al obtener objetos:", error);
        res.status(500).json({
            msg: "Error al obtener objetos",
            error,
        });
    }
});
exports.getObjetos = getObjetos;
// Actualizar un objeto usando procedimiento almacenado
const updateObjetos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_OBJETO, OBJETO, TIPO_OBJETO, DESCRIPCION, MODIFICADO_POR } = req.body;
    try {
        yield conexion_1.default.query(`CALL actualizar_objeto(:ID_OBJETO, :OBJETO, :TIPO_OBJETO, :DESCRIPCION, :MODIFICADO_POR);`, {
            replacements: {
                ID_OBJETO,
                OBJETO,
                TIPO_OBJETO,
                DESCRIPCION,
                MODIFICADO_POR,
            },
        });
        res.status(200).json({
            msg: `Objeto con ID ${ID_OBJETO} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el objeto:", error);
        res.status(500).json({
            msg: "Error al actualizar el objeto.",
            error,
        });
    }
});
exports.updateObjetos = updateObjetos;
// Eliminar un objeto usando procedimiento almacenado
const deleteObjetos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_OBJETO } = req.body;
    try {
        yield conexion_1.default.query(`CALL eliminar_objeto(:ID_OBJETO);`, {
            replacements: { ID_OBJETO },
        });
        res.json({
            msg: `Objeto con ID ${ID_OBJETO} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error("Error al eliminar el Objeto:", error);
        res.status(500).json({
            msg: "Error al eliminar el objeto.",
            error,
        });
    }
});
exports.deleteObjetos = deleteObjetos;
// Función auxiliar para permisos
function parsePerm(val) {
    if (typeof val === "boolean")
        return val;
    if (typeof val === "string")
        return val.trim().toLowerCase() === "si";
    return false;
}
// Obtener objetos con permisos (no cambia porque combina permisos con la data)
const getObjetosConPermisos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userPermisos = req.body.user.permisos;
        console.log("Usuario y permisos:", req.body.user);
        // Llamamos al procedimiento para obtener todos los objetos
        const objetosDB = yield conexion_1.default.query(`CALL obtener_objetos();`);
        const objetosConPermiso = objetosDB.map((obj) => {
            const permisoUsuario = userPermisos.find(p => p.ID_OBJETO === obj.ID_OBJETO);
            return Object.assign(Object.assign({}, obj), { PERMISO_CONSULTAR: parsePerm(permisoUsuario === null || permisoUsuario === void 0 ? void 0 : permisoUsuario.PERMISO_CONSULTAR), PERMISO_INSERCION: parsePerm(permisoUsuario === null || permisoUsuario === void 0 ? void 0 : permisoUsuario.PERMISO_INSERCION), PERMISO_ACTUALIZACION: parsePerm(permisoUsuario === null || permisoUsuario === void 0 ? void 0 : permisoUsuario.PERMISO_ACTUALIZACION), PERMISO_ELIMINACION: parsePerm(permisoUsuario === null || permisoUsuario === void 0 ? void 0 : permisoUsuario.PERMISO_ELIMINACION) });
        });
        return res.json(objetosConPermiso);
    }
    catch (error) {
        console.error("Error en getObjetosConPermisos:", error);
        return res.status(500).json({ msg: "Error interno del servidor" });
    }
});
exports.getObjetosConPermisos = getObjetosConPermisos;
