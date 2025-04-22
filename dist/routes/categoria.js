"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoria_1 = require("../controllers/Documetos/categoria");
const validarPermiso_1 = require("./validarPermiso");
const validartoken_1 = __importDefault(require("./validartoken"));
const router = (0, express_1.Router)();
router.post("/api/categoria/createCategoria", categoria_1.createCategoria);
router.get("/api/categoria/getCategoria", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'CATEGORIA'), categoria_1.getCategoria);
router.put("/api/categoria/updateCategoria", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'CATEGORIA'), categoria_1.updateCategoria);
router.delete("/api/categoria/deleteCategoria", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'CATEGORIA'), categoria_1.deleteCategoria);
exports.default = router;
