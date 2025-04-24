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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParametros = exports.updateParametros = exports.deleteParametro = exports.CrearParametro = void 0;
const parametros_1 = require("../models/parametros");
const models_1 = require("../models");
const CrearParametro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { PARAMETRO, VALOR, ADMIN_INTENTOS_INVALIDOS, ID_USUARIO } = req.body;
    try {
        parametros_1.parametros.create({
            PARAMETRO: PARAMETRO.toUpperCase(),
            VALOR: VALOR.toUpperCase(),
            ADMIN_INTENTOS_INVALIDOS: ADMIN_INTENTOS_INVALIDOS,
            ID_USUARIO: ID_USUARIO,
            FECHA_CREACION: new Date(),
            FECHA_MODIFICACION: new Date(),
        });
        res.json({
            msg: `Parametro ${PARAMETRO} creado correctamente.`,
        });
    }
    catch (error) {
        res.status(400).json({
            msg: `Existe un error al crear el parametro => `,
            error,
        });
    }
});
exports.CrearParametro = CrearParametro;
//eliminar parametro
const deleteParametro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_PARAMETRO } = req.body;
    try {
        const deletedCount = yield parametros_1.parametros.destroy({
            where: { ID_PARAMETRO: ID_PARAMETRO },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró el parametro ${ID_PARAMETRO}.`,
            });
        }
        res.json({
            msg: `Parametro con ID ${ID_PARAMETRO} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error("Error al eliminar el Parametro:", error);
        res.status(500).json({
            msg: "Error al eliminar el Parametro.",
        });
    }
});
exports.deleteParametro = deleteParametro;
//Actualizar parametros :)
const updateParametros = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_PARAMETRO, PARAMETRO, VALOR, ADMIN_INTENTOS_INVALIDOS, ID_USUARIO, FECHA_MODIFICACION, } = req.body;
    try {
        // Buscar el parametro por su id
        const parametro = yield parametros_1.parametros.findOne({ where: { ID_PARAMETRO } });
        if (!parametro) {
            return res.status(404).json({
                msg: `No se encontró un parametro con el ID ${ID_PARAMETRO}.`,
            });
        }
        // actualizar los campos que vienen en el body
        yield parametro.update({
            PARAMETRO: PARAMETRO ? PARAMETRO.toUpperCase() : parametro.PARAMETRO,
            VALOR: VALOR ? VALOR.toUpperCase() : parametro.VALOR,
            ADMIN_INTENTOS_INVALIDOS: ADMIN_INTENTOS_INVALIDOS !== null && ADMIN_INTENTOS_INVALIDOS !== void 0 ? ADMIN_INTENTOS_INVALIDOS : parametro.ADMIN_INTENTOS_INVALIDOS,
            ID_USUARIO: ID_USUARIO !== null && ID_USUARIO !== void 0 ? ID_USUARIO : parametro.ID_USUARIO,
            FECHA_MODIFICACION: FECHA_MODIFICACION !== null && FECHA_MODIFICACION !== void 0 ? FECHA_MODIFICACION : new Date(),
        });
        res.status(200).json({
            msg: `Parametro con ID ${ID_PARAMETRO} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el Parametro:", error);
        res.status(500).json({
            msg: "Error al actualizar el Parametro.",
        });
    }
});
exports.updateParametros = updateParametros;
//Get parametros
const getParametros = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ListParametros = yield parametros_1.parametros.findAll({
            include: [
                {
                    model: models_1.ms_usuarios,
                    attributes: ['CORREO_ELECTRONICO'],
                },
            ],
        });
        // Aplanar el resultado y eliminar ms_usuario
        const parametrosConCorreo = ListParametros.map((parametro) => {
            const plain = parametro.get({ plain: true });
            const { ms_usuario } = plain, resto = __rest(plain, ["ms_usuario"]); // Quitamos ms_usuario
            return Object.assign(Object.assign({}, resto), { CORREO_ELECTRONICO: (ms_usuario === null || ms_usuario === void 0 ? void 0 : ms_usuario.CORREO_ELECTRONICO) || null });
        });
        res.json({ ListParametros: parametrosConCorreo });
    }
    catch (error) {
        console.error('Error al obtener parámetros:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});
exports.getParametros = getParametros;
