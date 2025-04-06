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
exports.validarTokenConPermisos = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const permisos_1 = require("../models/permisos"); // Importa tu modelo de permisos
const validarTokenConPermisos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const headersToken = req.headers["authorization"];
    if (!headersToken || !headersToken.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Acceso denegado" });
    }
    try {
        const token = headersToken.slice(7);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.Secret_key || "Repositorio_Docuemntos");
        if (!decoded.rol) {
            return res.status(401).json({ msg: "Token no contiene 'rol'" });
        }
        // Consulta en BD los permisos asociados al rol
        const permisoData = yield permisos_1.permisos.findOne({ where: { ID_ROL: decoded.rol } });
        if (!permisoData) {
            return res.status(403).json({ msg: "No se encontraron permisos para el rol" });
        }
        // Adjunta la información de usuario y permisos en la request.
        req.body.user = {
            rol: decoded.rol,
            permisos: permisoData.dataValues // Ej: { PERMISO_INSERCION: 'SI', PERMISO_ELIMINACION: 'NO', ... }
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ msg: "Token inválido" });
    }
});
exports.validarTokenConPermisos = validarTokenConPermisos;
exports.default = exports.validarTokenConPermisos;
