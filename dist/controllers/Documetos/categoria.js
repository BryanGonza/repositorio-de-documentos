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
exports.deleteCategoria = exports.updateCategoria = exports.getCategoria = exports.createCategoria = void 0;
const conexion_1 = __importDefault(require("../../database/conexion"));
// Crear una nueva categoría
const createCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { CATEGORIA, ESTADO } = req.body;
    try {
        yield conexion_1.default.query(`CALL crear_categoria(
        :CATEGORIA,
        :ESTADO
      );`, {
            replacements: {
                CATEGORIA: CATEGORIA ? CATEGORIA.toUpperCase() : null,
                ESTADO: ESTADO ? 1 : 0,
            },
        });
        res.status(201).json({
            msg: `Categoría ${(CATEGORIA === null || CATEGORIA === void 0 ? void 0 : CATEGORIA.toUpperCase()) || "sin nombre"} creada correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al crear la categoría:", error);
        res.status(500).json({
            msg: `Error al crear la categoría ${(CATEGORIA === null || CATEGORIA === void 0 ? void 0 : CATEGORIA.toUpperCase()) || ""}.`,
            error,
        });
    }
});
exports.createCategoria = createCategoria;
// Obtener todas las categorías
const getCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conexion_1.default.query("CALL obtener_categorias();");
        if (!result || result.length === 0) {
            return res.status(404).json({ msg: "No hay categorías registradas." });
        }
        // Convertir ESTADO a boolean
        const listaCategorias = result.map((cat) => (Object.assign(Object.assign({}, cat), { ESTADO: cat.ESTADO === 1 })));
        res.json({
            Listado_Categoria: listaCategorias, // Para CategoriaComponent
            Listado_Categorias: listaCategorias // Para SubCategoriaComponent
        });
    }
    catch (error) {
        console.error("Error al obtener las categorías:", error);
        res.status(500).json({
            msg: "Error al obtener la lista de categorías.",
        });
    }
});
exports.getCategoria = getCategoria;
// Actualizar categoría
const updateCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_CATEGORIA, CATEGORIA, ESTADO } = req.body;
    try {
        const id = parseInt(ID_CATEGORIA);
        if (isNaN(id)) {
            return res.status(400).json({ msg: "El ID de la categoría debe ser un número válido." });
        }
        yield conexion_1.default.query(`CALL actualizar_categoria(
        :ID_CATEGORIA,
        :CATEGORIA,
        :ESTADO
      );`, {
            replacements: {
                ID_CATEGORIA: id,
                CATEGORIA: CATEGORIA ? CATEGORIA.toUpperCase() : null,
                ESTADO: ESTADO ? 1 : 0,
            },
        });
        res.status(200).json({ msg: `Categoría con ID ${id} actualizada correctamente.` });
    }
    catch (error) {
        console.error("Error al actualizar la categoría:", error);
        res.status(500).json({
            msg: "Error al actualizar la categoría.",
            error,
        });
    }
});
exports.updateCategoria = updateCategoria;
// Eliminar categoría (recibiendo ID en el body)
const deleteCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_CATEGORIA } = req.body;
    if (!ID_CATEGORIA || isNaN(ID_CATEGORIA)) {
        return res.status(400).json({ msg: "ID de categoría inválido." });
    }
    try {
        yield conexion_1.default.query("CALL eliminar_categoria(:ID_CATEGORIA);", {
            replacements: { ID_CATEGORIA },
        });
        res.json({
            msg: `Categoría con ID ${ID_CATEGORIA} eliminada exitosamente.`,
        });
    }
    catch (error) {
        console.error("Error al eliminar la categoría:", error);
        res.status(500).json({
            msg: "Error al eliminar la categoría.",
            error,
        });
    }
});
exports.deleteCategoria = deleteCategoria;
