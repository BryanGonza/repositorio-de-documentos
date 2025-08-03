// src/controllers/reporteDocumentos.ts
import { Request, Response } from "express";
import sequelize from "../database/conexion";

export const getReporteDocumentos = async (req: Request, res: Response) => {
  const { fecha_inicio, fecha_fin, usuario, accion, nombre_documento } = req.query;

  try {
    const reporte: any = await sequelize.query(
      `CALL obtener_reporte_documentos(:p_fecha_inicio, :p_fecha_fin, :p_usuario, :p_accion, :p_nombre_documento);`,
      {
        replacements: {
          p_fecha_inicio: fecha_inicio || null,
          p_fecha_fin: fecha_fin || null,
          p_usuario: usuario || null,
          p_accion: accion || null,
          p_nombre_documento: nombre_documento || null
        }
      }
    );

    // Asegurar que siempre sea un array
    const data = Array.isArray(reporte) ? reporte : [reporte];

    res.json({
      msg: "Reporte de documentos obtenido correctamente.",
      reporte: data
    });
  } catch (error) {
    console.error("Error al obtener reporte de documentos:", error);
    res.status(500).json({
      msg: "Error al obtener reporte de documentos.",
      error
    });
  }
};