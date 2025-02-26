import { Router } from "express";
import { createEstado, getEstado, updateEstado, deleteEstado} from "../controllers/estado";

const router = Router();

router.post("/api/estado/createEstado", createEstado);
router.get("/api/estado/getEstado", getEstado);
router.put("/api/estado/updateEstado", updateEstado);
router.delete("/api/estado/deleteEstado", deleteEstado);


export default router;