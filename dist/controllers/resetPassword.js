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
exports.resetPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const ms_usuarios_1 = require("../models/ms_usuarios");
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, newPassword } = req.body;
        // 1. Validar campos
        if (!token || !newPassword) {
            return res.status(400).json({
                msg: "Token y nueva contraseña son requeridos.",
            });
        }
        // 2. Buscar al usuario con ese token
        const user = yield ms_usuarios_1.ms_usuarios.findOne({
            where: { resetToken: token },
        });
        if (!user) {
            return res.status(404).json({
                msg: "Token inválido o usuario no encontrado.",
            });
        }
        // 3. Verificar que el token no haya expirado
        if (!user.resetTokenExpires ||
            user.resetTokenExpires.getTime() < new Date().getTime()) {
            return res.status(400).json({
                msg: "El token ha expirado, solicita uno nuevo.",
            });
        }
        // 4. Hashear la nueva contraseña y actualizar
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        yield user.update({
            CONTRASEÑA: hashedPassword, // Nombre exacto en tu tabla
            resetToken: null,
            resetTokenExpires: null,
        });
        return res.json({
            msg: "La contraseña se ha restablecido exitosamente.",
        });
    }
    catch (error) {
        console.error("Error en resetPassword:", error);
        return res.status(500).json({
            msg: "Error del servidor al restablecer contraseña.",
            error,
        });
    }
});
exports.resetPassword = resetPassword;
