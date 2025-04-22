"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clase_1 = require("../controllers/UNAH/clase");
const validartoken_1 = __importDefault(require("./validartoken"));
const validarPermiso_1 = require("./validarPermiso");
const router = (0, express_1.Router)();
router.post("/api/clase/createClase", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('insercion', 'CLASE'), clase_1.createClase);
router.get("/api/clase/getClase", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'CLASE'), clase_1.getClase);
router.put("/api/clase/updateClase", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'CLASE'), clase_1.updateClase);
router.delete("/api/clase/deleteClase", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'CLASE'), clase_1.deleteClase);
exports.default = router;
