"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estado_1 = require("../controllers/estado");
const validarPermiso_1 = require("./validarPermiso");
const validartoken_1 = __importDefault(require("./validartoken"));
const router = (0, express_1.Router)();
router.post("/api/estado/createEstado", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('insercion', 'ESTADO'), estado_1.createEstado);
router.get("/api/estado/getEstado", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'ESTADO'), estado_1.getEstado);
router.put("/api/estado/updateEstado", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'ESTADO'), estado_1.updateEstado);
router.delete("/api/estado/deleteEstado", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'ESTADO'), estado_1.deleteEstado);
exports.default = router;
