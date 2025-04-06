import { Router } from "express";
import { createObjetos, getObjetos, updateObjetos, deleteObjetos, getObjetosConPermisos } from "../controllers/objetos";
import validarTokenConPermisos from "./validartoken";

const router = Router();

router.post("/api/objetos/createObjetos", createObjetos);
router.get("/api/objetos/getObjetos", getObjetos);
router.put("/api/objetos/updateObjetos", updateObjetos);
router.delete("/api/objetos/deleteObjetos", deleteObjetos);
router.get("/api/roles/objetosPermisos", validarTokenConPermisos, getObjetosConPermisos);

export default router;