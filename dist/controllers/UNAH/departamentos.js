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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDep = exports.updateDep = exports.getDep = exports.createDep = void 0;
const departamentos_1 = require("../../models/UNAH/departamentos");
// Insertar 
const createDep = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_FACULTAD, NOMBRE, ESTADO } = req.body;
    try {
        const Nuevo_Registro = yield departamentos_1.departamentos.create({
            ID_FACULTAD,
            NOMBRE,
            ESTADO,
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
exports.createDep = createDep;
// Obtener todos los registros
const getDep = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Listado_Departamentos = yield departamentos_1.departamentos.findAll();
    res.json({ Listado_Departamentos });
});
exports.getDep = getDep;
// Actualizar 
const updateDep = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_DEPARTAMENTO, ID_FACULTAD, NOMBRE, ESTADO, } = req.body;
    try {
        // Buscar el registro por su id
        const Departamentos = yield departamentos_1.departamentos.findOne({ where: { ID_DEPARTAMENTO } });
        if (!Departamentos) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_DEPARTAMENTO}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield Departamentos.update({
            ID_DEPARTAMENTO: ID_DEPARTAMENTO !== null && ID_DEPARTAMENTO !== void 0 ? ID_DEPARTAMENTO : Departamentos.ID_DEPARTAMENTO,
            ID_FACULTAD: ID_FACULTAD !== null && ID_FACULTAD !== void 0 ? ID_FACULTAD : Departamentos.ID_FACULTAD,
            NOMBRE: NOMBRE !== null && NOMBRE !== void 0 ? NOMBRE : Departamentos.NOMBRE,
            ESTADO: ESTADO !== null && ESTADO !== void 0 ? ESTADO : Departamentos.ESTADO
        });
        res.status(200).json({
            msg: `Registro con ID ${ID_DEPARTAMENTO} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
});
exports.updateDep = updateDep;
//eliminar mediante id
const deleteDep = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_DEPARTAMENTO } = req.body;
    try {
        const deletedCount = yield departamentos_1.departamentos.destroy({
            where: { ID_DEPARTAMENTO: ID_DEPARTAMENTO },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_DEPARTAMENTO}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_DEPARTAMENTO} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
});
exports.deleteDep = deleteDep;
