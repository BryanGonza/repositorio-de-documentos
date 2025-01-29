import { Router } from "express";
import { login, registrerUser, getUsuarios } from "../controllers/ms_usuarios";
import validarToken from "../routes/validartoken";

const router = Router();

router.post("/api/ms_usuarios/register", registrerUser)
router.post("/api/ms_usuarios/login", login)
router.get("/api/ms_usuarios/getUsuarios", validarToken, getUsuarios)

export default router
