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
exports.deleteCategoria = exports.updateCategoria = exports.getCategoria = exports.createCategoria = void 0;
const categoria_1 = require("../../models/Documentos/categoria");
// Insertar 
const createCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { CATEGORIA, ESTADO } = req.body;
    try {
        const Nuevo_Registro = yield categoria_1.categoria.create({
            CATEGORIA,
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
exports.createCategoria = createCategoria;
// Obtener todos los registros
const getCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Listado_Categoria = yield categoria_1.categoria.findAll();
    res.json({ Listado_Categoria });
});
exports.getCategoria = getCategoria;
// Actualizar 
const updateCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_CATEGORIA, CATEGORIA, ESTADO } = req.body;
    try {
        // Buscar el registro por su id
        const categorias = yield categoria_1.categoria.findOne({ where: { ID_CATEGORIA } });
        if (!categorias) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_CATEGORIA}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield categorias.update({
            ID_CATEGORIA: ID_CATEGORIA !== null && ID_CATEGORIA !== void 0 ? ID_CATEGORIA : categorias.ID_CATEGORIA,
            CATEGORIA: CATEGORIA !== null && CATEGORIA !== void 0 ? CATEGORIA : categorias.CATEGORIA,
            ESTADO: ESTADO !== null && ESTADO !== void 0 ? ESTADO : categorias.ESTADO,
        });
        res.status(200).json({
            msg: `Registro con ID ${ID_CATEGORIA} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
});
exports.updateCategoria = updateCategoria;
//eliminar mediante id
const deleteCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_CATEGORIA } = req.body;
    try {
        const deletedCount = yield categoria_1.categoria.destroy({
            where: { ID_CATEGORIA: ID_CATEGORIA },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_CATEGORIA}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_CATEGORIA} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
});
exports.deleteCategoria = deleteCategoria;
