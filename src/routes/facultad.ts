import { Router } from "express";
import { createFacultad, getFacultad, updateFacultad, deleteFacultad } from "../controllers/UNAH/facultad";

const router = Router();

router.post("/api/facultad/createFacultad", createFacultad);
router.get("/api/facultad/getFacultad", getFacultad);
router.put("/api/facultad/updateFacultad", updateFacultad);
router.delete("/api/facultad/deleteFacultad", deleteFacultad);


export default router;