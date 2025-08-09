"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const caracteristica_1 = require("../controllers/Documetos/caracteristica");
const validartoken_1 = __importDefault(require("./validartoken"));
const validarPermiso_1 = require("./validarPermiso");
const router = (0, express_1.Router)();
router.post("/api/caracteristica/createCaracteristica", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('insercion', 'MANTENIMIENTO CARACTERISTICA'), caracteristica_1.createCaracteristica);
router.get("/api/caracteristica/getCaracteristica", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'MANTENIMIENTO CARACTERISTICA'), caracteristica_1.getCaracteristica);
router.put("/api/caracteristica/updateCaracteristica", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'MANTENIMIENTO CARACTERISTICA'), caracteristica_1.updateCaracteristica);
router.delete("/api/caracteristica/deleteCaracteristica", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'MANTENIMIENTO CARACTERISTICA'), caracteristica_1.deleteCaracteristica);
exports.default = router;
