import { Router } from "express";
import { createPermiso, getPermisos, updatePermiso, deletePermiso } from "../controllers/permisos";

const router = Router();

router.post("/api/permisos/createPermiso", createPermiso);
router.get("/api/permisos/getPermisos", getPermisos);
router.put("/api/permisos/updatePermiso", updatePermiso);
router.delete("/api/permisos/deletePermiso", deletePermiso);


export default router;
