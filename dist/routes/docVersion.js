"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const docVersion_1 = require("../controllers/Documetos/docVersion");
const validartoken_1 = __importDefault(require("./validartoken"));
const router = (0, express_1.Router)();
router.post("/api/docVersion/createDocV", validartoken_1.default, docVersion_1.createDocV);
router.get("/api/docVersion/getDocV", validartoken_1.default, docVersion_1.getDocV);
router.put("/api/docVersion/updateDocV", validartoken_1.default, docVersion_1.updateDocV);
router.delete("/api/docVersion/deleteDocV", validartoken_1.default, docVersion_1.deleteDocV);
exports.default = router;
