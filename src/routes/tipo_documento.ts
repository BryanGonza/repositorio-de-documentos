import { Router } from "express";
import { createTipo_d, getTipo_d, updateTipo_d, deleteTipo_d } from "../controllers/Documetos/tipo_documento";
import { validarPermiso } from "./validarPermiso";
import validarTokenConPermisos from "./validartoken";

const router = Router();

router.post("/api/tipo_documento/createTipo_d", validarTokenConPermisos, validarPermiso('insercion', 'TIPO DE DOCUMENTO'), createTipo_d);
router.get("/api/tipo_documento/getTipo_d", validarTokenConPermisos, validarPermiso('consulta', 'TIPO DE DOCUMENTO'), getTipo_d);
router.put("/api/tipo_documento/updateTipo_d",  validarTokenConPermisos, validarPermiso('actualizacion', 'TIPO DE DOCUMENTO'), updateTipo_d);
router.delete("/api/tipo_documento/deleteTipo_d", validarTokenConPermisos, validarPermiso('eliminacion', 'TIPO DE DOCUMENTO'), deleteTipo_d);



export default router;