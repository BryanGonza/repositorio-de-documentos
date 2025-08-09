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
exports.deleteFacultad = exports.updateFacultad = exports.createFacultad = exports.getFacultad = void 0;
const conexion_1 = __importDefault(require("../../database/conexion"));
// Obtener todas las facultades
const getFacultad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conexion_1.default.query("CALL select_facultades();");
        if (!result || result.length === 0) {
            return res.status(404).json({ msg: "No hay facultades registrados." });
        }
        res.json({ Lista_Facultad: result });
    }
    catch (error) {
        console.error("Error al obtener las facultades:", error);
        res.status(500).json({
            msg: "Error al obtener la lista de facultades.",
        });
    }
});
exports.getFacultad = getFacultad;
// Crear una nueva facultad
const createFacultad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NOMBRE, DESCRIPCION, ESTADO } = req.body;
    try {
        yield conexion_1.default.query(`CALL insertar_facultad(
        :NOMBRE,
        :DESCRIPCION,
        :ESTADO
      );`, {
            replacements: {
                NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
                DESCRIPCION: DESCRIPCION ? DESCRIPCION.toUpperCase() : null,
                ESTADO: ESTADO !== null && ESTADO !== void 0 ? ESTADO : null,
            }
        });
        res.status(201).json({
            msg: `Facultad ${(NOMBRE === null || NOMBRE === void 0 ? void 0 : NOMBRE.toUpperCase()) || 'sin nombre'} creada correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al crear la facultad:", error);
        res.status(500).json({
            msg: `Error al crear la facultad ${(NOMBRE === null || NOMBRE === void 0 ? void 0 : NOMBRE.toUpperCase()) || ''}.`,
        });
    }
});
exports.createFacultad = createFacultad;
const updateFacultad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_FACULTAD, NOMBRE, DESCRIPCION, ESTADO, } = req.body;
    try {
        const id = parseInt(ID_FACULTAD);
        if (isNaN(id)) {
            return res.status(400).json({ msg: "El ID de la facultad debe ser un número válido." });
        }
        yield conexion_1.default.query(`
      CALL actualizar_facultad(
        :ID_FACULTAD,
        :NOMBRE,
        :DESCRIPCION,
        :ESTADO
      )
    `, {
            replacements: {
                ID_FACULTAD: id,
                NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
                DESCRIPCION: DESCRIPCION ? DESCRIPCION.toUpperCase() : null,
                ESTADO: ESTADO !== null && ESTADO !== void 0 ? ESTADO : null // no usar toUpperCase aquí
            }
        });
        res.status(200).json({ msg: `Facultad con ID ${id} actualizada correctamente.` });
    }
    catch (error) {
        console.error("Error al actualizar la facultad:", error);
        if ((_a = error.original) === null || _a === void 0 ? void 0 : _a.sqlMessage) {
            return res.status(400).json({ msg: error.original.sqlMessage });
        }
        res.status(500).json({ msg: "Error al actualizar la facultad." });
    }
});
exports.updateFacultad = updateFacultad;
//ELIMINAR
const deleteFacultad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_FACULTAD } = req.body;
    try {
        yield conexion_1.default.query('CALL eliminar_facultad(:ID_FACULTAD)', {
            replacements: { ID_FACULTAD },
        });
        res.json({
            msg: `Facultad con ID ${ID_FACULTAD} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error("Error al eliminar la facultad:", error);
        const msg = ((_a = error === null || error === void 0 ? void 0 : error.original) === null || _a === void 0 ? void 0 : _a.sqlMessage) || "Error al eliminar la facultad.";
        res.status(500).json({ msg });
    }
});
exports.deleteFacultad = deleteFacultad;
