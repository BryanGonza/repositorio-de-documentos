import { Request, Response, NextFunction } from "express";

export const validarPermiso = (
  accion: 'insercion' | 'eliminacion' | 'actualizacion' | 'consulta',
  objeto: string
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.user || !Array.isArray(req.body.user.permisos)) {
      return res.status(403).json({ msg: "No se han cargado permisos del usuario." });
    }

    const permisoKey = {
      insercion:    "PERMISO_INSERCION",
      eliminacion:  "PERMISO_ELIMINACION",
      actualizacion:"PERMISO_ACTUALIZACION",
      consulta:     "PERMISO_CONSULTAR"
    }[accion];

    interface PermisoPorObjeto {
      OBJETO: string;
      [key: string]: any;
    }

    const permisos = req.body.user.permisos as PermisoPorObjeto[];

    // Buscamos por inclusión, no por igualdad exacta
    const permisoObjeto = permisos.find(p =>
      p.OBJETO.trim().toLowerCase().includes(objeto.trim().toLowerCase())
    );

    const valorPermiso = permisoObjeto?.[permisoKey];

    if (!valorPermiso || valorPermiso.toLowerCase() !== "si") {
      return res
        .status(403)
        .json({ msg: `No tiene permiso de ${accion} en ${objeto}` });
    }

    next();
  };
};
