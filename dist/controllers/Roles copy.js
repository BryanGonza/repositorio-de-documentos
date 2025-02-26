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
exports.deleteroles = exports.updateRoles = exports.getRoles = exports.createRol = void 0;
const roles_1 = require("../models/roles");
// Insertar un permiso
const createRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ROL, DESCRIPCION, CREADO_POR, MODIFICADO_POR } = req.body;
    try {
        const Nuevo_Rol = yield roles_1.ms_roles.create({
            ROL,
            DESCRIPCION,
            FECHA_CREACION: new Date(),
            CREADO_POR,
            FECHA_MODIFICACION: new Date(),
            MODIFICADO_POR
        });
        res.json({
            msg: 'Rol creado correctamente',
            Nuevo_Rol
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al crear Rol',
            error
        });
    }
});
exports.createRol = createRol;
// Obtener todos los roles
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ListRoles = yield roles_1.ms_roles.findAll();
    res.json({ ListRoles });
});
exports.getRoles = getRoles;
// Actualizar un rol
const updateRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_ROL, ROL, DESCRIPCION, FECHA_CREACION, CREADO_POR, FECHA_MODIFICACION, MODIFICADO_POR } = req.body;
    try {
        // Buscar el rol por su id
        const rol = yield roles_1.ms_roles.findOne({ where: { ID_ROL } });
        if (!rol) {
            return res.status(404).json({
                msg: `No se encontró un rol con el ID ${ID_ROL}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield rol.update({
            ROL: ROL !== null && ROL !== void 0 ? ROL : rol.ROL,
            DESCRIPCION: DESCRIPCION !== null && DESCRIPCION !== void 0 ? DESCRIPCION : rol.DESCRIPCION,
            FECHA_CREACION: FECHA_CREACION !== null && FECHA_CREACION !== void 0 ? FECHA_CREACION : rol.FECHA_CREACION,
            CREADO_POR: CREADO_POR !== null && CREADO_POR !== void 0 ? CREADO_POR : rol.CREADO_POR,
            FECHA_MODIFICACION: FECHA_MODIFICACION !== null && FECHA_MODIFICACION !== void 0 ? FECHA_MODIFICACION : rol.FECHA_MODIFICACION,
            MODIFICADO_POR: MODIFICADO_POR !== null && MODIFICADO_POR !== void 0 ? MODIFICADO_POR : rol.MODIFICADO_POR
        });
        res.status(200).json({
            msg: `Rol con ID ${ID_ROL} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el Rol:", error);
        res.status(500).json({
            msg: "Error al actualizar el rol.",
        });
    }
});
exports.updateRoles = updateRoles;
//eliminar mediante id
const deleteroles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_ROL } = req.body;
    try {
        const deletedCount = yield roles_1.ms_roles.destroy({
            where: { ID_ROL: ID_ROL },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un rol con el ID ${ID_ROL}.`,
            });
        }
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
