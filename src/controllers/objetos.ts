import { Request, Response } from "express";
import sequelize from "../database/conexion"; // Asegúrate de que esta ruta sea correcta

// Crear un objeto usando procedimiento almacenado
export const createObjetos = async (req: Request, res: Response) => {
  const { OBJETO, TIPO_OBJETO, DESCRIPCION, CREADO_POR } = req.body;

  try {
    await sequelize.query(
      `CALL crear_objeto(:OBJETO, :TIPO_OBJETO, :DESCRIPCION, :CREADO_POR);`,
      {
        replacements: {
          OBJETO,
          TIPO_OBJETO,
          DESCRIPCION,
          CREADO_POR,
        },
      }
    );

    res.json({
      msg: "Objeto creado correctamente",
    });
  } catch (error) {
    console.error("Error al crear Objeto:", error);
    res.status(500).json({
      msg: "Error al crear Objeto",
      error,
    });
  }
};

// Obtener todos los objetos usando procedimiento almacenado
export const getObjetos = async (req: Request, res: Response) => {
  try {
    const Lista_Objetos: any = await sequelize.query(`CALL obtener_objetos();`);
    res.json({ Lista_Objetos });
  } catch (error) {
    console.error("Error al obtener objetos:", error);
    res.status(500).json({
      msg: "Error al obtener objetos",
      error,
    });
  }
};

// Actualizar un objeto usando procedimiento almacenado
export const updateObjetos = async (req: Request, res: Response) => {
  const { ID_OBJETO, OBJETO, TIPO_OBJETO, DESCRIPCION, MODIFICADO_POR } = req.body;

  try {
    await sequelize.query(
      `CALL actualizar_objeto(:ID_OBJETO, :OBJETO, :TIPO_OBJETO, :DESCRIPCION, :MODIFICADO_POR);`,
      {
        replacements: {
          ID_OBJETO,
          OBJETO,
          TIPO_OBJETO,
          DESCRIPCION,
          MODIFICADO_POR,
        },
      }
    );

    res.status(200).json({
      msg: `Objeto con ID ${ID_OBJETO} actualizado correctamente.`,
    });
  } catch (error) {
    console.error("Error al actualizar el objeto:", error);
    res.status(500).json({
      msg: "Error al actualizar el objeto.",
      error,
    });
  }
};

// Eliminar un objeto usando procedimiento almacenado
export const deleteObjetos = async (req: Request, res: Response) => {
  const { ID_OBJETO } = req.body;

  try {
    await sequelize.query(`CALL eliminar_objeto(:ID_OBJETO);`, {
      replacements: { ID_OBJETO },
    });

    res.json({
      msg: `Objeto con ID ${ID_OBJETO} eliminado exitosamente.`,
    });
  } catch (error) {
    console.error("Error al eliminar el Objeto:", error);
    res.status(500).json({
      msg: "Error al eliminar el objeto.",
      error,
    });
  }
};

// Función auxiliar para permisos
function parsePerm(val: any): boolean {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val.trim().toLowerCase() === "si";
  return false;
}

// Obtener objetos con permisos (no cambia porque combina permisos con la data)
export const getObjetosConPermisos = async (req: Request, res: Response) => {
  try {
    const userPermisos = req.body.user.permisos as {
      ID_OBJETO: number;
      PERMISO_CONSULTAR: string;
      PERMISO_INSERCION: string;
      PERMISO_ACTUALIZACION: string;
      PERMISO_ELIMINACION: string;
    }[];

    console.log("Usuario y permisos:", req.body.user);

    // Llamamos al procedimiento para obtener todos los objetos
    const objetosDB: any[] = await sequelize.query(`CALL obtener_objetos();`);

    const objetosConPermiso = objetosDB.map((obj: any) => {
      const permisoUsuario = userPermisos.find(p => p.ID_OBJETO === obj.ID_OBJETO);

      return {
        ...obj,
        PERMISO_CONSULTAR:     parsePerm(permisoUsuario?.PERMISO_CONSULTAR),
        PERMISO_INSERCION:     parsePerm(permisoUsuario?.PERMISO_INSERCION),
        PERMISO_ACTUALIZACION: parsePerm(permisoUsuario?.PERMISO_ACTUALIZACION),
        PERMISO_ELIMINACION:   parsePerm(permisoUsuario?.PERMISO_ELIMINACION),
      };
    });

    return res.json(objetosConPermiso);
  } catch (error) {
    console.error("Error en getObjetosConPermisos:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
