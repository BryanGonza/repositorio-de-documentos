import { Router } from "express";
import { createClase, getClase, updateClase, deleteClase } from "../controllers/UNAH/clase";
import validarTokenConPermisos from "./validartoken";
import { validarPermiso } from "./validarPermiso";

const router = Router();

router.post("/api/clase/createClase", validarTokenConPermisos, validarPermiso('insercion', 'CLASE'), createClase);
router.get("/api/clase/getClase",  validarTokenConPermisos, validarPermiso('consulta', 'CLASE'), getClase);
router.put("/api/clase/updateClase",  validarTokenConPermisos, validarPermiso('actualizacion', 'CLASE'), updateClase);
router.delete("/api/clase/deleteClase", validarTokenConPermisos, validarPermiso('eliminacion', 'CLASE'), deleteClase);


export default router;