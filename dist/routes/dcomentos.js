"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import  { SubirDoc} from "../controllers/documentos";
const documetos_midd_1 = require("../middlewares/documetos.midd");
const documentos_1 = require("../controllers/documentos");
const router = (0, express_1.Router)();
router.post("/api/Documentos/subirDc", documetos_midd_1.cargas, documentos_1.SubirDoc);
exports.default = router;
