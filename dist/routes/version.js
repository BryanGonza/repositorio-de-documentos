"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const version_1 = require("../controllers/Documetos/version");
const validartoken_1 = __importDefault(require("./validartoken"));
const validarPermiso_1 = require("./validarPermiso");
const router = (0, express_1.Router)();
router.post("/api/version/createVersion", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('insercion', 'VERSION'), version_1.createVersion);
router.get("/api/version/getVersion", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'VERSION'), version_1.getVersion);
router.put("/api/version/updateVersion", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'VERSION'), version_1.updateVersion);
router.delete("/api/version/deleteVersion", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'VERSION'), version_1.deleteVersion);
exports.default = router;
