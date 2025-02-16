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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermiso = exports.updatePermiso = exports.getPermisos = exports.createPermiso = void 0;
const permisos_1 = require("../models/permisos");
// Insertar un permiso
const createPermiso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_ROL, ID_OBJETO, PERMISO_INSERCION, PERMISO_ELIMINACION, PERMISO_ACTUALIZACION, PERMISO_CONSULTAR, CREADO_POR, MODIFICADO_POR, FECHA_CREACION, FECHA_MODIFICACION } = req.body;
    try {
        const Nuevo_Permiso = yield permisos_1.permisos.create({
            ID_ROL,
            ID_OBJETO,
            PERMISO_INSERCION,
            PERMISO_ELIMINACION,
            PERMISO_ACTUALIZACION,
            PERMISO_CONSULTAR,
            CREADO_POR,
            MODIFICADO_POR,
            FECHA_CREACION,
            FECHA_MODIFICACION
        });
        res.json({
            msg: 'Permiso creado correctamente',
            Nuevo_Permiso
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al crear permiso',
            error
        });
    }
});
exports.createPermiso = createPermiso;
// Obtener todos los permisos
const getPermisos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ListPermisos = yield permisos_1.permisos.findAll();
    res.json({ ListPermisos });
});
exports.getPermisos = getPermisos;
// Actualizar un permiso
const updatePermiso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_PERMISO, ID_ROL, ID_OBJETO, PERMISO_INSERCION, PERMISO_ELIMINACION, PERMISO_ACTUALIZACION, PERMISO_CONSULTAR, CREADO_POR, MODIFICADO_POR, FECHA_CREACION, FECHA_MODIFICACION } = req.body;
    try {
        // Buscar el usuario por su id
        const permiso = yield permisos_1.permisos.findOne({ where: { ID_PERMISO } });
        if (!permiso) {
            return res.status(404).json({
                msg: `No se encontró un permiso con el ID ${ID_PERMISO}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield permiso.update({
            ID_ROL: ID_ROL !== null && ID_ROL !== void 0 ? ID_ROL : permiso.ID_ROL,
            ID_OBJETO: ID_OBJETO !== null && ID_OBJETO !== void 0 ? ID_OBJETO : permiso.ID_OBJETO,
            PERMISO_INSERCION: PERMISO_INSERCION !== null && PERMISO_INSERCION !== void 0 ? PERMISO_INSERCION : permiso.PERMISO_INSERCION,
            PERMISO_ELIMINACION: PERMISO_ELIMINACION !== null && PERMISO_ELIMINACION !== void 0 ? PERMISO_ELIMINACION : permiso.PERMISO_ELIMINACION,
            PERMISO_ACTUALIZACION: PERMISO_ACTUALIZACION !== null && PERMISO_ACTUALIZACION !== void 0 ? PERMISO_ACTUALIZACION : permiso.PERMISO_ACTUALIZACION,
            PERMISO_CONSULTAR: PERMISO_CONSULTAR !== null && PERMISO_CONSULTAR !== void 0 ? PERMISO_CONSULTAR : permiso.PERMISO_CONSULTAR,
            CREADO_POR: CREADO_POR !== null && CREADO_POR !== void 0 ? CREADO_POR : permiso.CREADO_POR,
            MODIFICADO_POR: MODIFICADO_POR !== null && MODIFICADO_POR !== void 0 ? MODIFICADO_POR : permiso.MODIFICADO_POR,
            FECHA_CREACION: FECHA_CREACION !== null && FECHA_CREACION !== void 0 ? FECHA_CREACION : permiso.FECHA_CREACION,
            FECHA_MODIFICACION: FECHA_MODIFICACION !== null && FECHA_MODIFICACION !== void 0 ? FECHA_MODIFICACION : permiso.FECHA_MODIFICACION
        });
        res.status(200).json({
            msg: `Permiso con ID ${ID_PERMISO} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el permiso:", error);
        res.status(500).json({
            msg: "Error al actualizar el permiso.",
        });
    }
});
exports.updatePermiso = updatePermiso;
//eliminar mediante id
const deletePermiso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_PERMISO } = req.body;
    try {
        const deletedCount = yield permisos_1.permisos.destroy({
            where: { ID_PERMISO: ID_PERMISO },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un permiso con el ID ${ID_PERMISO}.`,
            });
        }
        res.json({
            msg: `Permiso con ID ${ID_PERMISO} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el Permiso:', error);
        res.status(500).json({
            msg: 'Error al eliminar el permiso.',
        });
    }
});
exports.deletePermiso = deletePermiso;
