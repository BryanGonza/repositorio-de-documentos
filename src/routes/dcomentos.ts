import { Router } from "express";
// import  { SubirDoc} from "../controllers/documentos";
import { cargas} from "../middlewares/documetos.midd";
import { SubirDoc } from "../controllers/documentos";

const router = Router();
router.post("/api/Documentos/subirDc",cargas, SubirDoc);

export default router;