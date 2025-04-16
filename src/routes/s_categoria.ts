import { Router } from "express";
import { createS_categoria, getS_categoria, updateS_categoria, deleteS_categoria } from "../controllers/Documetos/s_categoria";

const router = Router();

router.post("/api/s_categoria/createS_categoria", createS_categoria);
router.get("/api/s_categoria/getS_categoria", getS_categoria);
router.put("/api/s_categoria/updateS_categoria", updateS_categoria);
router.delete("/api/s_categoria/deleteS_categoria", deleteS_categoria);


export default router;