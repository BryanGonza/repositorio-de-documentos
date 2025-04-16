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
exports.deleteVersion = exports.updateVersion = exports.getVersion = exports.createVersion = void 0;
const version_1 = require("../../models/Documentos/version");
// Insertar 
const createVersion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_USUARIO, NOMBRE, CAMBIOS } = req.body;
    try {
        const Nuevo_Registro = yield version_1.version.create({
            ID_USUARIO,
            NOMBRE,
            CAMBIOS,
            FECHA_ACTU: new Date(),
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
exports.createVersion = createVersion;
// Obtener todos los registros
const getVersion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Listado_Version = yield version_1.version.findAll();
    res.json({ Listado_Version });
});
exports.getVersion = getVersion;
// Actualizar 
const updateVersion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_VERSION, ID_USUARIO, NOMBRE, CAMBIOS, FECHA_ACTU } = req.body;
    try {
        // Buscar el registro por su id
        const versiones = yield version_1.version.findOne({ where: { ID_VERSION } });
        if (!versiones) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_VERSION}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield versiones.update({
            ID_VERSION: ID_VERSION !== null && ID_VERSION !== void 0 ? ID_VERSION : versiones.ID_SUB_CATEGORIA,
            ID_USUARIO: ID_USUARIO !== null && ID_USUARIO !== void 0 ? ID_USUARIO : versiones.ID_USUARIO,
            NOMBRE: NOMBRE !== null && NOMBRE !== void 0 ? NOMBRE : versiones.NOMBRE,
            CAMBIOS: CAMBIOS !== null && CAMBIOS !== void 0 ? CAMBIOS : versiones.CAMBIOS,
            FECHA_ACTU: FECHA_ACTU !== null && FECHA_ACTU !== void 0 ? FECHA_ACTU : new Date(),
        });
        res.status(200).json({
            msg: `Registro con ID ${ID_VERSION} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
});
exports.updateVersion = updateVersion;
//eliminar mediante id
const deleteVersion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_VERSION } = req.body;
    try {
        const deletedCount = yield version_1.version.destroy({
            where: { ID_VERSION: ID_VERSION },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_VERSION}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_VERSION} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
});
exports.deleteVersion = deleteVersion;
