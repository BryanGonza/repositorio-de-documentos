import { Router } from "express";
import { createTipo_d, getTipo_d, updateTipo_d, deleteTipo_d } from "../controllers/Documetos/tipo_documento";

const router = Router();

router.post("/api/tipo_documento/createTipo_d", createTipo_d);
router.get("/api/tipo_documento/getTipo_d", getTipo_d);
router.put("/api/tipo_documento/updateTipo_d", updateTipo_d);
router.delete("/api/tipo_documento/deleteTipo_d", deleteTipo_d);


export default router;