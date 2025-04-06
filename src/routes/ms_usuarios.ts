import { Router } from "express";
import {
  registrerUser,
  login,
  getUsuarios,
  deleteUsuario,
  updateUsuario,
  getUsuarioEmail,
  requestPasswordReset,
  resetPassword,
  cambiarContrasena

} from "../controllers/ms_usuarios";

import validarToken, { validarTokenConPermisos } from "../routes/validartoken";
import { validarPermiso } from "./validarPermiso";

const router = Router();

router.post("/api/ms_usuarios/register", validarTokenConPermisos, validarPermiso('insercion'), registrerUser);
router.post("/api/ms_usuarios/login", login);
router.get("/api/ms_usuarios/getUsuarios", validarTokenConPermisos, getUsuarios);
router.delete("/api/ms_usuarios/deleteUsuario", validarTokenConPermisos, validarPermiso('eliminacion'), deleteUsuario);
router.put("/api/ms_usuarios/updateUsuario", validarTokenConPermisos, validarPermiso('actualizacion'), updateUsuario);
router.post("/api/ms_usuarios/getUsuarioEmail", getUsuarioEmail);
router.post("/api/ms_usuarios/cambioContrasena", cambiarContrasena);


// Rutas para recuperación de contraseña
router.post("/api/ms_usuarios/request-password-reset", requestPasswordReset);
router.post("/api/ms_usuarios/reset-password", resetPassword);



export default router;
