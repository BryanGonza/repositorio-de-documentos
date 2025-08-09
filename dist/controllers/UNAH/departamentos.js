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
exports.getDepFacultad = exports.deleteDep = exports.updateDep = exports.createDep = exports.getDep = void 0;
const conexion_1 = __importDefault(require("../../database/conexion"));
// Obtener todos los departamentos
const getDep = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conexion_1.default.query("CALL select_departamentos();");
        if (!result || result.length === 0) {
            return res.status(404).json({ msg: "No hay departamentos registrados." });
        }
        res.json({ Listado_Departamentos: result });
    }
    catch (error) {
        console.error("Error al obtener los departamentos:", error);
        res.status(500).json({
            msg: "Error al obtener la lista de departamentos.",
        });
    }
});
exports.getDep = getDep;
const createDep = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_FACULTAD, NOMBRE, ESTADO } = req.body;
    console.log("Datos recibidos para crear departamento:", req.body);
    try {
        yield conexion_1.default.query(`
      CALL insertar_departamento(:ID_FACULTAD, :NOMBRE, :ESTADO)
    `, {
            replacements: {
                ID_FACULTAD,
                NOMBRE,
                ESTADO: ESTADO ? 1 : 0
            }
        });
        res.status(201).json({
            msg: 'Departamento creado correctamente.',
        });
    }
    catch (error) {
        console.error("Error al crear el departamento:", error);
        res.status(500).json({
            msg: "Error al crear el departamento.",
        });
    }
});
exports.createDep = createDep;
// Actualizar un departamento
const updateDep = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_DEPARTAMENTO, ID_FACULTAD, NOMBRE, ESTADO } = req.body;
    try {
        const id = parseInt(ID_DEPARTAMENTO);
        if (isNaN(id)) {
            return res.status(400).json({ msg: "El ID del departamento debe ser un número válido." });
        }
        yield conexion_1.default.query(`CALL actualizar_departamento(
        :ID_DEPARTAMENTO,
        :ID_FACULTAD,
        :NOMBRE,
        :ESTADO
      );`, {
            replacements: {
                ID_DEPARTAMENTO: id,
                ID_FACULTAD,
                NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
                ESTADO: ESTADO !== null && ESTADO !== void 0 ? ESTADO : null
            }
        });
        res.status(200).json({ msg: `Departamento con ID ${id} actualizado correctamente.` });
    }
    catch (error) {
        console.error("Error al actualizar el departamento:", error);
        res.status(500).json({ msg: "Error al actualizar el departamento." });
    }
});
exports.updateDep = updateDep;
// Eliminar un departamento
const deleteDep = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_DEPARTAMENTO } = req.body;
    try {
        yield conexion_1.default.query('CALL eliminar_departamento(:ID_DEPARTAMENTO);', {
            replacements: { ID_DEPARTAMENTO },
        });
        res.json({
            msg: `Departamento con ID ${ID_DEPARTAMENTO} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error("Error al eliminar el departamento:", error);
        const msg = ((_a = error === null || error === void 0 ? void 0 : error.original) === null || _a === void 0 ? void 0 : _a.sqlMessage) || "Error al eliminar el departamento.";
        res.status(500).json({ msg });
    }
});
exports.deleteDep = deleteDep;
const getDepFacultad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Obtenemos y validamos el parámetro
    const idParam = req.params.ID_DEPARTAMENTO;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
        return res.status(400).json({ msg: 'ID de departamento inválido.' });
    }
    try {
        // 2) Llamamos al SP pasando el parámetro
        const result = yield conexion_1.default.query('CALL repositorio_documentos2_0.sp_get_departamento_facultad(:ID_DEPARTAMENTO);', {
            replacements: { ID_DEPARTAMENTO: id }
        });
        // 3) Verificamos que haya datos
        if (!result || result.length === 0) {
            return res.status(404).json({ msg: 'Departamento no encontrado.' });
        }
        // 4) Devolvemos el nombre del departamento y de la facultad
        // result[0] tendrá { nombre_departamento, nombre_facultad }
        res.json({ Detalle_Departamento_Facultad: result[0] });
    }
    catch (error) {
        console.error('Error al obtener detalle departamento-facultad:', error);
        res.status(500).json({
            msg: 'Error al ejecutar el procedimiento almacenado.'
        });
    }
});
exports.getDepFacultad = getDepFacultad;
