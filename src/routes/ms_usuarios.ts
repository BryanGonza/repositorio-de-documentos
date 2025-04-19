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
  cambiarContrasena,
  cambiarConperfil

} from "../controllers/ms_usuarios";

import validarToken, { validarTokenConPermisos } from "../routes/validartoken";
import { validarPermiso } from "./validarPermiso";

const router = Router();
router.post("/api/ms_usuarios/login", login);
router.post("/api/ms_usuarios/register", validarTokenConPermisos, validarPermiso('insercion', 'USUARIO'), registrerUser);
router.get("/api/ms_usuarios/getUsuarios", validarTokenConPermisos validarPermiso('consulta', 'USUARIO'), getUsuarios);
router.delete("/api/ms_usuarios/deleteUsuario", validarTokenConPermisos, validarPermiso('eliminacion', 'USUARIO'), deleteUsuario);
router.put("/api/ms_usuarios/updateUsuario", validarTokenConPermisos, validarPermiso('actualizacion', 'USUARIO'), updateUsuario);
router.post("/api/ms_usuarios/getUsuarioEmail", getUsuarioEmail);
router.post("/api/ms_usuarios/cambioContrasena", cambiarContrasena);
router.post("/api/ms_usuarios/cambiarConperfil", cambiarConperfil);


// Rutas para recuperación de contraseña
router.post("/api/ms_usuarios/request-password-reset", requestPasswordReset);
router.post("/api/ms_usuarios/reset-password", resetPassword);



export default router;
