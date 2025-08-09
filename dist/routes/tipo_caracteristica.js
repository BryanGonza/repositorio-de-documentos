"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipo_caracteristica_1 = require("../controllers/Documetos/tipo_caracteristica");
const validartoken_1 = __importDefault(require("./validartoken"));
const validarPermiso_1 = require("./validarPermiso");
const router = (0, express_1.Router)();
router.post("/api/tipo_caracteristica/createTipo_c", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('insercion', 'CARACTERISTICA'), tipo_caracteristica_1.createTipo_c);
router.get("/api/tipo_caracteristica/getTipo_c", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'CARACTERISTICA'), tipo_caracteristica_1.getTipo_c);
router.put("/api/tipo_caracteristica/updateTipo_c", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'CARACTERISTICA'), tipo_caracteristica_1.updateTipo_c);
router.delete("/api/tipo_caracteristica/deleteTipo_c", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'CARACTERISTICA'), tipo_caracteristica_1.deleteTipo_c);
exports.default = router;
