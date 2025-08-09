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
exports.deleteTipo_c = exports.updateTipo_c = exports.createTipo_c = exports.getTipo_c = void 0;
const conexion_1 = __importDefault(require("../../database/conexion"));
// Obtener todos los tipos de característica
const getTipo_c = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conexion_1.default.query("CALL select_tipo_caracteristicas();");
        if (!result || result.length === 0) {
            return res.status(404).json({ msg: "No hay tipos de característica registrados." });
        }
        res.json({ Listado_Tipo_Caracteristica: result });
    }
    catch (error) {
        console.error("Error al obtener los tipos de característica:", error);
        res.status(500).json({
            msg: "Error al obtener la lista de tipos de característica.",
        });
    }
});
exports.getTipo_c = getTipo_c;
// Crear nuevo tipo de característica
const createTipo_c = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { TIPO_CARACTERISTICA } = req.body;
    try {
        yield conexion_1.default.query(`CALL insertar_tipo_caracteristica(:TIPO_CARACTERISTICA);`, {
            replacements: {
                TIPO_CARACTERISTICA: TIPO_CARACTERISTICA ? TIPO_CARACTERISTICA.toUpperCase() : null
            }
        });
        res.status(201).json({
            msg: `Tipo de característica '${(TIPO_CARACTERISTICA === null || TIPO_CARACTERISTICA === void 0 ? void 0 : TIPO_CARACTERISTICA.toUpperCase()) || 'sin nombre'}' creada correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al crear el tipo de característica:", error);
        res.status(500).json({
            msg: "Error al crear el tipo de característica.",
        });
    }
});
exports.createTipo_c = createTipo_c;
// Actualizar tipo de característica
const updateTipo_c = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_TIPO_CARACTERISTICA, TIPO_CARACTERISTICA } = req.body;
    try {
        const id = parseInt(ID_TIPO_CARACTERISTICA);
        if (isNaN(id)) {
            return res.status(400).json({ msg: "El ID debe ser un número válido." });
        }
        yield conexion_1.default.query(`CALL actualizar_tipo_caracteristica(:ID_TIPO_CARACTERISTICA, :TIPO_CARACTERISTICA);`, {
            replacements: {
                ID_TIPO_CARACTERISTICA: id,
                TIPO_CARACTERISTICA: TIPO_CARACTERISTICA ? TIPO_CARACTERISTICA.toUpperCase() : null
            }
        });
        res.status(200).json({ msg: `Tipo de característica con ID ${id} actualizado correctamente.` });
    }
    catch (error) {
        console.error("Error al actualizar el tipo de característica:", error);
        res.status(500).json({ msg: "Error al actualizar el tipo de característica." });
    }
});
exports.updateTipo_c = updateTipo_c;
// Eliminar tipo de característica
const deleteTipo_c = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_TIPO_CARACTERISTICA } = req.body;
    try {
        yield conexion_1.default.query('CALL eliminar_tipo_caracteristica(:ID_TIPO_CARACTERISTICA);', {
            replacements: { ID_TIPO_CARACTERISTICA },
        });
        res.json({
            msg: `Tipo de característica con ID ${ID_TIPO_CARACTERISTICA} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error("Error al eliminar el tipo de característica:", error);
        const msg = ((_a = error === null || error === void 0 ? void 0 : error.original) === null || _a === void 0 ? void 0 : _a.sqlMessage) || "Error al eliminar el tipo de característica.";
        res.status(500).json({ msg });
    }
});
exports.deleteTipo_c = deleteTipo_c;
