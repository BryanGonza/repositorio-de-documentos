import { Router } from "express";
import { createEstructura, getEstructura, updateEstructura, deleteEstructura } from "../controllers/Documetos/estructura_archivos";
import { validarPermiso } from "./validarPermiso";
import validarTokenConPermisos from "./validartoken";

const router = Router();
// validarTokenConPermisos, validarPermiso('insercion', 'ESTRUCTURA DE ARCHIVOS'),
router.post("/api/estructura_archivos/createEstructura",  createEstructura);
router.get("/api/estructura_archivos/getEstructura", getEstructura);
router.put("/api/estructura_archivos/updateEstructura", updateEstructura);
router.delete("/api/estructura_archivos/deleteEstructura", deleteEstructura);


export default router;