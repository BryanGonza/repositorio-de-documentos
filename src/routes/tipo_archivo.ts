import { Router } from "express";
import { createTipo_archivo, getTipo_archivo, updateTipo_archivo, deleteTipo_archivo } from "../controllers/Documetos/tipo_archivo";

const router = Router();

router.post("/api/tipo_archivo/createTipo_archivo", createTipo_archivo);
router.get("/api/tipo_archivo/getTipo_archivo", getTipo_archivo);
router.put("/api/tipo_archivo/updateTipo_archivo", updateTipo_archivo);
router.delete("/api/tipo_archivo/deleteTipo_archivo", deleteTipo_archivo);


export default router;