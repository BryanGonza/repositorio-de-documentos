import { Router } from "express";
import { createObjetos, getObjetos, updateObjetos, deleteObjetos } from "../controllers/objetos";

const router = Router();

router.post("/api/objetos/createObjetos", createObjetos);
router.get("/api/objetos/getObjetos", getObjetos);
router.put("/api/objetos/updateObjetos", updateObjetos);
router.delete("/api/objetos/deleteObjetos", deleteObjetos);


export default router;