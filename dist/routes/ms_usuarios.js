"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ms_usuarios_1 = require("../controllers/ms_usuarios");
const validartoken_1 = __importDefault(require("../routes/validartoken"));
const router = (0, express_1.Router)();
router.post("/api/ms_usuarios/register", ms_usuarios_1.registrerUser);
router.post("/api/ms_usuarios/login", ms_usuarios_1.login);
router.get("/api/ms_usuarios/getUsuarios", validartoken_1.default, ms_usuarios_1.getUsuarios);
router.delete("/api/ms_usuarios/deleteUsuario", ms_usuarios_1.deleteUsuario);
router.put("/api/ms_usuarios/updateUsuario", ms_usuarios_1.updateUsuario);
router.get("/api/ms_usuarios/getUsuarioEmail", ms_usuarios_1.getUsuarioEmail);
exports.default = router;
