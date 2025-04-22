import { Router } from "express";
import { createCategoria, getCategoria, updateCategoria, deleteCategoria } from "../controllers/Documetos/categoria";
import { validarPermiso } from "./validarPermiso";
import validarTokenConPermisos from "./validartoken";

const router = Router();

router.post("/api/categoria/createCategoria", createCategoria);
router.get("/api/categoria/getCategoria", getCategoria);
router.put("/api/categoria/updateCategoria", updateCategoria);
router.delete("/api/categoria/deleteCategoria", deleteCategoria);


export default router;