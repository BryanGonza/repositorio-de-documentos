import { Router } from "express";
import { createEstado, getEstado, updateEstado, deleteEstado} from "../controllers/estado";
import { validarPermiso } from "./validarPermiso";
import validarTokenConPermisos from "./validartoken";

const router = Router();

router.post("/api/estado/createEstado",  validarTokenConPermisos, validarPermiso('insercion', 'ESTADO'), createEstado);
router.get("/api/estado/getEstado", validarTokenConPermisos, validarPermiso('consulta', 'ESTADO'), getEstado);
router.put("/api/estado/updateEstado", validarTokenConPermisos, validarPermiso('actualizacion', 'ESTADO'), updateEstado);
router.delete("/api/estado/deleteEstado",validarTokenConPermisos, validarPermiso('eliminacion', 'ESTADO'), deleteEstado);


export default router;