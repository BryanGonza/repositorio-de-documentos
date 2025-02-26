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
exports.resetPassword = exports.requestPasswordReset = exports.getUsuarioEmail = exports.updateUsuario = exports.deleteUsuario = exports.login = exports.getUsuarios = exports.registrerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const ms_usuarios_1 = require("../models/ms_usuarios");
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const conexion_1 = __importDefault(require("../database/conexion"));
const emailService_1 = require("../controllers/emailService");
//Registrar un usuario
const registrerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_USUARIO, ID_DEPARTAMENTO, NUM_IDENTIDAD, ID_CARGO, DIRECCION_1, DIRECCION_2, USUARIO, NOMBRE_USUARIO, ESTADO_USUARIO, CONTRASEÑA, ID_ROL, FECHA_ULTIMA_CONEXION, PREGUNTAS_CONTESTADAS, CREADO_POR, FECHA_MODIFICACION, MODIFICADO_POR, PRIMER_INGRESO, FECHA_VENCIMIENTO, CORREO_ELECTRONICO, } = req.body;
    const user = yield ms_usuarios_1.ms_usuarios.findOne({
        where: {
            [sequelize_1.Op.or]: {
                CORREO_ELECTRONICO: CORREO_ELECTRONICO,
                NUM_IDENTIDAD: NUM_IDENTIDAD.toString(),
            },
        },
    });
    if (user) {
        return res.status(400).json({
            msg: `Ya existe un usuario con email ${CORREO_ELECTRONICO} o el numero de identidad ${NUM_IDENTIDAD}`,
        });
    }
    // console.log("Estoy aqui...");
    const CONTRASEÑAHash = yield bcrypt_1.default.hash(CONTRASEÑA, 10);
    try {
        yield ms_usuarios_1.ms_usuarios.create({
            ID_USUARIO: ID_USUARIO,
            ID_DEPARTAMENTO: ID_DEPARTAMENTO,
            NUM_IDENTIDAD: NUM_IDENTIDAD.toString(),
            ID_CARGO: ID_CARGO,
            DIRECCION_1: DIRECCION_1,
            DIRECCION_2: DIRECCION_2,
            USUARIO: USUARIO,
            NOMBRE_USUARIO: NOMBRE_USUARIO,
            ESTADO_USUARIO: ESTADO_USUARIO,
            CONTRASEÑA: CONTRASEÑA,
            ID_ROL: ID_ROL,
            FECHA_ULTIMA_CONEXION: FECHA_ULTIMA_CONEXION,
            PREGUNTAS_CONTESTADAS: PREGUNTAS_CONTESTADAS,
            FECHA_CREACION: new Date(),
            CREADO_POR: CREADO_POR,
            FECHA_MODIFICACION: FECHA_MODIFICACION,
            MODIFICADO_POR: MODIFICADO_POR,
            PRIMER_INGRESO: PRIMER_INGRESO,
            FECHA_VENCIMIENTO: FECHA_VENCIMIENTO,
            CORREO_ELECTRONICO: CORREO_ELECTRONICO,
        });
        res.json({
            msg: `Usuario ${NOMBRE_USUARIO.toUpperCase()} creado correctamente...`,
        });
    }
    catch (error) {
        res.status(400).json({
            msg: `Error al crear usuario ${NOMBRE_USUARIO.toUpperCase()}.`,
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
//Login de Usuario
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { CORREO_ELECTRONICO, CONTRASEÑA } = req.body;
    try {
        const [resultado] = yield conexion_1.default.query("CALL ValidarUsuario(:p_usuario, :p_contrasena);", {
            replacements: {
                p_usuario: CORREO_ELECTRONICO,
                p_contrasena: CONTRASEÑA,
            },
        });
        //jwt
        const token = jsonwebtoken_1.default.sign({ CORREO_ELECTRONICO: CORREO_ELECTRONICO }, process.env.Secret_key || "Repositorio_Documentos_2025", { expiresIn: "1h" });
        //Respuesta al cliente
        return res.json({
            success: "Inicio de secion exitoso",
            token,
        });
    }
    catch (error) {
        if (error.parent && error.parent.sqlState === "45000") {
            return res.status(400).json({
                msg: error.parent.sqlMessage || "Error en el login",
            });
        }
        console.error("Error: ", error);
        return res.status(500).json({
            msg: "Error del servidor",
        });
    }
});
exports.login = login;
//eliminar un Usuario mediante id
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_USUARIO } = req.body;
    try {
        const deletedCount = yield ms_usuarios_1.ms_usuarios.destroy({
            where: { ID_USUARIO: ID_USUARIO },
        });
        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un usuario con el ID ${ID_USUARIO}.`,
            });
        }
        res.json({
            msg: `Usuario con ID ${ID_USUARIO} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).json({
            msg: "Error al eliminar el usuario.",
        });
    }
});
exports.deleteUsuario = deleteUsuario;
//Actualizar usuarios ;)
const updateUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_USUARIO, NUM_IDENTIDAD, ID_CARGO, DIRECCION_1, DIRECCION_2, USUARIO, NOMBRE_USUARIO, ESTADO_USUARIO, CONTRASEÑA, ID_ROL, FECHA_ULTIMA_CONEXION, PREGUNTAS_CONTESTADAS, FECHA_MODIFICACION, MODIFICADO_POR, PRIMER_INGRESO, FECHA_VENCIMIENTO, CORREO_ELECTRONICO, } = req.body;
    try {
        // Buscar el usuario por su id
        const usuario = yield ms_usuarios_1.ms_usuarios.findOne({ where: { ID_USUARIO } });
        if (!usuario) {
            return res.status(404).json({
                msg: `No se encontró un usuario con el ID ${ID_USUARIO}.`,
            });
        }
        let nuevaContrasena = usuario.CONTRASEÑA;
        if (CONTRASEÑA) {
            nuevaContrasena = CONTRASEÑA;
        }
        // Para despues incriptar contraseña en caso de que se actualice
        // if (CONTRASEÑA) {
        //   nuevaContrasena = await bycryp.hash(CONTRASEÑA, 10);
        // }
        // actualizar los campos que vienen en el body
        yield usuario.update({
            NUM_IDENTIDAD: NUM_IDENTIDAD !== null && NUM_IDENTIDAD !== void 0 ? NUM_IDENTIDAD : usuario.NUM_IDENTIDAD,
            ID_CARGO: ID_CARGO !== null && ID_CARGO !== void 0 ? ID_CARGO : usuario.ID_CARGO,
            DIRECCION_1: DIRECCION_1
                ? DIRECCION_1.toUpperCase()
                : usuario.DIRECCION_1,
            DIRECCION_2: DIRECCION_2
                ? DIRECCION_2.toUpperCase()
                : usuario.DIRECCION_2,
            USUARIO: USUARIO ? USUARIO.toUpperCase() : usuario.USUARIO,
            NOMBRE_USUARIO: NOMBRE_USUARIO
                ? NOMBRE_USUARIO.toUpperCase()
                : usuario.NOMBRE_USUARIO,
            ESTADO_USUARIO: ESTADO_USUARIO !== null && ESTADO_USUARIO !== void 0 ? ESTADO_USUARIO : usuario.ESTADO_USUARIO,
            ID_ROL: ID_ROL !== null && ID_ROL !== void 0 ? ID_ROL : usuario.ID_ROL,
            FECHA_ULTIMA_CONEXION: FECHA_ULTIMA_CONEXION !== null && FECHA_ULTIMA_CONEXION !== void 0 ? FECHA_ULTIMA_CONEXION : usuario.FECHA_ULTIMA_CONEXION,
            PREGUNTAS_CONTESTADAS: PREGUNTAS_CONTESTADAS !== null && PREGUNTAS_CONTESTADAS !== void 0 ? PREGUNTAS_CONTESTADAS : usuario.PREGUNTAS_CONTESTADAS,
            FECHA_MODIFICACION: FECHA_MODIFICACION !== null && FECHA_MODIFICACION !== void 0 ? FECHA_MODIFICACION : new Date(),
            MODIFICADO_POR: MODIFICADO_POR !== null && MODIFICADO_POR !== void 0 ? MODIFICADO_POR : usuario.MODIFICADO_POR,
            PRIMER_INGRESO: PRIMER_INGRESO !== null && PRIMER_INGRESO !== void 0 ? PRIMER_INGRESO : usuario.PRIMER_INGRESO,
            FECHA_VENCIMIENTO: FECHA_VENCIMIENTO !== null && FECHA_VENCIMIENTO !== void 0 ? FECHA_VENCIMIENTO : usuario.FECHA_VENCIMIENTO,
            CORREO_ELECTRONICO: CORREO_ELECTRONICO !== null && CORREO_ELECTRONICO !== void 0 ? CORREO_ELECTRONICO : usuario.CORREO_ELECTRONICO,
        });
        res.status(200).json({
            msg: `Usuario con ID ${ID_USUARIO} actualizado correctamente.`,
        });
    }
    catch (error) {
        console.error("Error al actualizar el usuario:", error);
        res.status(500).json({
            msg: "Error al actualizar el usuario.",
        });
    }
});
exports.updateUsuario = updateUsuario;
//Traer usuario
const getUsuarioEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                msg: `Debe proporcionar paramentros`,
            });
        }
        const user = yield ms_usuarios_1.ms_usuarios.findOne({
            where: { CORREO_ELECTRONICO: email },
        });
        if (!email) {
            return res.status(404).json({
                msg: `Usuario no encontrado`,
            });
        }
        res.json(user);
    }
    catch (error) {
        console.error("Error buscr usuario: ", error);
        res.status(500).json({
            msg: `Error de servidor`,
        });
    }
});
exports.getUsuarioEmail = getUsuarioEmail;
// Genrar un código
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { correoE } = req.body;
        if (!correoE) {
            return res.status(400).json({
                msg: "El campo 'email' es requerido.",
            });
        }
        const user = yield ms_usuarios_1.ms_usuarios.findOne({
            where: { CORREO_ELECTRONICO: correoE },
        });
        if (!user) {
            return res.status(404).json({
                msg: "No existe un usuario con ese correo.",
            });
        }
        // Generar el código y fecha de expiración 
        const code = generateCode();
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        yield user.update({
            resetCode: code,
            resetCodeExpires: expires,
        });
        // Enviar el correo con Nodemailer
        yield emailService_1.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: correoE,
            subject: "Recuperación de contraseña",
            text: `Tu código de recuperación es: ${code}. Expira en 15 minutos.`
        });
        return res.json({
            msg: "Código de recuperación enviado al correo.",
        });
    }
    catch (error) {
        console.error("Error en recuperacion de contraseña:", error);
        return res.status(500).json({
            msg: "Error del servidor al solicitar recuperación.",
            error
        });
    }
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { correoE, code, newContrasena } = req.body;
        if (!correoE || !code || !newContrasena) {
            return res.status(400).json({
                msg: "correo, codigo, y neueva Contraseña son requeridos."
            });
        }
        // Buscar usuario por correo
        const user = yield ms_usuarios_1.ms_usuarios.findOne({
            where: { CORREO_ELECTRONICO: correoE },
        });
        if (!user) {
            return res.status(404).json({
                msg: "Usuario no encontrado."
            });
        }
        // Verificar que el código coincida
        if (user.getDataValue("resetCode") !== code) {
            return res.status(400).json({
                msg: "El código es inválido."
            });
        }
        // Verificar que no esté expirado
        const expires = user.getDataValue("resetCodeExpires");
        if (!expires || expires.getTime() < Date.now()) {
            return res.status(400).json({
                msg: "El código ha expirado, solicita uno nuevo."
            });
        }
        // // Hashear la nueva contraseña
        // const hashedPassword = await bycryp.hash(newPassword, 10);
        // Actualizar la contraseña y limpiar el code
        yield user.update({
            CONTRASEÑA: newContrasena,
            resetCode: null,
            resetCodeExpires: null,
        });
        return res.json({
            msg: "Contraseña restablecida correctamente."
        });
    }
    catch (error) {
        console.error("Error en resetPassword:", error);
        return res.status(500).json({
            msg: "Error del servidor al restablecer la contraseña.",
            error
        });
    }
});
exports.resetPassword = resetPassword;
