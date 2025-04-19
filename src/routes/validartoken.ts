import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { permisos } from "../models/permisos";
import { ms_objetos } from "../models/objetos"; // Asegurate de no renombrarlo

export const validarTokenConPermisos = async (req: Request, res: Response, next: NextFunction) => {
  const headersToken = req.headers["authorization"];
  if (!headersToken || !headersToken.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Acceso denegado, falta JWT" });
  }

  try {
    const token = headersToken.slice(7);
    const decoded = jwt.verify(token, process.env.Secret_key || "Repositorio_Docuemntos") as JwtPayload;

    if (!decoded.rol) {
      return res.status(401).json({ msg: "Token no contiene 'rol'" });
    }

    // Usar el alias 'objeto' definido en permisos.belongsTo
    const permisoData = await permisos.findAll({
      where: { ID_ROL: decoded.rol },
      include: [{
        model: ms_objetos,
        as: 'objeto',  // DEBE coincidir con el alias definido en permisos.belongsTo
        attributes: ['OBJETO']
      }]
    });

    if (!permisoData || permisoData.length === 0) {
      return res.status(403).json({ msg: "No se encontraron permisos para el rol" });
    }

    interface PermisoExtendido {
      ID_OBJETO: number;
      PERMISO_INSERCION: string;
      PERMISO_ELIMINACION: string;
      PERMISO_ACTUALIZACION: string;
      PERMISO_CONSULTAR: string;
      objeto?: { OBJETO: string };
    }
    
    const permisosFormateados = permisoData.map((p: PermisoExtendido) => ({
      ID_OBJETO:         p.ID_OBJETO,                 // <— ¡AQUÍ!
      OBJETO:            p.objeto?.OBJETO  || "",
      PERMISO_INSERCION: p.PERMISO_INSERCION,
      PERMISO_ELIMINACION: p.PERMISO_ELIMINACION,
      PERMISO_ACTUALIZACION: p.PERMISO_ACTUALIZACION,
      PERMISO_CONSULTAR: p.PERMISO_CONSULTAR
    }));

    // Adjunta la información de usuario y permisos en la request.
    req.body.user = {
      rol: decoded.rol,
      permisos: permisosFormateados
    };

    next();
  } catch (error) {
    console.error("Error en validarTokenConPermisos:", error);
    return res.status(401).json({ msg: "Token inválido o vencido" });
  }
};

export default validarTokenConPermisos;
