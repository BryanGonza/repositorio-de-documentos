import { Router } from "express";
import { createRol, getRoles, updateRoles, deleteroles } from "../controllers/Roles";
import { getObjetosConPermisos } from "../controllers/objetos";

const router = Router();

router.post("/api/roles/createRol", createRol);
router.get("/api/roles/getRoles", getRoles);
router.put("/api/roles/updateRoles", updateRoles);
router.delete("/api/roles/deleteRoles", deleteroles);



export default router;