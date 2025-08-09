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
exports.deleteVersion = exports.updateVersion = exports.createVersion = exports.getVersion = void 0;
const conexion_1 = __importDefault(require("../../database/conexion"));
// ✅ Obtener todas las versiones
const getVersion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conexion_1.default.query("CALL listar_versiones();");
        if (!result || result.length === 0) {
            return res.status(404).json({ msg: "No hay versiones registradas." });
        }
        res.json({ Listado_Version: result });
    }
    catch (error) {
        console.error("Error al obtener las versiones:", error);
        res.status(500).json({ msg: "Error al obtener las versiones." });
    }
});
exports.getVersion = getVersion;
// ✅ Crear nueva versión
const createVersion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_USUARIO, NOMBRE, CAMBIOS, FECHA_ACTU } = req.body;
    try {
        yield conexion_1.default.query(`
      CALL insertar_version(:ID_USUARIO, :NOMBRE, :CAMBIOS, :FECHA_ACTU);
    `, {
            replacements: {
                ID_USUARIO,
                NOMBRE: (NOMBRE === null || NOMBRE === void 0 ? void 0 : NOMBRE.toUpperCase()) || null,
                CAMBIOS: CAMBIOS || null,
                FECHA_ACTU: new Date()
            }
        });
        res.status(201).json({ msg: "Versión creada correctamente." });
    }
    catch (error) {
        console.error("Error al crear la versión:", error);
        res.status(500).json({ msg: "Error al crear la versión." });
    }
});
exports.createVersion = createVersion;
//Actualizar version
const updateVersion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_VERSION, ID_USUARIO, NOMBRE, CAMBIOS, FECHA_ACTU } = req.body;
    try {
        const id = parseInt(ID_VERSION);
        if (isNaN(id)) {
            return res.status(400).json({ msg: "El ID de la versión debe ser un número válido." });
        }
        yield conexion_1.default.query(`
      CALL actualizar_version(:ID_VERSION, :ID_USUARIO, :NOMBRE, :CAMBIOS, :FECHA_ACTU);
    `, {
            replacements: {
                ID_VERSION: id,
                ID_USUARIO: ID_USUARIO !== null && ID_USUARIO !== void 0 ? ID_USUARIO : null,
                NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
                CAMBIOS: CAMBIOS !== null && CAMBIOS !== void 0 ? CAMBIOS : null,
                FECHA_ACTU: FECHA_ACTU ? new Date(FECHA_ACTU) : new Date() // usa fecha actual si no viene
            }
        });
        res.status(200).json({ msg: `Versión con ID ${id} actualizada correctamente.` });
    }
    catch (error) {
        console.error("Error al actualizar la versión:", error);
        res.status(500).json({ msg: "Error al actualizar la versión." });
    }
});
exports.updateVersion = updateVersion;
// ✅ Eliminar versión
const deleteVersion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_VERSION } = req.body;
    try {
        yield conexion_1.default.query(`
      CALL eliminar_version(:ID_VERSION);
    `, {
            replacements: { ID_VERSION }
        });
        res.json({ msg: `Versión con ID ${ID_VERSION} eliminada exitosamente.` });
    }
    catch (error) {
        console.error("Error al eliminar la versión:", error);
        const msg = ((_a = error === null || error === void 0 ? void 0 : error.original) === null || _a === void 0 ? void 0 : _a.sqlMessage) || "Error al eliminar la versión.";
        res.status(500).json({ msg });
    }
});
exports.deleteVersion = deleteVersion;
