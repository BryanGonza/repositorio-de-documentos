import { Router } from "express";
import { createDep, getDep, updateDep, deleteDep } from "../controllers/UNAH/departamentos";
import { validarPermiso } from "./validarPermiso";
import validarTokenConPermisos from "./validartoken";

const router = Router();

router.post("/api/departamentos/createDep", validarTokenConPermisos, validarPermiso('insercion', 'departamento'), createDep);
router.get("/api/departamentos/getDep", validarTokenConPermisos, validarPermiso('consulta', 'departamento'), getDep);
router.put("/api/departamentos/updateDep", validarTokenConPermisos, validarPermiso('actualizacion', 'departamento'), updateDep);
router.delete("/api/departamentos/deleteDep", validarTokenConPermisos, validarPermiso('eliminacion', 'departamento'), deleteDep);


export default router;