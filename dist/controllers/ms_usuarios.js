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
exports.login = exports.getUsuarios = exports.registrerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const ms_usuarios_1 = require("../models/ms_usuarios");
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const conexion_1 = __importDefault(require("../database/conexion"));
//Crear usuario
const registrerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_USUARIO, NUM_IDENTIDAD, ID_CARGO, DIRECCION_1, DIRECCION_2, USUARIO, NOMBRE_USUARIO, ESTADO_USUARIO, CONTRASEÑA, ID_ROL, FECHA_ULTIMA_CONEXION, PREGUNTAS_CONTESTADAS, FECHA_CREACION, CREADO_POR, FECHA_MODIFICACION, MODIFICADO_POR, PRIMER_INGRESO, FECHA_VENCIMIENTO, CORREO_ELECTRONICO } = req.body;
    const user = yield ms_usuarios_1.ms_usuarios.findOne({ where: { [sequelize_1.Op.or]: { CORREO_ELECTRONICO: CORREO_ELECTRONICO, NUM_IDENTIDAD: NUM_IDENTIDAD } } });
    if (user) {
        return res.status(400).json({
            msg: `Ya existe un usuario con email => ${CORREO_ELECTRONICO} o el numero de identidad ${NUM_IDENTIDAD}`
        });
    }
    // console.log("Estoy aqui...");
    const CONTRASEÑAHash = yield bcrypt_1.default.hash(CONTRASEÑA, 10);
    try {
        yield ms_usuarios_1.ms_usuarios.create({
            ID_USUARIO: ID_USUARIO,
            NUM_IDENTIDAD: NUM_IDENTIDAD,
            ID_CARGO: ID_CARGO,
            DIRECCION_1: DIRECCION_1.toUpperCase(),
            DIRECCION_2: DIRECCION_2.toUpperCase(),
            USUARIO: USUARIO.toUpperCase(),
            NOMBRE_USUARIO: NOMBRE_USUARIO.toUpperCase(),
            ESTADO_USUARIO: ESTADO_USUARIO,
            CONTRASEÑA: CONTRASEÑA,
            ID_ROL: ID_ROL,
            FECHA_ULTIMA_CONEXION: FECHA_ULTIMA_CONEXION,
            PREGUNTAS_CONTESTADAS: PREGUNTAS_CONTESTADAS,
            FECHA_CREACION: FECHA_CREACION,
            CREADO_POR: CREADO_POR,
            FECHA_MODIFICACION: FECHA_MODIFICACION,
            MODIFICADO_POR: MODIFICADO_POR,
            PRIMER_INGRESO: PRIMER_INGRESO,
            FECHA_VENCIMIENTO: FECHA_VENCIMIENTO,
            CORREO_ELECTRONICO: CORREO_ELECTRONICO,
        });
        res.json({
            msg: `Usuario ${NOMBRE_USUARIO.toUpperCase()} creado correctamente...`
        });
    }
    catch (error) {
        res.status(400).json({
            msg: `Error al crear usuario ${NOMBRE_USUARIO.toUpperCase()}.`
        });
    }
});
exports.registrerUser = registrerUser;
//Get para traer todos los usuarios 
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ListUsuarios = yield ms_usuarios_1.ms_usuarios.findAll();
    res.json({ ListUsuarios });
});
exports.getUsuarios = getUsuarios;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { CORREO_ELECTRONICO, CONTRASEÑA } = req.body;
    try {
        const [resultado] = yield conexion_1.default.query('CALL ValidarUsuario(:p_usuario, :p_contrasena);', {
            replacements: {
                p_usuario: CORREO_ELECTRONICO,
                p_contrasena: CONTRASEÑA
            }
        });
        const token = jsonwebtoken_1.default.sign({ CORREO_ELECTRONICO: CORREO_ELECTRONICO }, process.env.Secret_key || 'Repositorio_Documentos', { expiresIn: '1h' });
        return res.json({
            msg: 'Login exitoso',
            token
        });
    }
    catch (error) {
        if (error.parent && error.parent.sqlState === '45000') {
            return res.status(400).json({
                msg: error.parent.sqlMessage || 'Error en el login'
            });
        }
        console.error('Error: ', error);
        return res.status(500).json({
            msg: 'Error del servidor'
        });
    }
});
exports.login = login;
