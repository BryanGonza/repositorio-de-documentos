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
exports.deleteFacultad = exports.updateFacultad = exports.getFacultad = exports.createFacultad = void 0;
const facultad_1 = require("../../models/UNAH/facultad");
// Insertar 
const createFacultad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NOMBRE, ESTADO } = req.body;
    try {
        const Nuevo_Registro = yield facultad_1.Facultad.create({
            NOMBRE,
            ESTADO,
        });
        res.json({
            msg: 'Registro creado correctamente',
            Nuevo_Registro
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al crear Registro',
            error
        });
    }
});
exports.createFacultad = createFacultad;
// Obtener todos los registros
const getFacultad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Lista_Facultad = yield facultad_1.Facultad.findAll();
    res.json({ Lista_Facultad });
});
exports.getFacultad = getFacultad;
// Actualizar 
const updateFacultad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_FACULTAD, NOMBRE, ESTADO, } = req.body;
    try {
        // Buscar el registro por su id
        const facultad = yield facultad_1.Facultad.findOne({ where: { ID_FACULTAD } });
        if (!facultad) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_FACULTAD}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield facultad.update({
            ID_FACULTAD: ID_FACULTAD !== null && ID_FACULTAD !== void 0 ? ID_FACULTAD : facultad.ID_FACULTAD,
            NOMBRE: NOMBRE !== null && NOMBRE !== void 0 ? NOMBRE : facultad.NOMBRE,
            ESTADO: ESTADO !== null && ESTADO !== void 0 ? ESTADO : facultad.ESTADO
        });
        res.status(200).json({
            msg: `Registro con ID ${ID_FACULTAD} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
});
exports.updateFacultad = updateFacultad;
//eliminar mediante id
const deleteFacultad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_FACULTAD } = req.body;
    try {
        const deletedCount = yield facultad_1.Facultad.destroy({
            where: { ID_FACULTAD: ID_FACULTAD },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_FACULTAD}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_FACULTAD} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
});
exports.deleteFacultad = deleteFacultad;
