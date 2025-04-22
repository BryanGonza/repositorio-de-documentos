import { Router } from "express";
import { createCategoria, getCategoria, updateCategoria, deleteCategoria } from "../controllers/Documetos/categoria";
import { validarPermiso } from "./validarPermiso";
import validarTokenConPermisos from "./validartoken";

const router = Router();

router.post("/api/categoria/createCategoria", createCategoria);
router.get("/api/categoria/getCategoria", validarTokenConPermisos, validarPermiso('consulta', 'CATEGORIA'), getCategoria);
router.put("/api/categoria/updateCategoria", validarTokenConPermisos, validarPermiso('actualizacion', 'CATEGORIA'), updateCategoria);
router.delete("/api/categoria/deleteCategoria", validarTokenConPermisos, validarPermiso('eliminacion', 'CATEGORIA'), deleteCategoria);


export default router;