import { Router } from "express";
import { createRol, getRoles, updateRoles, deleteroles } from "../controllers/roles";
import { getObjetosConPermisos } from "../controllers/objetos";
import { validarPermiso } from "./validarPermiso";
import validarTokenConPermisos from "./validartoken";

const router = Router();

router.post("/api/roles/createRol", validarTokenConPermisos, validarPermiso('insercion', 'ROL'), createRol);
router.get("/api/roles/getRoles", validarTokenConPermisos, validarPermiso('consulta', 'ROL'), getRoles);
router.put("/api/roles/updateRoles", validarTokenConPermisos, validarPermiso('actualizacion', 'ROL'), updateRoles);
router.delete("/api/roles/deleteRoles", validarTokenConPermisos, validarPermiso('eliminacion', 'ROL'), deleteroles);


export default router;