"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estructura_archivos_1 = require("../controllers/Documetos/estructura_archivos");
const router = (0, express_1.Router)();
// validarTokenConPermisos, validarPermiso('insercion', 'ESTRUCTURA DE ARCHIVOS'),
router.post("/api/estructura_archivos/createEstructura", estructura_archivos_1.createEstructura);
router.get("/api/estructura_archivos/getEstructura", estructura_archivos_1.getEstructura);
router.put("/api/estructura_archivos/updateEstructura", estructura_archivos_1.updateEstructura);
router.delete("/api/estructura_archivos/deleteEstructura", estructura_archivos_1.deleteEstructura);
exports.default = router;
