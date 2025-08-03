import { Router } from "express";
import { createTipo_c, getTipo_c, updateTipo_c, deleteTipo_c } from "../controllers/Documetos/tipo_caracteristica";
import validarTokenConPermisos from "./validartoken";
import { validarPermiso } from "./validarPermiso";

const router = Router();

router.post("/api/tipo_caracteristica/createTipo_c",  validarTokenConPermisos, validarPermiso('insercion', 'CARACTERISTICA'), createTipo_c);
router.get("/api/tipo_caracteristica/getTipo_c",validarTokenConPermisos, validarPermiso('consulta', 'CARACTERISTICA'), getTipo_c);
router.put("/api/tipo_caracteristica/updateTipo_c", validarTokenConPermisos, validarPermiso('actualizacion', 'CARACTERISTICA'),updateTipo_c);
router.delete("/api/tipo_caracteristica/deleteTipo_c",validarTokenConPermisos, validarPermiso('eliminacion', 'CARACTERISTICA'), deleteTipo_c);


export default router;