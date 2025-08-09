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
exports.deleteEstado = exports.updateEstado = exports.getEstado = exports.createEstado = void 0;
const conexion_1 = __importDefault(require("../database/conexion"));
// Insertar estado usando procedimiento almacenado
const createEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ESTADO } = req.body;
    try {
        const [Nuevo_Registro] = yield conexion_1.default.query(`CALL PINSERT_ESTADO(:estado);`, {
            replacements: { estado: ESTADO }
        });
        res.json({
            msg: 'Registro creado correctamente',
            Nuevo_Registro
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al crear Registro',
            error
        });
    }
});
exports.createEstado = createEstado;
// Obtener todos los estados usando procedimiento almacenado
const getEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Lista_Estado = yield conexion_1.default.query(`CALL PSELECT_ESTADO();`);
        res.json({ Listado_Estado: Lista_Estado });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al obtener registros',
            error
        });
    }
});
exports.getEstado = getEstado;
// Actualizar estado usando procedimiento almacenado
const updateEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_ESTADO, ESTADO } = req.body;
    try {
        yield conexion_1.default.query(`CALL PUPDATE_ESTADO(:id, :estado);`, {
            replacements: {
                id: ID_ESTADO,
                estado: ESTADO
            }
        });
        res.status(200).json({
            msg: `Registro con ID ${ID_ESTADO} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
});
exports.updateEstado = updateEstado;
// Eliminar estado usando procedimiento almacenado
const deleteEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_ESTADO } = req.body;
    try {
        yield conexion_1.default.query(`CALL PDELETE_ESTADO(:id);`, {
            replacements: { id: ID_ESTADO }
        });
        res.json({
            msg: `Registro con ID ${ID_ESTADO} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
});
exports.deleteEstado = deleteEstado;
