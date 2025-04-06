// middlewares/validarTokenConPermisos.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { permisos } from "../models/permisos"; // Importa tu modelo de permisos

export const validarTokenConPermisos = async (req: Request, res: Response, next: NextFunction) => {
  const headersToken = req.headers["authorization"];
  if (!headersToken || !headersToken.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Acceso denegado" });
  }

  try {
    const token = headersToken.slice(7);
    const decoded = jwt.verify(token, process.env.Secret_key || "Repositorio_Docuemntos") as JwtPayload;

    if (!decoded.rol) {
      return res.status(401).json({ msg: "Token no contiene 'rol'" });
    }

    // Consulta en BD los permisos asociados al rol
    const permisoData = await permisos.findOne({ where: { ID_ROL: decoded.rol } });
    if (!permisoData) {
      return res.status(403).json({ msg: "No se encontraron permisos para el rol" });
    }

    // Adjunta la información de usuario y permisos en la request.
    req.body.user = {
      rol: decoded.rol,
      permisos: permisoData.dataValues  // Ej: { PERMISO_INSERCION: 'SI', PERMISO_ELIMINACION: 'NO', ... }
    };

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido" });
  }
};

export default validarTokenConPermisos;
