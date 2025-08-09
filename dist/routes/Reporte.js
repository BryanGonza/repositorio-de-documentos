"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Reporte_1 = require("../controllers/Reporte");
const router = (0, express_1.Router)();
router.get("/api/reporte/documentos", Reporte_1.getReporteDocumentos);
exports.default = router;
