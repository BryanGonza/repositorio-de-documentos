import { Router } from "express";
import { createDep, getDep, updateDep, deleteDep } from "../controllers/UNAH/departamentos";

const router = Router();

router.post("/api/departamentos/createDep", createDep);
router.get("/api/departamentos/getDep", getDep);
router.put("/api/departamentos/updateDep", updateDep);
router.delete("/api/departamentos/deleteDep", deleteDep);


export default router;