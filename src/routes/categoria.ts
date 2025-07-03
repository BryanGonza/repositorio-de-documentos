import { Router } from "express";
import { createCategoria, getCategoria, updateCategoria, deleteCategoria } from "../controllers/Documetos/categoria";
import { validarPermiso } from "./validarPermiso";
import validarTokenConPermisos from "./validartoken";

const router = Router();

router.post("/api/categoria/createCategoria", validarTokenConPermisos, createCategoria);
router.get("/api/categoria/getCategoria",  validarTokenConPermisos, getCategoria);
router.put("/api/categoria/updateCategoria", validarTokenConPermisos, updateCategoria);
router.delete("/api/categoria/deleteCategoria", validarTokenConPermisos,  deleteCategoria);


export default router;