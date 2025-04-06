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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.getUsuarioEmail = exports.updateUsuario = exports.deleteUsuario = exports.cambiarContrasena = exports.login = exports.getUsuarios = exports.registrerUser = void 0;
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
    console.log("Datos recibidos:", req.body);
    try {
        yield ms_usuarios_1.ms_usuarios.create({
            ID_USUARIO: ID_USUARIO,
            ID_DEPARTAMENTO: ID_DEPARTAMENTO,
            NUM_IDENTIDAD: NUM_IDENTIDAD,
            ID_CARGO: ID_CARGO,
            DIRECCION_1: DIRECCION_1,
            DIRECCION_2: DIRECCION_2,
            USUARIO: USUARIO.toUpperCase(),
            NOMBRE_USUARIO: NOMBRE_USUARIO.toUpperCase(),
            ESTADO_USUARIO: "NUEVO",
            CONTRASEÑA: CONTRASEÑA.toUpperCase(),
            ID_ROL: ID_ROL,
            FECHA_ULTIMA_CONEXION: FECHA_ULTIMA_CONEXION,
            PREGUNTAS_CONTESTADAS: PREGUNTAS_CONTESTADAS,
            FECHA_CREACION: new Date(),
            CREADO_POR: CREADO_POR,
            FECHA_MODIFICACION: FECHA_MODIFICACION,
            MODIFICADO_POR: MODIFICADO_POR,
            PRIMER_INGRESO: PRIMER_INGRESO,
            FECHA_VENCIMIENTO: FECHA_VENCIMIENTO,
            CORREO_ELECTRONICO: CORREO_ELECTRONICO.toUpperCase(),
        });
        res.json({
            msg: `Usuario ${NOMBRE_USUARIO.toUpperCase()} creado correctamente...`,
        });
    }
    catch (error) {
        console.error("Error en la creación del usuario:", error);
        res.status(500).json({
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
// Login de Usuario
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { CORREO_ELECTRONICO, CONTRASEÑA } = req.body;
    try {
        const [resultado] = yield conexion_1.default.query("CALL ValidarUsuario(?, ?);", {
            replacements: [CORREO_ELECTRONICO, CONTRASEÑA],
        });
        if (!resultado) {
            return res.status(401).json({ msg: "Credenciales incorrectas" });
        }
        const [estadoUsuario] = yield conexion_1.default.query("SELECT ESTADO_USUARIO FROM ms_usuarios WHERE CORREO_ELECTRONICO = ?;", {
            replacements: [CORREO_ELECTRONICO],
        });
        if (estadoUsuario.length > 0 &&
            estadoUsuario[0].ESTADO_USUARIO === "NUEVO") {
            return res.status(403).json({
                success: false,
                msg: "Debe cambiar su contraseña antes de iniciar sesión",
            });
        }
        const [rolUsuario] = yield conexion_1.default.query(`
        SELECT r.ID_ROL, r.ROL
        FROM ms_usuarios u
        INNER JOIN ms_roles r ON u.ID_ROL = r.ID_ROL
        WHERE u.CORREO_ELECTRONICO = ?
        LIMIT 1;
      `, {
            replacements: [CORREO_ELECTRONICO],
        });
        if (!rolUsuario || rolUsuario.length === 0) {
            return res.status(500).json({ msg: "No se encontró el rol del usuario" });
        }
        const idRol = rolUsuario[0].ID_ROL;
        // Manejo de caso si no existe registro 
        if (!rolUsuario || rolUsuario.length === 0) {
            return res.status(500).json({ msg: "No se encontró el rol del usuario" });
        }
        const nombreRol = rolUsuario[0].ROL;
        // generar token JWT 
        const token = jsonwebtoken_1.default.sign({
            CORREO_ELECTRONICO,
            rol: idRol, // Aquí usas el ID numérico del rol
        }, process.env.Secret_key || "Repositorio_Documentos_2025", { expiresIn: "1h" });
        return res.json({
            success: true,
            msg: "Inicio de sesión exitoso",
            token,
        });
    }
    catch (error) {
        if (error.parent && error.parent.sqlState === "45000") {
            return res
                .status(400)
                .json({ msg: error.parent.sqlMessage || "Error en el login" });
        }
        console.error("Error: ", error);
        return res.status(500).json({ msg: "Error del servidor" });
    }
});
exports.login = login;
// Cambio de contraseña y actualizar estado
const cambiarContrasena = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { CORREO_ELECTRONICO, NUEVA_CONTRASEÑA } = req.body;
    try {
        yield conexion_1.default.query("UPDATE ms_usuarios SET CONTRASEÑA = ?, ESTADO_USUARIO = 'ACTIVO' WHERE CORREO_ELECTRONICO = ?;", {
            replacements: [NUEVA_CONTRASEÑA, CORREO_ELECTRONICO],
        });
        return res.json({
            success: true,
            msg: "Contraseña actualizada correctamente. Ya puede iniciar sesión.",
        });
    }
    catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ msg: "Error del servidor" });
    }
});
exports.cambiarContrasena = cambiarContrasena;
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
    const _a = req.body, { ID_USUARIO, CONTRASEÑA } = _a, campos = __rest(_a, ["ID_USUARIO", "CONTRASE\u00D1A"]);
    try {
        // Buscar usuario
        const usuario = yield ms_usuarios_1.ms_usuarios.findOne({ where: { ID_USUARIO } });
        if (!usuario) {
            return res
                .status(404)
                .json({ msg: `No se encontró un usuario con el ID ${ID_USUARIO}.` });
        }
        if (CONTRASEÑA) {
            campos.CONTRASEÑA = yield CONTRASEÑA;
            campos.ESTADO_USUARIO = "NUEVO";
        }
        // Convertir valores a mayúsculas donde corresponda
        if (campos.USUARIO)
            campos.USUARIO = campos.USUARIO.toUpperCase();
        if (campos.NOMBRE_USUARIO)
            campos.NOMBRE_USUARIO = campos.NOMBRE_USUARIO.toUpperCase();
        if (campos.CORREO_ELECTRONICO)
            campos.CORREO_ELECTRONICO = campos.CORREO_ELECTRONICO.toUpperCase();
        if (campos.DIRECCION_1)
            campos.DIRECCION_1 = campos.DIRECCION_1.toUpperCase();
        if (campos.DIRECCION_2)
            campos.DIRECCION_2 = campos.DIRECCION_2.toUpperCase();
        // Si hay cambios, actualiza el usuario
        if (Object.keys(campos).length > 0) {
            yield usuario.update(campos);
        }
        res
            .status(200)
            .json({ msg: `Usuario con ID ${ID_USUARIO} actualizado correctamente.` });
    }
    catch (error) {
        console.error("Error al actualizar el usuario:", error);
        res.status(500).json({ msg: "Error al actualizar el usuario." });
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
        const transporter = yield (0, emailService_1.configurarTransporter)();
        // Configurar el correo electrónico
        const mailOptions = {
            from: process.env.EMAIL_USER, // Correo del remitente
            to: correoE, // Correo del destinatario
            subject: "Recuperación de contraseña",
            html: `<p>Estimado/a <strong>${user.NOMBRE_USUARIO}</strong>,</p>
    
      <p>Gracias por utilizar los servicios de la <strong>Universidad Nacional Autónoma de Honduras</strong>.</p>
      
      <p>Para continuar con el proceso de recuperación de su contraseña, por favor siga los siguientes pasos:</p>
      
      <ol>
        <li>Introduzca el siguiente código de recuperación en la página correspondiente:</li>
        <p><strong>Código de Recuperación: ${code}</strong></p>
        <li>Haga clic en el siguiente enlace para acceder a la página de verificación:<br>
        <a href="http://localhost:4200/ResetContrasena">http://localhost:4200/ResetContrasena</a></li>
      </ol>
      
      <p>Tenga en cuenta que este <strong>código expira en 15 minutos.</strong></p>
      
      <p>Si no ha solicitado la recuperación de su contraseña, por favor ignore este mensaje.</p>
      
      <p>Atentamente,<br>
      <strong>Universidad Nacional Autónoma de Honduras</strong></p>
      
         
      <div style="background-color: #333; color: #fff; text-align: center; padding: 10px 0; position: fixed; bottom: 0; width: 100%;">
        
        <p>© Derechos reservados Universidad Nacional Autónoma de Honduras 2025 Desarrollado por TechDesign.</p>
        <img src="https://eslared.net/sites/default/files/2020-06/unah_logo.png" alt="Logo UNAH" style="width: 50px; height: auto;">
  </div>`,
        };
        // Enviar el correo
        const info = yield transporter.sendMail(mailOptions);
        console.log("Correo enviado:", info.response);
        return res.json({
            msg: "Código de recuperación enviado al correo.",
        });
    }
    catch (error) {
        console.error("Error en recuperacion de contraseña:", error);
        return res.status(500).json({
            msg: "Error del servidor al solicitar recuperación.",
            error,
        });
    }
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { correoE, code, newContrasena } = req.body;
        if (!correoE || !code || !newContrasena) {
            return res.status(400).json({
                msg: "correo, codigo, y neueva Contraseña son requeridos.",
            });
        }
        // Buscar usuario por correo
        const user = yield ms_usuarios_1.ms_usuarios.findOne({
            where: { CORREO_ELECTRONICO: correoE },
        });
        if (!user) {
            return res.status(404).json({
                msg: "Usuario no encontrado.",
            });
        }
        // Verificar que el código coincida
        if (user.getDataValue("resetCode") !== code) {
            return res.status(400).json({
                msg: "El código es inválido.",
            });
        }
        // Verificar que no esté expirado
        const expires = user.getDataValue("resetCodeExpires");
        if (!expires || expires.getTime() < Date.now()) {
            return res.status(400).json({
                msg: "El código ha expirado, solicita uno nuevo.",
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
            msg: "Contraseña restablecida correctamente.",
        });
    }
    catch (error) {
        console.error("Error en resetPassword:", error);
        return res.status(500).json({
            msg: "Error del servidor al restablecer la contraseña.",
            error,
        });
    }
});
exports.resetPassword = resetPassword;
