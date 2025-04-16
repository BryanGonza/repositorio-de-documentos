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
exports.deleteClase = exports.updateClase = exports.getClase = exports.createClase = void 0;
const clase_1 = require("../../models/UNAH/clase");
// Insertar 
const createClase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NOMBRE, APROBADO, RECEPCIONADO, FORMATO, ESTADO } = req.body;
    try {
        const Nuevo_Registro = yield clase_1.clases.create({
            NOMBRE,
            APROBADO,
            RECEPCIONADO,
            FORMATO,
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
exports.createClase = createClase;
// Obtener todos los registros
const getClase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Listado_Clase = yield clase_1.clases.findAll();
    res.json({ Listado_Clase });
});
exports.getClase = getClase;
// Actualizar 
const updateClase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_CLASE, NOMBRE, APROBADO, RECEPCIONADO, FORMATO, ESTADO, } = req.body;
    try {
        // Buscar el registro por su id
        const clase = yield clase_1.clases.findOne({ where: { ID_CLASE } });
        if (!clase) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_CLASE}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield clase.update({
            ID_CLASE: ID_CLASE !== null && ID_CLASE !== void 0 ? ID_CLASE : clase.ID_DEPARTAMENTO,
            NOMBRE: NOMBRE !== null && NOMBRE !== void 0 ? NOMBRE : clase_1.clases.NOMBRE,
            APROBADO: APROBADO !== null && APROBADO !== void 0 ? APROBADO : clase.APROBADO,
            RECEPCIONADO: RECEPCIONADO !== null && RECEPCIONADO !== void 0 ? RECEPCIONADO : clase_1.clases.RECEPCIONADO,
            FORMATO: FORMATO !== null && FORMATO !== void 0 ? FORMATO : clase_1.clases.FORMATO,
            ESTADO: ESTADO !== null && ESTADO !== void 0 ? ESTADO : clase_1.clases.ESTADO,
        });
        res.status(200).json({
            msg: `Registro con ID ${ID_CLASE} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
});
exports.updateClase = updateClase;
//eliminar mediante id
const deleteClase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_CLASE } = req.body;
    try {
        const deletedCount = yield clase_1.clases.destroy({
            where: { ID_CLASE: ID_CLASE },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_CLASE}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_CLASE} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
});
exports.deleteClase = deleteClase;
