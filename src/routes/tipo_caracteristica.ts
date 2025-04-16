import { Router } from "express";
import { createTipo_c, getTipo_c, updateTipo_c, deleteTipo_c } from "../controllers/Documetos/tipo_caracteristica";

const router = Router();

router.post("/api/tipo_caracteristica/createTipo_c", createTipo_c);
router.get("/api/tipo_caracteristica/getTipo_c", getTipo_c);
router.put("/api/tipo_caracteristica/updateTipo_c", updateTipo_c);
router.delete("/api/tipo_caracteristica/deleteTipo_c", deleteTipo_c);


export default router;