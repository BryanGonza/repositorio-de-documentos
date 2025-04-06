"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const objetos_1 = require("../controllers/objetos");
const validartoken_1 = __importDefault(require("./validartoken"));
const router = (0, express_1.Router)();
router.post("/api/objetos/createObjetos", objetos_1.createObjetos);
router.get("/api/objetos/getObjetos", objetos_1.getObjetos);
router.put("/api/objetos/updateObjetos", objetos_1.updateObjetos);
router.delete("/api/objetos/deleteObjetos", objetos_1.deleteObjetos);
router.get("/api/roles/objetosPermisos", validartoken_1.default, objetos_1.getObjetosConPermisos);
exports.default = router;
