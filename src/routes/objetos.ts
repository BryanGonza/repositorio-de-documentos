import { Router } from "express";
import { createObjetos, getObjetos, updateObjetos, deleteObjetos, getObjetosConPermisos } from "../controllers/objetos";
import validarTokenConPermisos from "./validartoken";
import { validarPermiso } from "./validarPermiso";

const router = Router();

router.post("/api/objetos/createObjetos", validarTokenConPermisos, validarPermiso('insercion', 'OBJETO'), createObjetos);
router.get("/api/objetos/getObjetos", validarTokenConPermisos, validarPermiso('consulta', 'OBJETO'), getObjetos);
router.put("/api/objetos/updateObjetos", validarTokenConPermisos, validarPermiso('actualizacion', 'OBJETO'), updateObjetos);
router.delete("/api/objetos/deleteObjetos", validarTokenConPermisos, validarPermiso('eliminacion', 'OBJETO'), deleteObjetos);
router.get("/api/objetos/objetosPermisos", validarTokenConPermisos, getObjetosConPermisos);


export default router;