import { Router } from "express";
import { createEstructura, getEstructura, updateEstructura, deleteEstructura } from "../controllers/Documetos/estructura_archivos";
import { validarPermiso } from "./validarPermiso";
import validarTokenConPermisos from "./validartoken";

const router = Router();
// validarTokenConPermisos, validarPermiso('insercion', 'ESTRUCTURA DE ARCHIVOS'),
router.post("/api/estructura_archivos/createEstructura",   validarTokenConPermisos, validarPermiso('insercion', 'ESTRUCTURA DE ARCHIVOS'), createEstructura);
router.get("/api/estructura_archivos/getEstructura", validarTokenConPermisos, validarPermiso('consulta', 'ESTRUCTURA DE ARCHIVOS'), getEstructura);
router.put("/api/estructura_archivos/updateEstructura", validarTokenConPermisos, validarPermiso('actualizacion', 'ESTRUCTURA DE ARCHIVOS'), updateEstructura);
router.delete("/api/estructura_archivos/deleteEstructura", validarTokenConPermisos, validarPermiso('eliminacion', 'ESTRUCTURA DE ARCHIVOS'), deleteEstructura);


export default router;