import { Router } from "express";
import { createVersion, getVersion, updateVersion, deleteVersion } from "../controllers/Documetos/version";
import validarTokenConPermisos from "./validartoken";
import { validarPermiso } from "./validarPermiso";

const router = Router();

router.post("/api/version/createVersion", validarTokenConPermisos, validarPermiso('insercion', 'VERSION'),createVersion);
router.get("/api/version/getVersion", validarTokenConPermisos, validarPermiso('consulta', 'VERSION'), getVersion);
router.put("/api/version/updateVersion", validarTokenConPermisos, validarPermiso('actualizacion', 'VERSION'), updateVersion);
router.delete("/api/version/deleteVersion", validarTokenConPermisos, validarPermiso('eliminacion', 'VERSION'), deleteVersion);

export default router;