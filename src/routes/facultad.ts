import { Router } from "express";
import { createFacultad, getFacultad, updateFacultad, deleteFacultad } from "../controllers/UNAH/facultad";
import { validarPermiso } from "./validarPermiso";
import validarTokenConPermisos from "./validartoken";

const router = Router();

router.post("/api/facultad/createFacultad", validarTokenConPermisos, validarPermiso('insercion', 'FACULTAD'), createFacultad);
router.get("/api/facultad/getFacultad", validarTokenConPermisos, validarPermiso('consulta', 'FACULTAD'), getFacultad);
router.put("/api/facultad/updateFacultad",validarTokenConPermisos, validarPermiso('actualizacion', 'FACULTAD'),  updateFacultad);
router.delete("/api/facultad/deleteFacultad",  validarTokenConPermisos, validarPermiso('eliminacion', 'FACULTAD'), deleteFacultad);


export default router;