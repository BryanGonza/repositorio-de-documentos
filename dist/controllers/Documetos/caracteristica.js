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
exports.deleteCaracteristica = exports.updateCaracteristica = exports.createCaracteristica = exports.getCaracteristica = void 0;
const conexion_1 = __importDefault(require("../../database/conexion"));
// ✅ Obtener todas las características
const getCaracteristica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conexion_1.default.query("CALL select_caracteristicas();");
        if (!result || result.length === 0) {
            return res.status(404).json({ msg: "No hay características registradas." });
        }
        res.json({ Listado_Caracteristicas: result });
    }
    catch (error) {
        console.error("Error al obtener las características:", error);
        res.status(500).json({ msg: "Error al obtener las características." });
    }
});
exports.getCaracteristica = getCaracteristica;
// ✅ Crear una nueva característica
const createCaracteristica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_TIPO_CARACTERISTICA, CARACTERISTICA, VALORES_PREDETERMINADOS } = req.body;
    try {
        yield conexion_1.default.query(`
      CALL insertar_caracteristica(:ID_TIPO_CARACTERISTICA, :CARACTERISTICA, :VALORES_PREDETERMINADOS);
    `, {
            replacements: {
                ID_TIPO_CARACTERISTICA,
                CARACTERISTICA: (CARACTERISTICA === null || CARACTERISTICA === void 0 ? void 0 : CARACTERISTICA.toUpperCase()) || null,
                VALORES_PREDETERMINADOS: VALORES_PREDETERMINADOS || null
            }
        });
        res.status(201).json({ msg: "Característica creada correctamente." });
    }
    catch (error) {
        console.error("Error al crear la característica:", error);
        res.status(500).json({ msg: "Error al crear la característica." });
    }
});
exports.createCaracteristica = createCaracteristica;
// ✅ Actualizar una característica
const updateCaracteristica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_CARACTERISTICA, ID_TIPO_CARACTERISTICA, CARACTERISTICA, VALORES_PREDETERMINADOS } = req.body;
    try {
        const id = parseInt(ID_CARACTERISTICA);
        if (isNaN(id)) {
            return res.status(400).json({ msg: "El ID de la característica debe ser un número válido." });
        }
        yield conexion_1.default.query(`
      CALL actualizar_caracteristica(:ID_CARACTERISTICA, :ID_TIPO_CARACTERISTICA, :CARACTERISTICA, :VALORES_PREDETERMINADOS);
    `, {
            replacements: {
                ID_CARACTERISTICA: id,
                ID_TIPO_CARACTERISTICA,
                CARACTERISTICA: (CARACTERISTICA === null || CARACTERISTICA === void 0 ? void 0 : CARACTERISTICA.toUpperCase()) || null,
                VALORES_PREDETERMINADOS: VALORES_PREDETERMINADOS || null
            }
        });
        res.status(200).json({ msg: `Característica con ID ${id} actualizada correctamente.` });
    }
    catch (error) {
        console.error("Error al actualizar la característica:", error);
        res.status(500).json({ msg: "Error al actualizar la característica." });
    }
});
exports.updateCaracteristica = updateCaracteristica;
// ✅ Eliminar una característica
const deleteCaracteristica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_CARACTERISTICA } = req.body;
    try {
        yield conexion_1.default.query(`
      CALL eliminar_caracteristica(:ID_CARACTERISTICA);
    `, {
            replacements: { ID_CARACTERISTICA }
        });
        res.json({ msg: `Característica con ID ${ID_CARACTERISTICA} eliminada exitosamente.` });
    }
    catch (error) {
        console.error("Error al eliminar la característica:", error);
        const msg = ((_a = error === null || error === void 0 ? void 0 : error.original) === null || _a === void 0 ? void 0 : _a.sqlMessage) || "Error al eliminar la característica.";
        res.status(500).json({ msg });
    }
});
exports.deleteCaracteristica = deleteCaracteristica;
