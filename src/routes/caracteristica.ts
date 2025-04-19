import { Router } from "express";
import { createCaracteristica, getCaracteristica, updateCaracteristica, deleteCaracteristica } from "../controllers/Documetos/caracteristica";

const router = Router();

router.post("/api/caracteristica/createCaracteristica", createCaracteristica);
router.get("/api/caracteristica/getCaracteristica", getCaracteristica);
router.put("/api/caracteristica/updateCaracteristica", updateCaracteristica);
router.delete("/api/caracteristica/deleteCaracteristica", deleteCaracteristica);


export default router;