"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const facultad_1 = require("../controllers/UNAH/facultad");
const validarPermiso_1 = require("./validarPermiso");
const validartoken_1 = __importDefault(require("./validartoken"));
const router = (0, express_1.Router)();
router.post("/api/facultad/createFacultad", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('insercion', 'FACULTAD'), facultad_1.createFacultad);
router.get("/api/facultad/getFacultad", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'FACULTAD'), facultad_1.getFacultad);
router.put("/api/facultad/updateFacultad", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'FACULTAD'), facultad_1.updateFacultad);
router.delete("/api/facultad/deleteFacultad", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'FACULTAD'), facultad_1.deleteFacultad);
exports.default = router;
