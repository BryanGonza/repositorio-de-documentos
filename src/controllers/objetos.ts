import { Request, Response } from "express";
import { ms_objetos } from "../models/objetos";

// Insertar un objeto
export const createObjetos = async (req: Request, res: Response) => {
    const { OBJETO, TIPO_OBJETO, DESCRIPCION,FECHA_CREACION, CREADO_POR,FECHA_MODIFICACION,MODIFICADO_POR } = req.body;

    try {
        const Nuevo_Objeto = await ms_objetos.create({
            OBJETO,
            TIPO_OBJETO,
            DESCRIPCION,
            FECHA_CREACION: new Date(),
            CREADO_POR,
            FECHA_MODIFICACION:new Date(),
            MODIFICADO_POR
        });

        res.json({
            msg: 'Objeto creado correctamente',
            Nuevo_Objeto
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al crear Objeto',
            error
        });
    }
};

// Obtener todos los objetos
 
export const getObjetos = async (req: Request, res: Response) => {
    const Lista_Objetos = await ms_objetos.findAll({
      
    });
    res.json({Lista_Objetos})
}

// Actualizar un permiso

export const updateObjetos = async (req: Request, res: Response) => {
    const { 
        ID_OBJETO,
        OBJETO,
        TIPO_OBJETO,
        DESCRIPCION,
        CREADO_POR,
        MODIFICADO_POR
    } = req.body;

  try {
    // Buscar el objeto por su id
    const Objeto = await ms_objetos.findOne({ where: { ID_OBJETO } });

    if (!Objeto) {
      return res.status(404).json({
        msg: `No se encontró un objeto con el ID ${ID_OBJETO}.`,
      });
    }

    // actualizar los campos que vienen en el body 
    await Objeto.update({
        ID_OBJETO: ID_OBJETO ?? Objeto.ID_OBJETO,
        OBJETO: OBJETO ?? Objeto.OBJETO, 
        TIPO_OBJETO: TIPO_OBJETO ?? Objeto.TIPO_OBJETO, 
        DESCRIPCION: DESCRIPCION ?? Objeto.DESCRIPCION, 
        FECHA_CREACION: req.body.FECHA_CREACION ?? Objeto.FECHA_CREACION,
        CREADO_POR: CREADO_POR ?? Objeto.CREADO_POR,
        MODIFICADO_POR: MODIFICADO_POR ?? Objeto.MODIFICADO_POR,
        FECHA_MODIFICACION: new Date()
    });

    res.status(200).json({
      msg: `Objeto con ID ${ID_OBJETO} actualizado correctamente.`,
    });
  } catch (error) {
    console.error("Error al actualizar el objeto:", error);
    res.status(500).json({
      msg: "Error al actualizar el objeto.",
    });
  }
};


//eliminar mediante id
  export const deleteObjetos = async (req: Request, res: Response) => {
    const { ID_OBJETO } = req.body;
    try {
        const deletedCount = await ms_objetos.destroy({
            where: { ID_OBJETO: ID_OBJETO},
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un objeto con el ID ${ID_OBJETO}.`,
            });
        }
        res.json({
            msg: `Objeto con ID ${ID_OBJETO} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el Objeto:', error);
        res.status(500).json({
            msg: 'Error al eliminar el objeto.',
        });
    }

    
};


function parsePerm(val: any): boolean {
  if (typeof val === "boolean") {
    return val;
  }
  if (typeof val === "string") {
    return val.trim().toLowerCase() === "si";
  }
  return false;
}
import { Model } from "sequelize";
type ObjetoModel = Model & { dataValues: any; ID_OBJETO: number; };
export const getObjetosConPermisos = async (req: Request, res: Response) => {
  try {
    // 1) Obtenemos el arreglo de permisos granulares del usuario
    const userPermisos = req.body.user.permisos as {
      ID_OBJETO: number;
      PERMISO_CONSULTAR: string;
      PERMISO_INSERCION: string;
      PERMISO_ACTUALIZACION: string;
      PERMISO_ELIMINACION: string;
    }[];

    console.log("Usuario y permisos:", req.body.user);

    // 2) Traemos todos los objetos de la BD
    const objetosDB = await ms_objetos.findAll();
    
    const objetosConPermiso = objetosDB.map((obj: ObjetoModel) => {
      const permisoUsuario = userPermisos.find(p => p.ID_OBJETO === obj.ID_OBJETO);

      return {
        ...obj.dataValues,
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
