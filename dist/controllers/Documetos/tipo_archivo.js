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
exports.deleteTipo_archivo = exports.updateTipo_archivo = exports.getTipo_archivo = exports.createTipo_archivo = void 0;
const tipo_archivo_1 = require("../../models/Documentos/tipo_archivo");
// Insertar 
const createTipo_archivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { TIPO_ARCHIVO, LIMITE_ALMACENAMIENTO } = req.body;
    try {
        const Nuevo_Registro = yield tipo_archivo_1.tipo_archivo.create({
            TIPO_ARCHIVO,
            LIMITE_ALMACENAMIENTO
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
exports.createTipo_archivo = createTipo_archivo;
// Obtener todos los registros
const getTipo_archivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Listado_Tipo_Archivo = yield tipo_archivo_1.tipo_archivo.findAll();
    res.json({ Listado_Tipo_Archivo });
});
exports.getTipo_archivo = getTipo_archivo;
// Actualizar 
const updateTipo_archivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_TIPO_ARCHIVO, TIPO_ARCHIVO, LIMITE_ALMACENAMIENTO } = req.body;
    try {
        // Buscar el registro por su id
        const tipo_archivos = yield tipo_archivo_1.tipo_archivo.findOne({ where: { ID_TIPO_ARCHIVO } });
        if (!tipo_archivos) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_TIPO_ARCHIVO}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield tipo_archivos.update({
            ID_TIPO_ARCHIVO: ID_TIPO_ARCHIVO !== null && ID_TIPO_ARCHIVO !== void 0 ? ID_TIPO_ARCHIVO : tipo_archivos.ID_TIPO_ARCHIVO,
            TIPO_ARCHIVO: TIPO_ARCHIVO !== null && TIPO_ARCHIVO !== void 0 ? TIPO_ARCHIVO : tipo_archivos.TIPO_ARCHIVO,
            LIMITE_ALMACENAMIENTO: LIMITE_ALMACENAMIENTO !== null && LIMITE_ALMACENAMIENTO !== void 0 ? LIMITE_ALMACENAMIENTO : tipo_archivos.LIMITE_ALMACENAMIENTO
        });
        res.status(200).json({
            msg: `Registro con ID ${ID_TIPO_ARCHIVO} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
});
exports.updateTipo_archivo = updateTipo_archivo;
//eliminar mediante id
const deleteTipo_archivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_TIPO_ARCHIVO } = req.body;
    try {
        const deletedCount = yield tipo_archivo_1.tipo_archivo.destroy({
            where: { ID_TIPO_ARCHIVO: ID_TIPO_ARCHIVO },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_TIPO_ARCHIVO}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_TIPO_ARCHIVO} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
});
exports.deleteTipo_archivo = deleteTipo_archivo;
