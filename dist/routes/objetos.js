"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const objetos_1 = require("../controllers/objetos");
const validartoken_1 = __importDefault(require("./validartoken"));
const validarPermiso_1 = require("./validarPermiso");
const router = (0, express_1.Router)();
router.post("/api/objetos/createObjetos", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('insercion', 'OBJETO'), objetos_1.createObjetos);
router.get("/api/objetos/getObjetos", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('consulta', 'OBJETO'), objetos_1.getObjetos);
router.put("/api/objetos/updateObjetos", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('actualizacion', 'OBJETO'), objetos_1.updateObjetos);
router.delete("/api/objetos/deleteObjetos", validartoken_1.default, (0, validarPermiso_1.validarPermiso)('eliminacion', 'OBJETO'), objetos_1.deleteObjetos);
router.get("/api/objetos/objetosPermisos", validartoken_1.default, objetos_1.getObjetosConPermisos);
exports.default = router;
