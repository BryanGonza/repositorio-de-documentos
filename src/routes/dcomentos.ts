import { Router } from "express";
// import  { SubirDoc} from "../controllers/documentos";
import { cargas} from "../middlewares/documetos.midd";
import { EliminarDoc, getCorreoUsuario, getDocumentosPorUsuario, getDocumetos, SubirDoc } from "../controllers/Documetos/documentos";

const router = Router();
router.post("/api/Documentos/subirDc",cargas, SubirDoc);
router.get("/api/Documentos/MostrarDocuemtos", getDocumetos)
router.delete("/api/Documentos/EliminarDocumento/:idDocumento", EliminarDoc);
router.get("/api/Documentos/correo/:idUsuario", getCorreoUsuario);
router.get("/api/Documentos/DocUser/:idUsuario", getDocumentosPorUsuario);

export default router;