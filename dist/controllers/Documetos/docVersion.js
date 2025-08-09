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
exports.deleteDocV = exports.updateDocV = exports.createDocV = exports.getDocV = void 0;
const conexion_1 = __importDefault(require("../../database/conexion"));
// ✅ Obtener todas las relaciones documento-versión
const getDocV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conexion_1.default.query("CALL select_documentos_versiones();");
        if (!result || result.length === 0) {
            return res.status(404).json({ msg: "No hay relaciones de documentos con versiones registradas." });
        }
        res.json({ listado_documentos_versiones: result });
    }
    catch (error) {
        console.error("Error al obtener documentos con versiones:", error);
        res.status(500).json({ msg: "Error al obtener los datos." });
    }
});
exports.getDocV = getDocV;
// ✅ Crear nueva relación documento-versión
const createDocV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_VERSION, ID_DOCUMENTO_DET, FECHA_DESDE, FECHA_HASTA, ESTADO, DESCRIPCION } = req.body;
    try {
        yield conexion_1.default.query(`
      CALL insertar_documento_version(:ID_VERSION, :ID_DOCUMENTO_DET, :FECHA_DESDE, :FECHA_HASTA, :ESTADO, :DESCRIPCION);
    `, {
            replacements: {
                ID_VERSION,
                ID_DOCUMENTO_DET,
                FECHA_DESDE: FECHA_DESDE ? new Date(FECHA_DESDE) : null,
                FECHA_HASTA: FECHA_HASTA ? new Date(FECHA_HASTA) : null,
                ESTADO,
                DESCRIPCION: (DESCRIPCION === null || DESCRIPCION === void 0 ? void 0 : DESCRIPCION.toUpperCase()) || null
            }
        });
        res.status(201).json({ msg: "Relación documento-versión creada correctamente." });
    }
    catch (error) {
        console.error("Error al crear documento-versión:", error);
        res.status(500).json({ msg: "Error al crear documento-versión." });
    }
});
exports.createDocV = createDocV;
// ✅ Actualizar documento-versión
const updateDocV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_DOCUMENTO_VERSIONES, ID_VERSION, ID_DOCUMENTO_DET, FECHA_DESDE, FECHA_HASTA, ESTADO, DESCRIPCION } = req.body;
    try {
        const id = parseInt(ID_DOCUMENTO_VERSIONES);
        if (isNaN(id)) {
            return res.status(400).json({ msg: "El ID del registro debe ser un número válido." });
        }
        yield conexion_1.default.query(`
      CALL actualizar_documento_version(:ID_DOCUMENTO_VERSIONES, :ID_VERSION, :ID_DOCUMENTO_DET, :FECHA_DESDE, :FECHA_HASTA, :ESTADO, :DESCRIPCION);
    `, {
            replacements: {
                ID_DOCUMENTO_VERSIONES: id,
                ID_VERSION,
                ID_DOCUMENTO_DET,
                FECHA_DESDE: FECHA_DESDE ? new Date(FECHA_DESDE) : null,
                FECHA_HASTA: FECHA_HASTA ? new Date(FECHA_HASTA) : null,
                ESTADO,
                DESCRIPCION: (DESCRIPCION === null || DESCRIPCION === void 0 ? void 0 : DESCRIPCION.toUpperCase()) || null
            }
        });
        res.status(200).json({ msg: `Registro documento-versión con ID ${id} actualizado correctamente.` });
    }
    catch (error) {
        console.error("Error al actualizar documento-versión:", error);
        res.status(500).json({ msg: "Error al actualizar documento-versión." });
    }
});
exports.updateDocV = updateDocV;
// ✅ Eliminar documento-versión
const deleteDocV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_DOCUMENTO_VERSIONES } = req.body;
    try {
        const id = parseInt(ID_DOCUMENTO_VERSIONES);
        if (isNaN(id)) {
            return res.status(400).json({ msg: "El ID debe ser un número válido." });
        }
        yield conexion_1.default.query(`
      CALL eliminar_documento_version(:ID_DOCUMENTO_VERSIONES);
    `, {
            replacements: { ID_DOCUMENTO_VERSIONES: id }
        });
        res.json({ msg: `Documento-versión con ID ${id} eliminado correctamente.` });
    }
    catch (error) {
        console.error("Error al eliminar documento-versión:", error);
        const msg = ((_a = error === null || error === void 0 ? void 0 : error.original) === null || _a === void 0 ? void 0 : _a.sqlMessage) || "Error al eliminar documento-versión.";
        res.status(500).json({ msg });
    }
});
exports.deleteDocV = deleteDocV;
