import { Router } from "express";
// import  { SubirDoc} from "../controllers/documentos";
import { cargas} from "../middlewares/documetos.midd";
import { actualizarDocumentoDD, EliminarDoc, getCorreoUsuario, getDocumentoDetalle, getDocumentosPorUsuario, getDocumetos, SubirDoc } from "../controllers/Documetos/documentos";
import { validarPermiso } from "./validarPermiso";
import  { validarTokenConPermisos } from "../routes/validartoken";
const router = Router();

router.post("/api/Documentos/subirDc",cargas, SubirDoc);

router.get("/api/Documentos/MostrarDocuemtos",  validarTokenConPermisos, validarPermiso('consulta', 'DOCUMENTO'), getDocumetos)
router.delete("/api/Documentos/EliminarDocumento/:idDocumento", validarTokenConPermisos, validarPermiso('eliminacion', 'DOCUMENTO') EliminarDoc);
router.get("/api/Documentos/correo/:idUsuario", validarTokenConPermisos, getCorreoUsuario);
router.get("/api/Documentos/DocUser/:idUsuario", getDocumentosPorUsuario);
router.put("/api/Documentos/Actualizar",  actualizarDocumentoDD);
router.get("/api/Documentos/getDocumentoDetalle/:id", getDocumentoDetalle);

export default router;