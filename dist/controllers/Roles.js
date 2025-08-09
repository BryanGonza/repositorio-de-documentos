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
exports.deleteroles = exports.updateRoles = exports.getRoles = exports.createRol = void 0;
const conexion_1 = __importDefault(require("../database/conexion")); // Asegúrate de que esta ruta sea correcta
// Crear rol usando procedimiento almacenado
const createRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ROL, DESCRIPCION, CREADO_POR } = req.body;
    try {
        yield conexion_1.default.query(`CALL crear_rol(:ROL, :DESCRIPCION, :CREADO_POR);`, {
            replacements: {
                ROL,
                DESCRIPCION,
                CREADO_POR
            }
        });
        res.json({
            msg: 'Rol creado correctamente',
        });
    }
    catch (error) {
        console.error('Error al crear Rol:', error);
        res.status(500).json({
            msg: 'Error al crear Rol',
            error
        });
    }
});
exports.createRol = createRol;
// Obtener todos los roles usando procedimiento almacenado
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ListRoles = yield conexion_1.default.query(`CALL obtener_roles();`);
        res.json({ ListRoles });
    }
    catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({
            msg: 'Error al obtener roles',
            error
        });
    }
});
exports.getRoles = getRoles;
// Actualizar un rol usando procedimiento almacenado
const updateRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_ROL, ROL, DESCRIPCION, MODIFICADO_POR } = req.body;
    try {
        yield conexion_1.default.query(`CALL actualizar_rol(:ID_ROL, :ROL, :DESCRIPCION, :MODIFICADO_POR);`, {
            replacements: {
                ID_ROL,
                ROL,
                DESCRIPCION,
                MODIFICADO_POR
            }
        });
        res.status(200).json({
            msg: `Rol con ID ${ID_ROL} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el Rol:", error);
        res.status(500).json({
            msg: "Error al actualizar el rol.",
            error
        });
    }
});
exports.updateRoles = updateRoles;
// Eliminar rol usando procedimiento almacenado
const deleteroles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_ROL } = req.body;
    try {
        yield conexion_1.default.query(`CALL eliminar_rol(:ID_ROL);`, {
            replacements: { ID_ROL },
        });
        res.json({
            msg: `Rol con ID ${ID_ROL} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el rol:', error);
        res.status(500).json({
            msg: 'Error al eliminar el rol.',
        });
    }
});
exports.deleteroles = deleteroles;
