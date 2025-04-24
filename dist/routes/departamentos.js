"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const departamentos_1 = require("../controllers/UNAH/departamentos");
const validarPermiso_1 = require("./validarPermiso");
const validartoken_1 = __importDefault(require("./validartoken"));
const router = (0, express_1.Router)();
router.post("/api/departamentos/createDep", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('insercion', 'departamento'), departamentos_1.createDep);
router.get("/api/departamentos/getDep", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'departamento'), departamentos_1.getDep);
router.put("/api/departamentos/updateDep", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'departamento'), departamentos_1.updateDep);
router.delete("/api/departamentos/deleteDep", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'departamento'), departamentos_1.deleteDep);
exports.default = router;
