"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ms_usuarios_1 = require("../controllers/ms_usuarios");
const router = (0, express_1.Router)();
router.post("/api/ms_usuarios/register", ms_usuarios_1.registrerUser);
router.post("/api/ms_usuarios/login", ms_usuarios_1.login);
router.get("/api/ms_usuarios/getUsuarios", ms_usuarios_1.getUsuarios);
router.delete("/api/ms_usuarios/deleteUsuario", ms_usuarios_1.deleteUsuario);
router.put("/api/ms_usuarios/updateUsuario", ms_usuarios_1.updateUsuario);
router.get("/api/ms_usuarios/getUsuarioEmail", ms_usuarios_1.getUsuarioEmail);
// Rutas para recuperación de contraseña
router.post("/api/ms_usuarios/request-password-reset", ms_usuarios_1.requestPasswordReset);
router.post("/api/ms_usuarios/reset-password", ms_usuarios_1.resetPassword);
exports.default = router;
