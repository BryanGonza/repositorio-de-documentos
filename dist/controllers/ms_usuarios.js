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
exports.resetPassword = exports.requestPasswordReset = exports.getUsuarioEmail = exports.updateUsuario = exports.deleteUsuario = exports.cambiarConperfil = exports.cambiarContrasena = exports.login = exports.getUsuarios = exports.registrerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const ms_usuarios_1 = require("../models/ms_usuarios");
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const conexion_1 = __importDefault(require("../database/conexion"));
const emailService_1 = require("../controllers/emailService");
const parametros_1 = require("../models/parametros");
//Registrar un usuario
const registrerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_USUARIO, ID_DEPARTAMENTO, NUM_IDENTIDAD, ID_CARGO, DIRECCION_1, DIRECCION_2, USUARIO, NOMBRE_USUARIO, ESTADO_USUARIO, // No se usa directamente
    CONTRASEÑA, ID_ROL, FECHA_ULTIMA_CONEXION, PREGUNTAS_CONTESTADAS, CREADO_POR, FECHA_MODIFICACION, MODIFICADO_POR, PRIMER_INGRESO, FECHA_VENCIMIENTO, CORREO_ELECTRONICO, } = req.body;
    const CONTRASEÑAHash = yield bcrypt_1.default.hash(CONTRASEÑA, 10);
    try {
        // Paso 1: Ejecutar el procedimiento almacenado
        yield conexion_1.default.query(`CALL registrar_usuario(
      :ID_DEPARTAMENTO,
      :NUM_IDENTIDAD,
      :USUARIO,
      :NOMBRE_USUARIO,
      :CONTRASENA,
      :ID_ROL,
      :CORREO_ELECTRONICO,
      @p_EXISTE
    );`, {
            replacements: {
                ID_DEPARTAMENTO,
                NUM_IDENTIDAD,
                USUARIO,
                NOMBRE_USUARIO,
                CONTRASENA: CONTRASEÑA,
                ID_ROL,
                CORREO_ELECTRONICO
            }
        });
        // Paso 2: Obtener el valor de @p_EXISTE
        const [existeResult] = yield conexion_1.default.query(`SELECT @p_EXISTE AS existe;`);
        const existe = (_a = existeResult[0]) === null || _a === void 0 ? void 0 : _a.existe;
        if (existe === 1) {
            return res.status(400).json({
                msg: `Ya existe un usuario con email ${CORREO_ELECTRONICO} o el número de identidad ${NUM_IDENTIDAD}`,
            });
        }
        res.json({
            msg: `Usuario ${NOMBRE_USUARIO.toUpperCase()} creado correctamente...`,
        });
    }
    catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({
            msg: `Error al crear usuario ${NOMBRE_USUARIO.toUpperCase()}.`,
        });
    }
});
exports.registrerUser = registrerUser;
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conexion_1.default.query("CALL obtener_usuarios();");
        if (!result || result.length === 0) {
            return res.status(404).json({ msg: "No hay usuarios registrados." });
        }
        res.json({ ListUsuarios: result });
    }
    catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({
            msg: "Error al obtener la lista de usuarios.",
        });
    }
});
exports.getUsuarios = getUsuarios;
// export const getUsuarios = async (req: Request, res: Response) => {
//   const ListUsuarios = await ms_usuarios.findAll();
//   res.json({ ListUsuarios });
// };
//Login de usuario
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { CORREO_ELECTRONICO, CONTRASEÑA } = req.body;
    try {
        const [resultado] = yield conexion_1.default.query("CALL ValidarUsuarioCompleto(?, ?);", {
            replacements: [CORREO_ELECTRONICO, CONTRASEÑA],
        });
        console.log('→ Resultado SP ValidarUsuarioCompleto:', resultado);
        const datosUsuario = Array.isArray(resultado) ? resultado[0] : resultado;
        if (!datosUsuario || !datosUsuario.ID_USUARIO) {
            return res.status(401).json({ success: false, msg: "Credenciales incorrectas" });
        }
        if (datosUsuario.ESTADO_USUARIO === "NUEVO") {
            return res.status(403).json({
                success: false,
                msg: "Debe cambiar su contraseña antes de iniciar sesión",
                requiereCambioContraseña: true
            });
        }
        // Generar token JWT 
        const expParam = yield parametros_1.parametros.findOne({
            where: {
                [sequelize_1.Op.and]: [
                    { PARAMETRO: { [sequelize_1.Op.like]: '%EXPIRACION%' } },
                    { PARAMETRO: { [sequelize_1.Op.like]: '%SESION%' } },
                    { PARAMETRO: { [sequelize_1.Op.like]: '%HORAS%' } },
                ]
            }
        });
        const horas = expParam ? Number(expParam.VALOR) : 1;
        const expiresInSegundos = horas * 3600;
        const secretKey = process.env.Secret_key || 'Repositorio_Documentos_2025';
        const signOptions = { expiresIn: expiresInSegundos };
        const token = jsonwebtoken_1.default.sign({
            id: datosUsuario.ID_USUARIO,
            CORREO_ELECTRONICO,
            rol: datosUsuario.ID_ROL,
            nombreRol: datosUsuario.ROL,
            departamento: datosUsuario.ID_DEPARTAMENTO,
        }, secretKey, signOptions);
        return res.json({
            success: true,
            msg: "Inicio de sesión exitoso",
            token,
            usuario: {
                id: datosUsuario.ID_USUARIO,
                rol: datosUsuario.ID_ROL,
                nombreRol: datosUsuario.ROL,
                departamento: datosUsuario.ID_DEPARTAMENTO
            }
        });
    }
    catch (error) {
        console.error("Error en login:", error);
        if (((_a = error.original) === null || _a === void 0 ? void 0 : _a.code) === 'ER_SIGNAL_EXCEPTION') {
            const mensaje = ((_b = error.original) === null || _b === void 0 ? void 0 : _b.message) || "Error en credenciales";
            const status = mensaje.includes('bloqueado') ? 429 : 400;
            return res.status(status).json({ success: false, msg: mensaje });
        }
        return res.status(500).json({ success: false, msg: "Error del servidor" });
    }
});
exports.login = login;
// Cambio de contraseña y actualizar estado
const cambiarContrasena = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { CORREO_ELECTRONICO, NUEVA_CONTRASEÑA } = req.body;
    try {
        yield conexion_1.default.query("UPDATE tbl_usuarios SET CONTRASEÑA = ?, ESTADO_USUARIO = 'ACTIVO' WHERE CORREO_ELECTRONICO = ?;", {
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
// Cambio de contraseña y actualizar
const cambiarConperfil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { CORREO_ELECTRONICO, NUEVA_CONTRASEÑA } = req.body;
    try {
        yield conexion_1.default.query("UPDATE tbl_usuarios SET CONTRASEÑA = ? WHERE CORREO_ELECTRONICO = ?;", {
            replacements: [NUEVA_CONTRASEÑA, CORREO_ELECTRONICO],
        });
        return res.json({
            success: true,
            msg: "Contraseña actualizada correctamente.",
        });
    }
    catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ msg: "Error del servidor" });
    }
});
exports.cambiarConperfil = cambiarConperfil;
//eliminar un Usuario mediante id
// export const deleteUsuario = async (req: Request, res: Response) => {
//   const { ID_USUARIO } = req.body;
//   try {
//     const deletedCount = await ms_usuarios.destroy({
//       where: { ID_USUARIO: ID_USUARIO },
//     });
//     if (deletedCount === 0) {
//       return res.status(404).json({
//         msg: `No se encontró un usuario con el ID ${ID_USUARIO}.`,
//       });
//     }
//     res.json({
//       msg: `Usuario con ID ${ID_USUARIO} eliminado exitosamente.`,
//     });
//   } catch (error) {
//     console.error("Error al eliminar el usuario:", error);
//     res.status(500).json({
//       msg: "Error al eliminar el usuario.",
//     });
//   }
// };
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_USUARIO } = req.body;
    try {
        yield conexion_1.default.query('CALL eliminar_usuario(:ID_USUARIO)', {
            replacements: { ID_USUARIO },
        });
        res.json({
            msg: `Usuario con ID ${ID_USUARIO} eliminado exitosamente.`,
        });
    }
    catch (error) {
        console.error("Error al eliminar el usuario:", error);
        const msg = ((_a = error === null || error === void 0 ? void 0 : error.original) === null || _a === void 0 ? void 0 : _a.sqlMessage) || "Error al eliminar el usuario.";
        res.status(500).json({ msg });
    }
});
exports.deleteUsuario = deleteUsuario;
// //Elimina Usuario y todos los documentos relacionados
// export const deleteUsuario = async (req: Request, res: Response) => {
//   const { ID_USUARIO } = req.body;
//   const transaction = await sequelize.transaction();
//   try {
//     //elimina primero todos los documentos relacionados
//     await documentos.destroy({
//       where: { ID_USUARIO },
//       transaction, 
//     });
//     //elimina el usuario
//     const deletedCount = await ms_usuarios.destroy({
//       where: { ID_USUARIO },
//       transaction,
//     });
//     if (deletedCount === 0) {
//       // rollback si el usuario no existe
//       await transaction.rollback();
//       return res.status(404).json({
//         msg: `No se encontró un usuario con el ID ${ID_USUARIO}.`,
//       });
//     }
//     // Confirmacion
//     await transaction.commit();
//     res.json({
//       msg: `Usuario con ID ${ID_USUARIO} eliminado exitosamente.`,
//     });
//   } catch (error) {
//     // Si ocurre un error revierte la transacción
//     await transaction.rollback();
//     console.error("Error al eliminar el usuario:", error);
//     res.status(500).json({
//       msg: "Error al eliminar el usuario.",
//     });
//   }
// };
const updateUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ID_USUARIO, USUARIO, NOMBRE_USUARIO, CORREO_ELECTRONICO, DIRECCION_1, DIRECCION_2, CONTRASEÑA, ID_ROL, } = req.body;
    try {
        if (!ID_USUARIO) {
            return res.status(400).json({ msg: "El ID del usuario es requerido." });
        }
        // Ejecutar procedimiento almacenado
        yield conexion_1.default.query(`
  CALL ActualizarUsuario(
    :ID_USUARIO,
    :USUARIO,
    :NOMBRE_USUARIO,
    :CORREO_ELECTRONICO,
    :DIRECCION_1,
    :DIRECCION_2,
    :CONTRASENA,
    :ID_ROL
  )`, {
            replacements: {
                ID_USUARIO,
                USUARIO: USUARIO ? USUARIO.toUpperCase() : null,
                NOMBRE_USUARIO: NOMBRE_USUARIO ? NOMBRE_USUARIO.toUpperCase() : null,
                CORREO_ELECTRONICO: CORREO_ELECTRONICO ? CORREO_ELECTRONICO.toUpperCase() : null,
                DIRECCION_1: DIRECCION_1 ? DIRECCION_1.toUpperCase() : null,
                DIRECCION_2: DIRECCION_2 ? DIRECCION_2.toUpperCase() : null,
                CONTRASENA: CONTRASEÑA || null,
                ID_ROL: ID_ROL !== null && ID_ROL !== void 0 ? ID_ROL : null
            }
        });
        res.status(200).json({ msg: `Usuario con ID ${ID_USUARIO} actualizado correctamente.` });
    }
    catch (error) {
        console.error("Error al actualizar el usuario:", error);
        if ((_a = error.original) === null || _a === void 0 ? void 0 : _a.sqlMessage) {
            return res.status(400).json({ msg: error.original.sqlMessage });
        }
        res.status(500).json({ msg: "Error al actualizar el usuario." });
    }
});
exports.updateUsuario = updateUsuario;
//Actualizar usuarios ;)
// export const updateUsuario = async (req: Request, res: Response) => {
//   const { ID_USUARIO, CONTRASEÑA, ID_ROL, ...campos } = req.body;
//   try {
//     // Buscar usuario
//     const usuario = await ms_usuarios.findOne({ where: { ID_USUARIO } });
//     if (!usuario) {
//       return res
//         .status(404)
//         .json({ msg: `No se encontró un usuario con el ID ${ID_USUARIO}.` });
//     }
//     // Si viene contraseña, se actualiza y se marca como NUEVO
//     if (CONTRASEÑA) {
//       campos.CONTRASEÑA = CONTRASEÑA; // Si deseas encriptarla, hacelo aquí
//       campos.ESTADO_USUARIO = "NUEVO";
//     }
//     // Si viene el nuevo ID de rol, lo agregamos también
//     if (ID_ROL !== undefined && ID_ROL !== null) {
//       campos.ID_ROL = ID_ROL;
//     }
//     // Convertir valores a mayúsculas donde corresponda
//     if (campos.USUARIO) campos.USUARIO = campos.USUARIO.toUpperCase();
//     if (campos.NOMBRE_USUARIO)
//       campos.NOMBRE_USUARIO = campos.NOMBRE_USUARIO.toUpperCase();
//     if (campos.CORREO_ELECTRONICO)
//       campos.CORREO_ELECTRONICO = campos.CORREO_ELECTRONICO.toUpperCase();
//     if (campos.DIRECCION_1)
//       campos.DIRECCION_1 = campos.DIRECCION_1.toUpperCase();
//     if (campos.DIRECCION_2)
//       campos.DIRECCION_2 = campos.DIRECCION_2.toUpperCase();
//     // Si hay cambios, actualiza el usuario
//     if (Object.keys(campos).length > 0) {
//       await usuario.update(campos);
//     }
//     res
//       .status(200)
//       .json({ msg: `Usuario con ID ${ID_USUARIO} actualizado correctamente.` });
//   } catch (error) {
//     console.error("Error al actualizar el usuario:", error);
//     res.status(500).json({ msg: "Error al actualizar el usuario." });
//   }
// };
// export const updateUsuario = async (req: Request, res: Response) => {
//   const {
//     ID_USUARIO,
//     USUARIO,
//     NOMBRE_USUARIO,
//     CORREO_ELECTRONICO,
//     DIRECCION_1,
//     DIRECCION_2,
//     CONTRASEÑA,
//     MODIFICADO_POR,
//   } = req.body;
//   // Verificación de campos obligatorios
//   if (
//     !ID_USUARIO ||
//     !USUARIO ||
//     !NOMBRE_USUARIO ||
//     !CORREO_ELECTRONICO 
//   ) {
//     return res.status(400).json({
//       msg: "Faltan campos obligatorios en la petición. Verifica ID_USUARIO, USUARIO, NOMBRE_USUARIO, CORREO_ELECTRONICO, CONTRASEÑA y MODIFICADO_POR.",
//     });
//   }
//   try {
//     // Conversión segura a mayúsculas
//     const usuarioMayus = String(USUARIO).toUpperCase();
//     const nombreMayus = String(NOMBRE_USUARIO).toUpperCase();
//     const correoMayus = String(CORREO_ELECTRONICO).toUpperCase();
//     const dir1Mayus = DIRECCION_1 ? String(DIRECCION_1).toUpperCase() : null;
//     const dir2Mayus = DIRECCION_2 ? String(DIRECCION_2).toUpperCase() : null;
//     await sequelize.query('CALL actualizar_usuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', {
//       replacements: [
//         ID_USUARIO,
//         usuarioMayus,
//         nombreMayus,
//         correoMayus,
//         dir1Mayus,
//         dir2Mayus,
//         !CONTRASEÑA,
//         "NUEVO", 
//         MODIFICADO_POR,
//         new Date(),
//       ],
//     });
//     res.status(200).json({
//       msg: `Usuario con ID ${ID_USUARIO} actualizado correctamente.`,
//     });
//   } catch (error: any) {
//     console.error("Error al actualizar el usuario:", error);
//     res.status(500).json({
//       msg: error.sqlMessage || error.message || "Error al actualizar el usuario.",
//     });
//   }
// };
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
