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
exports.deleteS_categoria = exports.updateS_categoria = exports.getS_categoria = exports.createS_categoria = void 0;
const s_categoria_1 = require("../../models/Documentos/s_categoria");
// Insertar 
const createS_categoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_CATEGORIA, SUB_CATEGORIA, ESTADO } = req.body;
    try {
        const Nuevo_Registro = yield s_categoria_1.s_categoria.create({
            ID_CATEGORIA,
            SUB_CATEGORIA,
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
exports.createS_categoria = createS_categoria;
// Obtener todos los registros
const getS_categoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Listado_Sub_Categoria = yield s_categoria_1.s_categoria.findAll();
    res.json({ Listado_Sub_Categoria });
});
exports.getS_categoria = getS_categoria;
// Actualizar 
const updateS_categoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_SUB_CATEGORIA, ID_CATEGORIA, SUB_CATEGORIA, ESTADO } = req.body;
    try {
        // Buscar el registro por su id
        const s_categorias = yield s_categoria_1.s_categoria.findOne({ where: { ID_SUB_CATEGORIA } });
        if (!s_categorias) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_SUB_CATEGORIA}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield s_categorias.update({
            ID_SUB_CATEGORIA: ID_SUB_CATEGORIA !== null && ID_SUB_CATEGORIA !== void 0 ? ID_SUB_CATEGORIA : s_categorias.ID_SUB_CATEGORIA,
            ID_CATEGORIA: ID_CATEGORIA !== null && ID_CATEGORIA !== void 0 ? ID_CATEGORIA : s_categorias.ID_CATEGORIA,
            SUB_CATEGORIA: SUB_CATEGORIA !== null && SUB_CATEGORIA !== void 0 ? SUB_CATEGORIA : s_categorias.SUB_CATEGORIA,
            ESTADO: ESTADO !== null && ESTADO !== void 0 ? ESTADO : s_categorias.ESTADO,
        });
        res.status(200).json({
            msg: `Registro con ID ${ID_SUB_CATEGORIA} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
});
exports.updateS_categoria = updateS_categoria;
//eliminar mediante id
const deleteS_categoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_SUB_CATEGORIA } = req.body;
    try {
        const deletedCount = yield s_categoria_1.s_categoria.destroy({
            where: { ID_SUB_CATEGORIA: ID_SUB_CATEGORIA },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_SUB_CATEGORIA}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_SUB_CATEGORIA} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
});
exports.deleteS_categoria = deleteS_categoria;
