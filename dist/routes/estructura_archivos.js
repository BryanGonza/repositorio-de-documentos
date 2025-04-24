"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estructura_archivos_1 = require("../controllers/Documetos/estructura_archivos");
const validarPermiso_1 = require("./validarPermiso");
const validartoken_1 = __importDefault(require("./validartoken"));
const router = (0, express_1.Router)();
// validarTokenConPermisos, validarPermiso('insercion', 'ESTRUCTURA DE ARCHIVOS'),
router.post("/api/estructura_archivos/createEstructura", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('insercion', 'ESTRUCTURA DE ARCHIVOS'), estructura_archivos_1.createEstructura);
router.get("/api/estructura_archivos/getEstructura", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'ESTRUCTURA DE ARCHIVOS'), estructura_archivos_1.getEstructura);
router.put("/api/estructura_archivos/updateEstructura", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'ESTRUCTURA DE ARCHIVOS'), estructura_archivos_1.updateEstructura);
router.delete("/api/estructura_archivos/deleteEstructura", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'ESTRUCTURA DE ARCHIVOS'), estructura_archivos_1.deleteEstructura);
exports.default = router;
