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
exports.deleteTipo_c = exports.updateTipo_c = exports.getTipo_c = exports.createTipo_c = void 0;
const tipo_caracteristica_1 = require("../../models/Documentos/tipo_caracteristica");
// Insertar 
const createTipo_c = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { TIPO_CARACTERISTICA } = req.body;
    try {
        const Nuevo_Registro = yield tipo_caracteristica_1.tipo_caracteristica.create({
            TIPO_CARACTERISTICA
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
exports.createTipo_c = createTipo_c;
// Obtener todos los registros
const getTipo_c = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Listado_Tipo_Caracteristica = yield tipo_caracteristica_1.tipo_caracteristica.findAll();
    res.json({ Listado_Tipo_Caracteristica });
});
exports.getTipo_c = getTipo_c;
// Actualizar 
const updateTipo_c = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_TIPO_CARACTERISTICA, TIPO_CARACTERISTICA } = req.body;
    try {
        // Buscar el registro por su id
        const tipo_caracteristicas = yield tipo_caracteristica_1.tipo_caracteristica.findOne({ where: { ID_TIPO_CARACTERISTICA } });
        if (!tipo_caracteristicas) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_TIPO_CARACTERISTICA}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield tipo_caracteristicas.update({
            ID_TIPO_CARACTERISTICA: ID_TIPO_CARACTERISTICA !== null && ID_TIPO_CARACTERISTICA !== void 0 ? ID_TIPO_CARACTERISTICA : tipo_caracteristicas.ID_TIPO_CARACTERISTICA,
            TIPO_CARACTERISTICA: TIPO_CARACTERISTICA !== null && TIPO_CARACTERISTICA !== void 0 ? TIPO_CARACTERISTICA : tipo_caracteristicas.TIPO_CARACTERISTICA
        });
        res.status(200).json({
            msg: `Registro con ID ${ID_TIPO_CARACTERISTICA} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
});
exports.updateTipo_c = updateTipo_c;
//eliminar mediante id
const deleteTipo_c = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_TIPO_CARACTERISTICA } = req.body;
    try {
        const deletedCount = yield tipo_caracteristica_1.tipo_caracteristica.destroy({
            where: { ID_TIPO_CARACTERISTICA: ID_TIPO_CARACTERISTICA },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_TIPO_CARACTERISTICA}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_TIPO_CARACTERISTICA} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
});
exports.deleteTipo_c = deleteTipo_c;
