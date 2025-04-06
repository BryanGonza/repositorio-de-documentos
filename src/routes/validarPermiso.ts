import { Request, Response, NextFunction } from "express";

export const validarPermiso = (accion: 'insercion' | 'eliminacion' | 'actualizacion' | 'consulta') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.user || !req.body.user.permisos) {
      return res.status(403).json({ msg: "No se han cargado permisos de usuario" });
    }

    let permisoKey = "";
    switch (accion) {
      case 'insercion':
        permisoKey = "PERMISO_INSERCION";
        break;
      case 'eliminacion':
        permisoKey = "PERMISO_ELIMINACION";
        break;
      case 'actualizacion':
        permisoKey = "PERMISO_ACTUALIZACION";
        break;
      case 'consulta':
        permisoKey = "PERMISO_CONSULTAR";
        break;
    }

    // Si en tu BD guardas "SI" / "si" cuando hay permiso, ajusta la comparación:
    const valorPermiso = req.body.user.permisos[permisoKey];
    // Verificamos de forma case-insensitive que sea "si".
    if (!valorPermiso || valorPermiso.toLowerCase() !== "si") {
      return res.status(403).json({ msg: `No tiene permiso para ${accion}` });
    }

    next();
  };
};
