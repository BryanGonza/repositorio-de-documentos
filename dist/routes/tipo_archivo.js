"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipo_archivo_1 = require("../controllers/Documetos/tipo_archivo");
const validarPermiso_1 = require("./validarPermiso");
const validartoken_1 = __importDefault(require("./validartoken"));
const router = (0, express_1.Router)();
router.post("/api/tipo_archivo/createTipo_archivo", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('insercion', 'ARCHIVO'), tipo_archivo_1.createTipo_archivo);
router.get("/api/tipo_archivo/getTipo_archivo", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'ARCHIVO'), tipo_archivo_1.getTipo_archivo);
router.put("/api/tipo_archivo/updateTipo_archivo", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'ARCHIVO'), tipo_archivo_1.updateTipo_archivo);
router.delete("/api/tipo_archivo/deleteTipo_archivo", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'ARCHIVO'), tipo_archivo_1.deleteTipo_archivo);
exports.default = router;
