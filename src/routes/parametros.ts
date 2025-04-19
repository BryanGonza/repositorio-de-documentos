import { Router } from "express";
import {
  CrearParametro,
  deleteParametro,
  getParametros,
  updateParametros,
} from "../controllers/parametros";
import validarTokenConPermisos from "./validartoken";
import { validarPermiso } from "./validarPermiso";

// import validarToken from "../routes/validartoken";

const router = Router();

router.post("/api/parametros/CrearParametro", validarTokenConPermisos, validarPermiso('insercion', 'PARAMETRO'), CrearParametro);
router.get("/api/parametros/getParametros", validarTokenConPermisos, validarPermiso('consulta', 'PARAMETRO'), getParametros);
router.delete("/api/parametros/deleteParametro", validarTokenConPermisos, validarPermiso('eliminacion', 'PARAMETRO'), deleteParametro);
router.put("/api/parametros/updateParametros", validarTokenConPermisos, validarPermiso('actualizacion', 'PARAMETRO'), updateParametros);


export default router;
