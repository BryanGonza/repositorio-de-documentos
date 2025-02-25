import { Router } from "express";
import {
  registrerUser,
  login,
  getUsuarios,
  deleteUsuario,
  updateUsuario,
  getUsuarioEmail,
  requestPasswordReset,
  resetPassword

} from "../controllers/ms_usuarios";

import validarToken from "../routes/validartoken";

const router = Router();

router.post("/api/ms_usuarios/register", registrerUser);
router.post("/api/ms_usuarios/login", login);
router.get("/api/ms_usuarios/getUsuarios", getUsuarios);
router.delete("/api/ms_usuarios/deleteUsuario", deleteUsuario);
router.put("/api/ms_usuarios/updateUsuario", updateUsuario);
router.post("/api/ms_usuarios/getUsuarioEmail", getUsuarioEmail);


// Rutas para recuperación de contraseña
router.post("/api/ms_usuarios/request-password-reset", requestPasswordReset);
router.post("/api/ms_usuarios/reset-password", resetPassword);



export default router;
