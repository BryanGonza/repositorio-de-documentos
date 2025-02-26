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
exports.deleteEstado = exports.updateEstado = exports.getEstado = exports.createEstado = void 0;
const estado_1 = require("../models/estado");
// Insertar 
const createEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ESTADO } = req.body;
    try {
        const Nuevo_Registro = yield estado_1.estado.create({
            ESTADO
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
exports.createEstado = createEstado;
// Obtener todos los registros
const getEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Listado_Estado = yield estado_1.estado.findAll();
    res.json({ Listado_Estado });
});
exports.getEstado = getEstado;
// Actualizar 
const updateEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_ESTADO, ESTADO } = req.body;
    try {
        // Buscar el registro por su id
        const estados = yield estado_1.estado.findOne({ where: { ID_ESTADO } });
        if (!estados) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_ESTADO}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield estados.update({
            ID_ESTADO: ID_ESTADO !== null && ID_ESTADO !== void 0 ? ID_ESTADO : estados.ID_ESTADO,
            ESTADO: ESTADO !== null && ESTADO !== void 0 ? ESTADO : estados.ESTADO
        });
        res.status(200).json({
            msg: `Registro con ID ${ID_ESTADO} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
});
exports.updateEstado = updateEstado;
//eliminar mediante id
const deleteEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_ESTADO } = req.body;
    try {
        const deletedCount = yield estado_1.estado.destroy({
            where: { ID_ESTADO: ID_ESTADO },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_ESTADO}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_ESTADO} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
});
exports.deleteEstado = deleteEstado;
