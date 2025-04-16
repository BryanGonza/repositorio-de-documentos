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
exports.deleteEstructura = exports.updateEstructura = exports.getEstructura = exports.createEstructura = void 0;
const estructura_archivos_1 = require("../../models/Documentos/estructura_archivos");
// Insertar 
const createEstructura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_DEPARTAMENTO, ESPACIO_ALMACENAMIENTO, NOMBRE, UBICACION } = req.body;
    try {
        const Nuevo_Registro = yield estructura_archivos_1.estructura_archivos.create({
            ID_DEPARTAMENTO,
            ESPACIO_ALMACENAMIENTO,
            NOMBRE,
            UBICACION,
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
exports.createEstructura = createEstructura;
// Obtener todos los registros
const getEstructura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Listado_Estrucura_Archivos = yield estructura_archivos_1.estructura_archivos.findAll();
    res.json({ Listado_Estrucura_Archivos });
});
exports.getEstructura = getEstructura;
// Actualizar 
const updateEstructura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_ESTRUCTURA_ARCHIVOS, ID_DEPARTAMENTO, ESPACIO_ALMACENAMIENTO, NOMBRE, UBICACION, } = req.body;
    try {
        // Buscar el registro por su id
        const estructura = yield estructura_archivos_1.estructura_archivos.findOne({ where: { ID_ESTRUCTURA_ARCHIVOS } });
        if (!estructura) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_ESTRUCTURA_ARCHIVOS}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield estructura.update({
            ID_ESTRUCTURA_ARCHIVOS: ID_ESTRUCTURA_ARCHIVOS !== null && ID_ESTRUCTURA_ARCHIVOS !== void 0 ? ID_ESTRUCTURA_ARCHIVOS : estructura.ID_ESTRUCTURA_ARCHIVOS,
            ID_DEPARTAMENTO: ID_DEPARTAMENTO !== null && ID_DEPARTAMENTO !== void 0 ? ID_DEPARTAMENTO : estructura.ID_DEPARTAMENTO,
            ESPACIO_ALMACENAMIENTO: ESPACIO_ALMACENAMIENTO !== null && ESPACIO_ALMACENAMIENTO !== void 0 ? ESPACIO_ALMACENAMIENTO : estructura.ESPACIO_ALMACENAMIENTO,
            NOMBRE: NOMBRE !== null && NOMBRE !== void 0 ? NOMBRE : estructura.NOMBRE,
            UBICACION: UBICACION !== null && UBICACION !== void 0 ? UBICACION : estructura.UBICACION
        });
        res.status(200).json({
            msg: `Registro con ID ${ID_ESTRUCTURA_ARCHIVOS} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
});
exports.updateEstructura = updateEstructura;
//eliminar mediante id
const deleteEstructura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_ESTRUCTURA_ARCHIVOS } = req.body;
    try {
        const deletedCount = yield estructura_archivos_1.estructura_archivos.destroy({
            where: { ID_ESTRUCTURA_ARCHIVOS: ID_ESTRUCTURA_ARCHIVOS },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_ESTRUCTURA_ARCHIVOS}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_ESTRUCTURA_ARCHIVOS} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
});
exports.deleteEstructura = deleteEstructura;
