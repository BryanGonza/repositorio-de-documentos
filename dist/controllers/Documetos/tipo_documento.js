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
exports.deleteTipo_d = exports.updateTipo_d = exports.getTipo_d = exports.createTipo_d = void 0;
const tipo_documento_1 = require("../../models/Documentos/tipo_documento");
// Insertar 
const createTipo_d = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { TIPO_DOCUMENTO, ESTADO } = req.body;
    try {
        const Nuevo_Registro = yield tipo_documento_1.tipo_documento.create({
            TIPO_DOCUMENTO,
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
exports.createTipo_d = createTipo_d;
// Obtener todos los registros
const getTipo_d = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Listado_Tipo_Documentos = yield tipo_documento_1.tipo_documento.findAll();
    res.json({ Listado_Tipo_Documentos });
});
exports.getTipo_d = getTipo_d;
// Actualizar 
const updateTipo_d = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_TIPO_DOCUMENTO, TIPO_DOCUMENTO, ESTADO } = req.body;
    try {
        // Buscar el registro por su id
        const tipo_documentos = yield tipo_documento_1.tipo_documento.findOne({ where: { ID_TIPO_DOCUMENTO } });
        if (!tipo_documentos) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_TIPO_DOCUMENTO}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield tipo_documentos.update({
            ID_TIPO_DOCUMENTO: ID_TIPO_DOCUMENTO !== null && ID_TIPO_DOCUMENTO !== void 0 ? ID_TIPO_DOCUMENTO : tipo_documentos.ID_TIPO_DOCUMENTO,
            TIPO_DOCUMENTO: TIPO_DOCUMENTO !== null && TIPO_DOCUMENTO !== void 0 ? TIPO_DOCUMENTO : tipo_documentos.TIPO_DOCUMENTO,
            ESTADO: ESTADO !== null && ESTADO !== void 0 ? ESTADO : tipo_documentos.ESTADO
        });
        res.status(200).json({
            msg: `Registro con ID ${ID_TIPO_DOCUMENTO} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
});
exports.updateTipo_d = updateTipo_d;
//eliminar mediante id
const deleteTipo_d = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_TIPO_DOCUMENTO } = req.body;
    try {
        const deletedCount = yield tipo_documento_1.tipo_documento.destroy({
            where: { ID_TIPO_DOCUMENTO: ID_TIPO_DOCUMENTO },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_TIPO_DOCUMENTO}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_TIPO_DOCUMENTO} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
});
exports.deleteTipo_d = deleteTipo_d;
