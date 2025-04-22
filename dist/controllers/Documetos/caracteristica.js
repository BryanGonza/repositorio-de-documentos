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
exports.deleteCaracteristica = exports.updateCaracteristica = exports.getCaracteristica = exports.createCaracteristica = void 0;
const caracteristica_1 = require("../../models/Documentos/caracteristica");
// Insertar 
const createCaracteristica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_TIPO_CARACTERISTICA, CARACTERISTICA, VALORES_PREDETERMINADOS } = req.body;
    try {
        const Nuevo_Registro = yield caracteristica_1.caracteristica.create({
            ID_TIPO_CARACTERISTICA,
            CARACTERISTICA,
            VALORES_PREDETERMINADOS
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
exports.createCaracteristica = createCaracteristica;
// Obtener todos los registros
const getCaracteristica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Listado_Caracteristicas = yield caracteristica_1.caracteristica.findAll();
    res.json({ Listado_Caracteristicas });
});
exports.getCaracteristica = getCaracteristica;
// Actualizar 
const updateCaracteristica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_CARACTERISTICA, ID_TIPO_CARACTERISTICA, CARACTERISTICA, VALORES_PREDETERMINADOS } = req.body;
    try {
        // Buscar el registro por su id
        const caracteristicas = yield caracteristica_1.caracteristica.findOne({ where: { ID_CARACTERISTICA } });
        if (!caracteristicas) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_CARACTERISTICA}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield caracteristicas.update({
            ID_CARACTERISTICA: ID_CARACTERISTICA !== null && ID_CARACTERISTICA !== void 0 ? ID_CARACTERISTICA : caracteristicas.ID_CARACTERISTICA,
            ID_TIPO_CARACTERISTICA: ID_TIPO_CARACTERISTICA !== null && ID_TIPO_CARACTERISTICA !== void 0 ? ID_TIPO_CARACTERISTICA : caracteristicas.ID_TIPO_CARACTERISTICA,
            CARACTERISTICA: CARACTERISTICA !== null && CARACTERISTICA !== void 0 ? CARACTERISTICA : caracteristicas.CARACTERISTICA,
            VALORES_PREDETERMINADOS: VALORES_PREDETERMINADOS !== null && VALORES_PREDETERMINADOS !== void 0 ? VALORES_PREDETERMINADOS : caracteristicas.VALORES_PREDETERMINADOS
        });
        res.status(200).json({
            msg: `Registro con ID ${ID_CARACTERISTICA} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
});
exports.updateCaracteristica = updateCaracteristica;
//eliminar mediante id
const deleteCaracteristica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_CARACTERISTICA } = req.body;
    try {
        const deletedCount = yield caracteristica_1.caracteristica.destroy({
            where: { ID_CARACTERISTICA: ID_CARACTERISTICA },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_CARACTERISTICA}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_CARACTERISTICA} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
});
exports.deleteCaracteristica = deleteCaracteristica;
