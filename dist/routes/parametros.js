"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parametros_1 = require("../controllers/parametros");
const validartoken_1 = __importDefault(require("./validartoken"));
const validarPermiso_1 = require("./validarPermiso");
// import validarToken from "../routes/validartoken";
const router = (0, express_1.Router)();
router.post("/api/parametros/CrearParametro", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('insercion', 'PARAMETRO'), parametros_1.CrearParametro);
router.get("/api/parametros/getParametros", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'PARAMETRO'), parametros_1.getParametros);
router.delete("/api/parametros/deleteParametro", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'PARAMETRO'), parametros_1.deleteParametro);
router.put("/api/parametros/updateParametros", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'PARAMETRO'), parametros_1.updateParametros);
exports.default = router;
