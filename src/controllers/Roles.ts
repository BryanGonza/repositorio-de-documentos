import { Request, Response } from "express";
import { ms_roles } from "../models/roles";

// Insertar un permiso
export const createRol = async (req: Request, res: Response) => {
    const { ROL, DESCRIPCION, CREADO_POR,  MODIFICADO_POR } = req.body;

    try {
        const Nuevo_Rol = await ms_roles.create({
            ROL, 
            DESCRIPCION, 
            FECHA_CREACION: new Date(), 
            CREADO_POR, 
            FECHA_MODIFICACION: new Date(), 
            MODIFICADO_POR
        });

        res.json({
            msg: 'Rol creado correctamente',
            Nuevo_Rol
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al crear Rol',
            error
        });
    }
};

// Obtener todos los roles
 
export const getRoles = async (req: Request, res: Response) => {
    const ListRoles = await ms_roles.findAll({
        order: [['FECHA_CREACION', 'DESC']],
    });
    res.json({ListRoles})
}

// Actualizar un rol

export const updateRoles = async (req: Request, res: Response) => {
    const { 
        ID_ROL,
        ROL, 
        DESCRIPCION, 
        FECHA_CREACION, 
        CREADO_POR, 
        FECHA_MODIFICACION, 
        MODIFICADO_POR
    } = req.body;

  try {
    // Buscar el rol por su id
    const rol = await ms_roles.findOne({ where: { ID_ROL } });

    if (!rol) {
      return res.status(404).json({
        msg: `No se encontró un rol con el ID ${ID_ROL}.`,
      });
    }

    // actualizar los campos que vienen en el body 
    await rol.update({
        ROL: ROL ?? rol.ROL,
        DESCRIPCION: DESCRIPCION ?? rol.DESCRIPCION, 
        FECHA_CREACION: FECHA_CREACION ?? rol.FECHA_CREACION, 
        CREADO_POR: CREADO_POR ?? rol.CREADO_POR, 
        FECHA_MODIFICACION: FECHA_MODIFICACION ?? rol.FECHA_MODIFICACION, 
        MODIFICADO_POR: MODIFICADO_POR ?? rol.MODIFICADO_POR
    });

    res.status(200).json({
      msg: `Rol con ID ${ID_ROL} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el Rol:", error);
    res.status(500).json({
      msg: "Error al actualizar el rol.",
    });
  }
};


//eliminar mediante id
  export const deleteroles = async (req: Request, res: Response) => {
    const { ID_ROL } = req.body;
    try {
        const deletedCount = await ms_roles.destroy({
            where: { ID_ROL: ID_ROL },
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un rol con el ID ${ID_ROL}.`,
            });
        }
        res.json({
            msg: `Rol con ID ${ID_ROL} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el rol:', error);
        res.status(500).json({
            msg: 'Error al eliminar el rol.',
        });
    }
};

