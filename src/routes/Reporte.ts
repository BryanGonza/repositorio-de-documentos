import { Router } from "express";
import { getReporteDocumentos } from "../controllers/Reporte";
import validarTokenConPermisos from "./validartoken";
import { validarPermiso } from "./validarPermiso";

const router = Router();


router.get( "/api/reporte/documentos", getReporteDocumentos);

export default router;