"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReporteDocumentos = void 0;
const conexion_1 = __importDefault(require("../database/conexion"));
const getReporteDocumentos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha_inicio, fecha_fin, usuario, accion, nombre_documento } = req.query;
    try {
        const reporte = yield conexion_1.default.query(`CALL obtener_reporte_documentos(:p_fecha_inicio, :p_fecha_fin, :p_usuario, :p_accion, :p_nombre_documento);`, {
            replacements: {
                p_fecha_inicio: fecha_inicio || null,
                p_fecha_fin: fecha_fin || null,
                p_usuario: usuario || null,
                p_accion: accion || null,
                p_nombre_documento: nombre_documento || null
            }
        });
        // Asegurar que siempre sea un array
        const data = Array.isArray(reporte) ? reporte : [reporte];
        res.json({
            msg: "Reporte de documentos obtenido correctamente.",
            reporte: data
        });
    }
    catch (error) {
        console.error("Error al obtener reporte de documentos:", error);
        res.status(500).json({
            msg: "Error al obtener reporte de documentos.",
            error
        });
    }
});
exports.getReporteDocumentos = getReporteDocumentos;
