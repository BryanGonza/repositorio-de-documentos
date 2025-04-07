"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ms_usuarios_1 = require("../controllers/ms_usuarios");
const validartoken_1 = require("../routes/validartoken");
const validarPermiso_1 = require("./validarPermiso");
const router = (0, express_1.Router)();
router.post("/api/ms_usuarios/register", validartoken_1.validarTokenConPermisos, (0, validarPermiso_1.validarPermiso)('insercion'), ms_usuarios_1.registrerUser);
router.post("/api/ms_usuarios/login", ms_usuarios_1.login);
router.get("/api/ms_usuarios/getUsuarios", validartoken_1.validarTokenConPermisos, ms_usuarios_1.getUsuarios);
router.delete("/api/ms_usuarios/deleteUsuario", validartoken_1.validarTokenConPermisos, (0, validarPermiso_1.validarPermiso)('eliminacion'), ms_usuarios_1.deleteUsuario);
router.put("/api/ms_usuarios/updateUsuario", validartoken_1.validarTokenConPermisos, (0, validarPermiso_1.validarPermiso)('actualizacion'), ms_usuarios_1.updateUsuario);
router.post("/api/ms_usuarios/getUsuarioEmail", ms_usuarios_1.getUsuarioEmail);
router.post("/api/ms_usuarios/cambioContrasena", ms_usuarios_1.cambiarContrasena);
router.post("/api/ms_usuarios/cambiarConperfil", ms_usuarios_1.cambiarConperfil);
// Rutas para recuperación de contraseña
router.post("/api/ms_usuarios/request-password-reset", ms_usuarios_1.requestPasswordReset);
router.post("/api/ms_usuarios/reset-password", ms_usuarios_1.resetPassword);
exports.default = router;
