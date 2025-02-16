import { Router } from "express";
import {
  CrearParametro,
  deleteParametro,
  getParametros,
  updateParametros,
} from "../controllers/parametros";

// import validarToken from "../routes/validartoken";

const router = Router();

router.post("/api/parametros/CrearParametro", CrearParametro);
router.get("/api/parametros/getParametros", getParametros);
router.delete("/api/parametros/deleteParametro", deleteParametro);
router.put("/api/parametros/updateParametros", updateParametros);

export default router;
