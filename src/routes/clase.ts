import { Router } from "express";
import { createClase, getClase, updateClase, deleteClase } from "../controllers/UNAH/clase";

const router = Router();

router.post("/api/clase/createClase", createClase);
router.get("/api/clase/getClase", getClase);
router.put("/api/clase/updateClase", updateClase);
router.delete("/api/clase/deleteClase", deleteClase);


export default router;