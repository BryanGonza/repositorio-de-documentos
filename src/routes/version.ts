import { Router } from "express";
import { createVersion, getVersion, updateVersion, deleteVersion } from "../controllers/Documetos/version";

const router = Router();

router.post("/api/version/createVersion", createVersion);
router.get("/api/version/getVersion", getVersion);
router.put("/api/version/updateVersion", updateVersion);
router.delete("/api/version/deleteVersion", deleteVersion);


export default router;