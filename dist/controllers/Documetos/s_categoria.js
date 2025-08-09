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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteS_categoria = exports.updateS_categoria = exports.getS_categoria = exports.createS_categoria = void 0;
const conexion_1 = __importDefault(require("../../database/conexion"));
// Crear una nueva sub-categoría
const createS_categoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_CATEGORIA, SUB_CATEGORIA, ESTADO } = req.body;
    try {
        yield conexion_1.default.query(`CALL crear_sub_categoria(
        :ID_CATEGORIA,
        :SUB_CATEGORIA,
        :ESTADO
      );`, {
            replacements: {
                ID_CATEGORIA,
                SUB_CATEGORIA: SUB_CATEGORIA ? SUB_CATEGORIA.toUpperCase() : null,
                ESTADO: ESTADO ? 1 : 0,
            },
        });
        res.status(201).json({
            msg: `Sub-categoría ${(SUB_CATEGORIA === null || SUB_CATEGORIA === void 0 ? void 0 : SUB_CATEGORIA.toUpperCase()) || 'sin nombre'} creada correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al crear la sub-categoría:", error);
        res.status(500).json({
            msg: `Error al crear la sub-categoría ${(SUB_CATEGORIA === null || SUB_CATEGORIA === void 0 ? void 0 : SUB_CATEGORIA.toUpperCase()) || ''}.`,
            error,
        });
    }
});
exports.createS_categoria = createS_categoria;
// Obtener todas las sub-categorías (devuelve NOMBRE_CATEGORIA)
const getS_categoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conexion_1.default.query("CALL obtener_sub_categorias();");
        if (!result || result.length === 0) {
            return res.status(404).json({ msg: "No hay sub-categorías registradas." });
        }
        const listaSubCategorias = result.map((sub) => ({
            ID_SUB_CATEGORIA: sub.ID_SUB_CATEGORIA,
            SUB_CATEGORIA: sub.SUB_CATEGORIA,
            ESTADO: sub.ESTADO === 1,
            NOMBRE_CATEGORIA: sub.NOMBRE_CATEGORIA, // Solo nombre
        }));
        res.json({ Listado_Sub_Categoria: listaSubCategorias });
    }
    catch (error) {
        console.error("Error al obtener las sub-categorías:", error);
        res.status(500).json({
            msg: "Error al obtener la lista de sub-categorías.",
        });
    }
});
exports.getS_categoria = getS_categoria;
// Actualizar sub-categoría
const updateS_categoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_SUB_CATEGORIA, ID_CATEGORIA, SUB_CATEGORIA, ESTADO } = req.body;
    try {
        const id = parseInt(ID_SUB_CATEGORIA);
        if (isNaN(id)) {
            return res.status(400).json({ msg: "El ID de la sub-categoría debe ser un número válido." });
        }
        yield conexion_1.default.query(`CALL actualizar_sub_categoria(
        :ID_SUB_CATEGORIA,
        :ID_CATEGORIA,
        :SUB_CATEGORIA,
        :ESTADO
      );`, {
            replacements: {
                ID_SUB_CATEGORIA: id,
                ID_CATEGORIA,
                SUB_CATEGORIA: SUB_CATEGORIA ? SUB_CATEGORIA.toUpperCase() : null,
                ESTADO: ESTADO ? 1 : 0,
            },
        });
        res.status(200).json({ msg: `Sub-categoría con ID ${id} actualizada correctamente.` });
    }
    catch (error) {
        console.error("Error al actualizar la sub-categoría:", error);
        res.status(500).json({
            msg: "Error al actualizar la sub-categoría.",
            error,
        });
    }
});
exports.updateS_categoria = updateS_categoria;
// Eliminar sub-categoría
const deleteS_categoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_SUB_CATEGORIA } = req.body;
    try {
        yield conexion_1.default.query('CALL eliminar_sub_categoria(:ID_SUB_CATEGORIA)', {
            replacements: { ID_SUB_CATEGORIA },
        });
        res.json({
            msg: `Sub-categoría con ID ${ID_SUB_CATEGORIA} eliminada exitosamente.`,
        });
    }
    catch (error) {
        console.error("Error al eliminar la sub-categoría:", error);
        res.status(500).json({
            msg: "Error al eliminar la sub-categoría.",
            error,
        });
    }
});
exports.deleteS_categoria = deleteS_categoria;
