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
exports.deleteEstructura = exports.updateEstructura = exports.createEstructura = exports.getEstructura = void 0;
const conexion_1 = __importDefault(require("../../database/conexion"));
// Obtener todas las estructuras de archivos
const getEstructura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conexion_1.default.query("CALL select_estructuras_archivos();");
        if (!result || result.length === 0) {
            return res.status(404).json({ msg: "No hay estructuras de archivos registradas." });
        }
        res.json({ Listado_Estrucura_Archivos: result });
    }
    catch (error) {
        console.error("Error al obtener las estructuras:", error);
        res.status(500).json({
            msg: "Error al obtener la lista de estructuras de archivos.",
        });
    }
});
exports.getEstructura = getEstructura;
// Crear una nueva estructura de archivos
const createEstructura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_DEPARTAMENTO, ESPACIO_ALMACENAMIENTO, NOMBRE, UBICACION } = req.body;
    try {
        yield conexion_1.default.query(`CALL insertar_estructura_archivos(
        :ID_DEPARTAMENTO,
        :ESPACIO_ALMACENAMIENTO,
        :NOMBRE,
        :UBICACION
      );`, {
            replacements: {
                ID_DEPARTAMENTO: ID_DEPARTAMENTO || null,
                ESPACIO_ALMACENAMIENTO: ESPACIO_ALMACENAMIENTO || null,
                NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
                UBICACION: UBICACION ? UBICACION.toUpperCase() : null
            }
        });
        res.status(201).json({
            msg: `Estructura de archivos ${(NOMBRE === null || NOMBRE === void 0 ? void 0 : NOMBRE.toUpperCase()) || 'sin nombre'} creada correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al crear la estructura:", error);
        res.status(500).json({
            msg: `Error al crear la estructura de archivos ${(NOMBRE === null || NOMBRE === void 0 ? void 0 : NOMBRE.toUpperCase()) || ''}.`,
            error: error.message
        });
    }
});
exports.createEstructura = createEstructura;
// Actualizar estructura de archivos
const updateEstructura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_ESTRUCTURA_ARCHIVOS, ID_DEPARTAMENTO, ESPACIO_ALMACENAMIENTO, NOMBRE, UBICACION } = req.body;
    try {
        const id = parseInt(ID_ESTRUCTURA_ARCHIVOS);
        if (isNaN(id)) {
            return res.status(400).json({ msg: "El ID de la estructura debe ser un número válido." });
        }
        yield conexion_1.default.query(`
      CALL actualizar_estructura_archivos(
        :ID_ESTRUCTURA_ARCHIVOS,
        :ID_DEPARTAMENTO,
        :ESPACIO_ALMACENAMIENTO,
        :NOMBRE,
        :UBICACION
      )
    `, {
            replacements: {
                ID_ESTRUCTURA_ARCHIVOS: id,
                ID_DEPARTAMENTO: ID_DEPARTAMENTO || null,
                ESPACIO_ALMACENAMIENTO: ESPACIO_ALMACENAMIENTO || null,
                NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
                UBICACION: UBICACION ? UBICACION.toUpperCase() : null
            }
        });
        res.status(200).json({ msg: `Estructura con ID ${id} actualizada correctamente.` });
    }
    catch (error) {
        console.error("Error al actualizar la estructura:", error);
        if ((_a = error.original) === null || _a === void 0 ? void 0 : _a.sqlMessage) {
            return res.status(400).json({ msg: error.original.sqlMessage });
        }
        res.status(500).json({ msg: "Error al actualizar la estructura de archivos." });
    }
});
exports.updateEstructura = updateEstructura;
// Eliminar estructura de archivos
const deleteEstructura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_ESTRUCTURA_ARCHIVOS } = req.body;
    try {
        yield conexion_1.default.query('CALL eliminar_estructura_archivos(:ID_ESTRUCTURA_ARCHIVOS)', {
            replacements: { ID_ESTRUCTURA_ARCHIVOS },
        });
        res.json({
            msg: `Estructura con ID ${ID_ESTRUCTURA_ARCHIVOS} eliminada exitosamente.`,
        });
    }
    catch (error) {
        console.error("Error al eliminar la estructura:", error);
        const msg = ((_a = error === null || error === void 0 ? void 0 : error.original) === null || _a === void 0 ? void 0 : _a.sqlMessage) || "Error al eliminar la estructura de archivos.";
        res.status(500).json({ msg });
    }
});
exports.deleteEstructura = deleteEstructura;
