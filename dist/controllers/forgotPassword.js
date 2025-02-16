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
exports.requestPasswordReset = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ms_usuarios_1 = require("../models/ms_usuarios");
const emailService_1 = require("../controllers/emailService"); // o donde hayas configurado Nodemailer
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // 1. Verificar si se recibió el email
        if (!email) {
            return res.status(400).json({ msg: "El campo email es requerido." });
        }
        // 2. Buscar el usuario
        const user = yield ms_usuarios_1.ms_usuarios.findOne({
            where: { CORREO_ELECTRONICO: email },
        });
        if (!user) {
            return res.status(404).json({
                msg: "No existe un usuario con este correo electrónico.",
            });
        }
        // 3. Generar token único y fecha de expiración (1 hora)
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
        // 4. Guardar el token y la expiración en la BD
        //    Ajusta los nombres de campo según tu modelo
        yield user.update({
            resetToken: resetToken,
            resetTokenExpires: tokenExpires,
        });
        // 5. Construir el enlace de restablecimiento (ajusta tu URL de front-end)
        const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;
        // 6. Enviar el correo
        yield emailService_1.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Recuperar Contraseña",
            text: `Has solicitado restablecer tu contraseña. Da clic en el siguiente enlace para continuar: ${resetLink}`,
            // También puedes enviar HTML si lo deseas
            // html: `<p>Has solicitado restablecer tu contraseña. Da clic en el siguiente enlace:</p>
            //        <a href="${resetLink}">${resetLink}</a>`
        });
        return res.json({
            msg: "Se ha enviado un correo con las instrucciones para restablecer la contraseña.",
        });
    }
    catch (error) {
        console.error("Error en requestPasswordReset:", error);
        return res.status(500).json({
            msg: "Error del servidor al solicitar restablecimiento.",
            error,
        });
    }
});
exports.requestPasswordReset = requestPasswordReset;
