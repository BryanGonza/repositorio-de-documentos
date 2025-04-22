import { Router } from "express";
import { createTipo_archivo, getTipo_archivo, updateTipo_archivo, deleteTipo_archivo } from "../controllers/Documetos/tipo_archivo";
import { validarPermiso } from "./validarPermiso";
import validarTokenConPermisos from "./validartoken";

const router = Router();

router.post("/api/tipo_archivo/createTipo_archivo", validarTokenConPermisos, validarPermiso('insercion', 'ARCHIVO'), createTipo_archivo);
router.get("/api/tipo_archivo/getTipo_archivo",validarTokenConPermisos, validarPermiso('consulta', 'ARCHIVO'), getTipo_archivo);
router.put("/api/tipo_archivo/updateTipo_archivo", validarTokenConPermisos, validarPermiso('actualizacion', 'ARCHIVO'), updateTipo_archivo);
router.delete("/api/tipo_archivo/deleteTipo_archivo", validarTokenConPermisos, validarPermiso('eliminacion', 'ARCHIVO'), deleteTipo_archivo);


export default router;