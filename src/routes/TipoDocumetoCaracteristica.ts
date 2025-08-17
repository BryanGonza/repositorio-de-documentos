import { Router } from "express";
import {getDocumentoCaracteristicaCompleta, insertDocumentoCaracteristica, eliminarDocumentoCaracteristica, updateValorPredeterminado, getCaracteristicasPorTipoDocumento, getCaracteristicasPorTipoDocumentoSP, getDetalleCaracteristicasDocumento, updateTipoDocCaracteristica } from "../controllers/Documetos/TipoDocumentoCaracteristica";
import validarTokenConPermisos from "./validartoken";
import { validarPermiso } from "./validarPermiso";

const router = Router();

router.post("/api/tipo_doc_caracteristica/createTipo_doc_cara", insertDocumentoCaracteristica);
router.delete("/api/tipo_doc_caracteristica/eliminar_doc_cara", eliminarDocumentoCaracteristica);
router.put("/api/tipo_doc_caracteristica/upd_doc_cara", updateTipoDocCaracteristica);
router.get("/api/tipo_doc_caracteristica/get_doc_cara", getDocumentoCaracteristicaCompleta);
router.get("/api/tipo_doc_caracteristica/get_Tipo/:id_tipo_documento", getCaracteristicasPorTipoDocumentoSP);
router.get('/api/detalle-caracteristicas/:id_documento', getDetalleCaracteristicasDocumento);

export default router;