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
exports.getObjetosConPermisos = exports.deleteObjetos = exports.updateObjetos = exports.getObjetos = exports.createObjetos = void 0;
const objetos_1 = require("../models/objetos");
// Insertar un objeto
const createObjetos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { OBJETO, TIPO_OBJETO, DESCRIPCION, FECHA_CREACION, CREADO_POR, FECHA_MODIFICACION, MODIFICADO_POR } = req.body;
    try {
        const Nuevo_Objeto = yield objetos_1.ms_objetos.create({
            OBJETO,
            TIPO_OBJETO,
            DESCRIPCION,
            FECHA_CREACION: new Date(),
            CREADO_POR,
            FECHA_MODIFICACION: new Date(),
            MODIFICADO_POR
        });
        res.json({
            msg: 'Objeto creado correctamente',
            Nuevo_Objeto
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al crear Objeto',
            error
        });
    }
});
exports.createObjetos = createObjetos;
// Obtener todos los objetos
const getObjetos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Lista_Objetos = yield objetos_1.ms_objetos.findAll();
    res.json({ Lista_Objetos });
});
exports.getObjetos = getObjetos;
// Actualizar un permiso
const updateObjetos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_OBJETO, OBJETO, TIPO_OBJETO, DESCRIPCION, CREADO_POR, MODIFICADO_POR } = req.body;
    try {
        // Buscar el objeto por su id
        const Objeto = yield objetos_1.ms_objetos.findOne({ where: { ID_OBJETO } });
        if (!Objeto) {
            return res.status(404).json({
                msg: `No se encontró un objeto con el ID ${ID_OBJETO}.`,
            });
        }
        // actualizar los campos que vienen en el body 
        yield Objeto.update({
            ID_OBJETO: ID_OBJETO !== null && ID_OBJETO !== void 0 ? ID_OBJETO : Objeto.ID_OBJETO,
            OBJETO: OBJETO !== null && OBJETO !== void 0 ? OBJETO : Objeto.OBJETO,
            TIPO_OBJETO: TIPO_OBJETO !== null && TIPO_OBJETO !== void 0 ? TIPO_OBJETO : Objeto.TIPO_OBJETO,
            DESCRIPCION: DESCRIPCION !== null && DESCRIPCION !== void 0 ? DESCRIPCION : Objeto.DESCRIPCION,
            FECHA_CREACION: (_a = req.body.FECHA_CREACION) !== null && _a !== void 0 ? _a : Objeto.FECHA_CREACION,
            CREADO_POR: CREADO_POR !== null && CREADO_POR !== void 0 ? CREADO_POR : Objeto.CREADO_POR,
            MODIFICADO_POR: MODIFICADO_POR !== null && MODIFICADO_POR !== void 0 ? MODIFICADO_POR : Objeto.MODIFICADO_POR,
            FECHA_MODIFICACION: new Date()
        });
        res.status(200).json({
            msg: `Objeto con ID ${ID_OBJETO} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el objeto:", error);
        res.status(500).json({
            msg: "Error al actualizar el objeto.",
        });
    }
});
exports.updateObjetos = updateObjetos;
//eliminar mediante id
const deleteObjetos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_OBJETO } = req.body;
    try {
        const deletedCount = yield objetos_1.ms_objetos.destroy({
            where: { ID_OBJETO: ID_OBJETO },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un objeto con el ID ${ID_OBJETO}.`,
            });
        }
        res.json({
            msg: `Objeto con ID ${ID_OBJETO} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error('Error al eliminar el Objeto:', error);
        res.status(500).json({
            msg: 'Error al eliminar el objeto.',
        });
    }
});
exports.deleteObjetos = deleteObjetos;
const getObjetosConPermisos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { permisos } = req.body.user;
        console.log("Usuario y permisos:", req.body.user); // Log de depuración
        const objetosDB = yield objetos_1.ms_objetos.findAll();
        const objetosConPermiso = objetosDB.map((obj) => {
            const tipo = (obj.TIPO_OBJETO || "").trim().toLowerCase();
            console.log("Tipo objeto recibido:", tipo); // Log de depuración
            let allowed = false;
            switch (tipo) {
                case "inserción":
                case "insercion":
                    allowed = ((permisos.PERMISO_INSERCION || "").trim().toLowerCase() === "si");
                    console.log("Comparando para inserción:", permisos.PERMISO_INSERCION, "->", allowed);
                    break;
                case "eliminación":
                case "eliminacion":
                    allowed = ((permisos.PERMISO_ELIMINACION || "").trim().toLowerCase() === "si");
                    console.log("Comparando para eliminación:", permisos.PERMISO_ELIMINACION, "->", allowed);
                    break;
                case "actualización":
                case "actualizacion":
                    allowed = ((permisos.PERMISO_ACTUALIZACION || "").trim().toLowerCase() === "si");
                    console.log("Comparando para actualización:", permisos.PERMISO_ACTUALIZACION, "->", allowed);
                    break;
                case "consulta":
                    allowed = ((permisos.PERMISO_CONSULTAR || "").trim().toLowerCase() === "si");
                    console.log("Comparando para consulta:", permisos.PERMISO_CONSULTAR, "->", allowed);
                    break;
                default:
                    allowed = false;
                    console.log("Tipo no reconocido:", tipo);
            }
            return Object.assign(Object.assign({}, obj.dataValues), { allowed });
        });
        return res.json(objetosConPermiso);
    }
    catch (error) {
        console.error("Error en getObjetosConPermisos:", error);
        return res.status(500).json({ msg: "Error interno del servidor" });
    }
});
exports.getObjetosConPermisos = getObjetosConPermisos;
