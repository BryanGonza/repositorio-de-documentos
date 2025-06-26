import { Request, Response } from "express";
import { permisos } from "../models/permisos";

// Insertar un permiso
export const createPermiso = async (req: Request, res: Response) => {
    const { ID_ROL, ID_OBJETO, PERMISO_INSERCION, PERMISO_ELIMINACION, PERMISO_ACTUALIZACION, PERMISO_CONSULTAR, CREADO_POR,MODIFICADO_POR,FECHA_CREACION, FECHA_MODIFICACION } = req.body;

    try {
        const Nuevo_Permiso = await permisos.create({
            ID_ROL,
            ID_OBJETO,
            PERMISO_INSERCION: PERMISO_INSERCION.toUpperCase(),
            PERMISO_ELIMINACION: PERMISO_ELIMINACION.toUpperCase(),
            PERMISO_ACTUALIZACION: PERMISO_ACTUALIZACION.toUpperCase(),
            PERMISO_CONSULTAR: PERMISO_CONSULTAR.toUpperCase(),
            CREADO_POR,
            MODIFICADO_POR,
            FECHA_CREACION,
            FECHA_MODIFICACION
        });

        res.json({
            msg: 'Permiso creado correctamente',
            Nuevo_Permiso
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al crear permiso',
            error
        });
    }
};

// Obtener todos los permisos
 
export const getPermisos = async (req: Request, res: Response) => {
    const ListPermisos = await permisos.findAll(
      { order: [['FECHA_CREACION', 'DESC']],}
    );
    res.json({ListPermisos})
}

// Actualizar un permiso

export const updatePermiso = async (req: Request, res: Response) => {
    const { 
    ID_PERMISO,
    ID_ROL,
    ID_OBJETO,
    PERMISO_INSERCION,
    PERMISO_ELIMINACION,
    PERMISO_ACTUALIZACION,
    PERMISO_CONSULTAR,
    CREADO_POR,
    MODIFICADO_POR,
    FECHA_CREACION,
    FECHA_MODIFICACION
    } = req.body;

  try {
    // Buscar el usuario por su id
    const permiso = await permisos.findOne({ where: { ID_PERMISO } });

    if (!permiso) {
      return res.status(404).json({
        msg: `No se encontró un permiso con el ID ${ID_PERMISO}.`,
      });
    }

    // actualizar los campos que vienen en el body 
    await permiso.update({
        ID_ROL: ID_ROL ?? permiso.ID_ROL,
        ID_OBJETO:ID_OBJETO ?? permiso.ID_OBJETO, 
        PERMISO_INSERCION: PERMISO_INSERCION.toUpperCase() ?? permiso.PERMISO_INSERCION.toUpperCase(), 
        PERMISO_ELIMINACION: PERMISO_ELIMINACION.toUpperCase() ?? permiso.PERMISO_ELIMINACION.toUpperCase(),
        PERMISO_ACTUALIZACION:PERMISO_ACTUALIZACION.toUpperCase() ?? permiso.PERMISO_ACTUALIZACION.toUpperCase(),
        PERMISO_CONSULTAR: PERMISO_CONSULTAR.toUpperCase() ?? permiso.PERMISO_CONSULTAR.toUpperCase(), 
        CREADO_POR: CREADO_POR ?? permiso.CREADO_POR,
        MODIFICADO_POR: MODIFICADO_POR ?? permiso.MODIFICADO_POR,
        FECHA_CREACION: FECHA_CREACION ?? permiso.FECHA_CREACION,
        FECHA_MODIFICACION: FECHA_MODIFICACION ?? permiso.FECHA_MODIFICACION
    });

    res.status(200).json({
      msg: `Permiso con ID ${ID_PERMISO} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el permiso:", error);
    res.status(500).json({
      msg: "Error al actualizar el permiso.",
    });
  }
};


//eliminar mediante id
  export const deletePermiso = async (req: Request, res: Response) => {
    const { ID_PERMISO } = req.body;
    try {
        const deletedCount = await permisos.destroy({
            where: { ID_PERMISO: ID_PERMISO },
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un permiso con el ID ${ID_PERMISO}.`,
            });
        }
        res.json({
            msg: `Permiso con ID ${ID_PERMISO} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el Permiso:', error);
        res.status(500).json({
            msg: 'Error al eliminar el permiso.',
        });
    }
};

