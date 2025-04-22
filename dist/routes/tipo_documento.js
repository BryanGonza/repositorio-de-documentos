"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipo_documento_1 = require("../controllers/Documetos/tipo_documento");
const validarPermiso_1 = require("./validarPermiso");
const validartoken_1 = __importDefault(require("./validartoken"));
const router = (0, express_1.Router)();
router.post("/api/tipo_documento/createTipo_d", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('insercion', 'TIPO DE DOCUMENTO'), tipo_documento_1.createTipo_d);
router.get("/api/tipo_documento/getTipo_d", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'TIPO DE DOCUMENTO'), tipo_documento_1.getTipo_d);
router.put("/api/tipo_documento/updateTipo_d", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'TIPO DE DOCUMENTO'), tipo_documento_1.updateTipo_d);
router.delete("/api/tipo_documento/deleteTipo_d", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'TIPO DE DOCUMENTO'), tipo_documento_1.deleteTipo_d);
exports.default = router;
