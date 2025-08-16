"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Roles_1 = require("../controllers/Roles");
const validarPermiso_1 = require("./validarPermiso");
const validartoken_1 = __importDefault(require("./validartoken"));
const router = (0, express_1.Router)();
router.post("/api/roles/createRol", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('insercion', 'ROL'), Roles_1.createRol);
router.get("/api/roles/getRoles", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'ROL'), Roles_1.getRoles);
router.put("/api/roles/updateRoles", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'ROL'), Roles_1.updateRoles);
router.delete("/api/roles/deleteRoles", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'ROL'), Roles_1.deleteroles);
exports.default = router;
