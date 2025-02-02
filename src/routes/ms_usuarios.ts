import { Router } from "express";
import { registrerUser, login, getUsuarios, deleteUsuario, updateUsuario, getUsuarioEmail } from "../controllers/ms_usuarios";

import validarToken from "../routes/validartoken";

const router = Router();

router.post("/api/ms_usuarios/register", registrerUser)
router.post("/api/ms_usuarios/login", login)
router.get("/api/ms_usuarios/getUsuarios", validarToken, getUsuarios)
router.delete("/api/ms_usuarios/deleteUsuario", deleteUsuario)
router.put("/api/ms_usuarios/updateUsuario", updateUsuario)
router.get("/api/ms_usuarios/getUsuarioEmail", getUsuarioEmail)








export default router
