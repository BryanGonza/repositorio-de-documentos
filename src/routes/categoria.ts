import { Router } from "express";
import { createCategoria, getCategoria, updateCategoria, deleteCategoria } from "../controllers/Documetos/categoria";
import { validarPermiso } from "./validarPermiso";
import validarTokenConPermisos from "./validartoken";

const router = Router();

router.post("/api/categoria/createCategoria", validarTokenConPermisos, validarPermiso('insercion', 'MANTENIMIENTO CATEGORIA') createCategoria);
router.get("/api/categoria/getCategoria",  validarTokenConPermisos, validarPermiso('consulta', 'MANTENIMIENTO CATEGORIA'), getCategoria);
router.put("/api/categoria/updateCategoria", validarTokenConPermisos, validarPermiso('actualizacion', 'MANTENIMIENTO CATEGORIA'), updateCategoria);
router.delete("/api/categoria/deleteCategoria", validarTokenConPermisos, validarPermiso('eliminacion', 'MANTENIMIENTO CATEGORIA'), deleteCategoria);


export default router;