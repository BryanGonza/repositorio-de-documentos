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
exports.deleteClase = exports.updateClase = exports.createClase = exports.getClase = void 0;
const conexion_1 = __importDefault(require("../../database/conexion"));
// Obtener todas las clases
const getClase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conexion_1.default.query("CALL obtener_clases();");
        // Aseguramos que siempre devolvemos un array con datos
        const lista = Array.isArray(result) ? result : [];
        if (!lista || lista.length === 0) {
            return res.status(404).json({ msg: "No hay clases registradas." });
        }
        // Convertir ESTADO a boolean para el frontend
        const listaClases = lista.map((clase) => (Object.assign(Object.assign({}, clase), { ESTADO: clase.ESTADO === 1 })));
        // Cambio de clave para que coincida con el frontend
        res.json({ Listado_Clase: listaClases });
    }
    catch (error) {
        console.error("Error al obtener las clases:", error);
        res.status(500).json({
            msg: "Error al obtener la lista de clases.",
        });
    }
});
exports.getClase = getClase;
// Crear una nueva clase
const createClase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NOMBRE, APROBADO, RECEPCIONADO, FORMATO, ESTADO } = req.body;
    try {
        yield conexion_1.default.query(`CALL crear_clase(
        :NOMBRE,
        :APROBADO,
        :RECEPCIONADO,
        :FORMATO,
        :ESTADO
      );`, {
            replacements: {
                NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
                APROBADO: APROBADO ? APROBADO.toUpperCase() : null,
                RECEPCIONADO: RECEPCIONADO ? RECEPCIONADO.toUpperCase() : null,
                FORMATO: FORMATO ? FORMATO.toUpperCase() : null,
                ESTADO: ESTADO ? 1 : 0 // Convertimos booleano a TINYINT
            }
        });
        res.status(201).json({
            msg: `Clase ${(NOMBRE === null || NOMBRE === void 0 ? void 0 : NOMBRE.toUpperCase()) || 'sin nombre'} creada correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al crear la clase:", error);
        res.status(500).json({
            msg: `Error al crear la clase ${(NOMBRE === null || NOMBRE === void 0 ? void 0 : NOMBRE.toUpperCase()) || ''}.`,
        });
    }
});
exports.createClase = createClase;
// Actualizar clase
const updateClase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_CLASE, NOMBRE, APROBADO, RECEPCIONADO, FORMATO, ESTADO } = req.body;
    try {
        const id = parseInt(ID_CLASE);
        if (isNaN(id)) {
            return res.status(400).json({ msg: "El ID de la clase debe ser un número válido." });
        }
        yield conexion_1.default.query(`
      CALL actualizar_clase(
        :ID_CLASE,
        :NOMBRE,
        :APROBADO,
        :RECEPCIONADO,
        :FORMATO,
        :ESTADO
      )
    `, {
            replacements: {
                ID_CLASE: id,
                NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
                APROBADO: APROBADO ? APROBADO.toUpperCase() : null,
                RECEPCIONADO: RECEPCIONADO ? RECEPCIONADO.toUpperCase() : null,
                FORMATO: FORMATO ? FORMATO.toUpperCase() : null,
                ESTADO: ESTADO ? 1 : 0 // Convertimos booleano a TINYINT
            }
        });
        res.status(200).json({ msg: `Clase con ID ${id} actualizada correctamente.` });
    }
    catch (error) {
        console.error("Error al actualizar la clase:", error);
        if ((_a = error.original) === null || _a === void 0 ? void 0 : _a.sqlMessage) {
            return res.status(400).json({ msg: error.original.sqlMessage });
        }
        res.status(500).json({ msg: "Error al actualizar la clase." });
    }
});
exports.updateClase = updateClase;
// Eliminar clase
const deleteClase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_CLASE } = req.body;
    try {
        yield conexion_1.default.query('CALL eliminar_clase(:ID_CLASE)', {
            replacements: { ID_CLASE },
        });
        res.json({
            msg: `Clase con ID ${ID_CLASE} eliminada exitosamente.`,
        });
    }
    catch (error) {
        console.error("Error al eliminar la clase:", error);
        const msg = ((_a = error === null || error === void 0 ? void 0 : error.original) === null || _a === void 0 ? void 0 : _a.sqlMessage) || "Error al eliminar la clase.";
        res.status(500).json({ msg });
    }
});
exports.deleteClase = deleteClase;
