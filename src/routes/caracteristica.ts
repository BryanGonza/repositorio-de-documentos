import { Router } from "express";
import { createCaracteristica, getCaracteristica, updateCaracteristica, deleteCaracteristica } from "../controllers/Documetos/caracteristica";
import validarTokenConPermisos from "./validartoken";
import { validarPermiso } from "./validarPermiso";

const router = Router();

router.post("/api/caracteristica/createCaracteristica", validarTokenConPermisos, validarPermiso('insercion', 'MANTENIMIENTO CARACTERISTICA'), createCaracteristica);
router.get("/api/caracteristica/getCaracteristica", validarTokenConPermisos, validarPermiso('consulta', 'MANTENIMIENTO CARACTERISTICA'), getCaracteristica);
router.put("/api/caracteristica/updateCaracteristica", validarTokenConPermisos, validarPermiso('actualizacion', 'MANTENIMIENTO CARACTERISTICA'), updateCaracteristica);
router.delete("/api/caracteristica/deleteCaracteristica", validarTokenConPermisos, validarPermiso('eliminacion', 'MANTENIMIENTO CARACTERISTICA'), deleteCaracteristica);


export default router;