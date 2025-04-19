"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarPermiso = void 0;
const validarPermiso = (accion, objeto) => {
    return (req, res, next) => {
        if (!req.body.user || !Array.isArray(req.body.user.permisos)) {
            return res.status(403).json({ msg: "No se han cargado permisos del usuario." });
        }
        const permisoKey = {
            insercion: "PERMISO_INSERCION",
            eliminacion: "PERMISO_ELIMINACION",
            actualizacion: "PERMISO_ACTUALIZACION",
            consulta: "PERMISO_CONSULTAR"
        }[accion];
        const permisos = req.body.user.permisos;
        // Buscamos por inclusión, no por igualdad exacta
        const permisoObjeto = permisos.find(p => p.OBJETO.trim().toLowerCase().includes(objeto.trim().toLowerCase()));
        const valorPermiso = permisoObjeto === null || permisoObjeto === void 0 ? void 0 : permisoObjeto[permisoKey];
        if (!valorPermiso || valorPermiso.toLowerCase() !== "si") {
            return res
                .status(403)
                .json({ msg: `No tiene permiso de ${accion} en ${objeto}` });
        }
        next();
    };
};
exports.validarPermiso = validarPermiso;
