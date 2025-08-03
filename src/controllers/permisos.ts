import { Request, Response } from "express";
import sequelize from "../database/conexion"; // Ajusta la ruta según tu proyecto

// Insertar un permiso usando procedimiento almacenado
export const createPermiso = async (req: Request, res: Response) => {
  const { ID_ROL, ID_OBJETO, PERMISO_INSERCION, PERMISO_ELIMINACION, PERMISO_ACTUALIZACION, PERMISO_CONSULTAR, CREADO_POR } = req.body;

  try {
    await sequelize.query(
      `CALL crear_permiso(:ID_ROL, :PERMISO_INSERCION, :PERMISO_ELIMINACION, :PERMISO_ACTUALIZACION, :PERMISO_CONSULTAR, :CREADO_POR, :ID_OBJETO);`,
      {
        replacements: {
          ID_ROL,
          PERMISO_INSERCION: PERMISO_INSERCION.toUpperCase(),
          PERMISO_ELIMINACION: PERMISO_ELIMINACION.toUpperCase(),
          PERMISO_ACTUALIZACION: PERMISO_ACTUALIZACION.toUpperCase(),
          PERMISO_CONSULTAR: PERMISO_CONSULTAR.toUpperCase(),
          CREADO_POR,
          ID_OBJETO,
        },
      }
    );

    res.json({ msg: "Permiso creado correctamente" });
  } catch (error) {
    console.error("Error al crear permiso:", error);
    res.status(500).json({ msg: "Error al crear permiso", error });
  }
};

// Obtener todos los permisos usando procedimiento almacenado
export const getPermisos = async (req: Request, res: Response) => {
  try {
    const ListPermisos: any = await sequelize.query(`CALL obtener_permisos();`);
    res.json({ ListPermisos });
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    res.status(500).json({ msg: "Error al obtener permisos", error });
  }
};

// Actualizar un permiso usando procedimiento almacenado
export const updatePermiso = async (req: Request, res: Response) => {
  const { ID_PERMISO, ID_ROL, ID_OBJETO, PERMISO_INSERCION, PERMISO_ELIMINACION, PERMISO_ACTUALIZACION, PERMISO_CONSULTAR, MODIFICADO_POR } = req.body;

  try {
    await sequelize.query(
      `CALL actualizar_permiso(:ID_PERMISO, :ID_ROL, :ID_OBJETO, :PERMISO_INSERCION, :PERMISO_ELIMINACION, :PERMISO_ACTUALIZACION, :PERMISO_CONSULTAR, :MODIFICADO_POR);`,
      {
        replacements: {
          ID_PERMISO,
          ID_ROL,
          ID_OBJETO,
          PERMISO_INSERCION: PERMISO_INSERCION.toUpperCase(),
          PERMISO_ELIMINACION: PERMISO_ELIMINACION.toUpperCase(),
          PERMISO_ACTUALIZACION: PERMISO_ACTUALIZACION.toUpperCase(),
          PERMISO_CONSULTAR: PERMISO_CONSULTAR.toUpperCase(),
          MODIFICADO_POR,
        },
      }
    );

    res.json({ msg: `Permiso con ID ${ID_ROL} actualizado correctamente.` });
  } catch (error) {
    console.error("Error al actualizar el permiso:", error);
    res.status(500).json({ msg: "Error al actualizar el permiso.", error });
  }
};


// Eliminar un permiso usando procedimiento almacenado
export const deletePermiso = async (req: Request, res: Response) => {
  const { ID_PERMISO } = req.body;

  try {
    await sequelize.query(`CALL eliminar_permiso(:ID_PERMISO);`, {
      replacements: { ID_PERMISO },
    });

    res.json({ msg: `Permiso con ID ${ID_PERMISO} eliminado exitosamente.` });
  } catch (error) {
    console.error("Error al eliminar el Permiso:", error);
    res.status(500).json({ msg: "Error al eliminar el permiso.", error });
  }
};

