import { Request, Response } from "express";
import {  clases } from "../../models/UNAH/clase";

// Insertar 
export const createClase = async (req: Request, res: Response) => {
    const { NOMBRE,APROBADO,RECEPCIONADO,FORMATO, ESTADO } = req.body;

    try {
        const Nuevo_Registro = await clases.create({
            NOMBRE,
            APROBADO,
            RECEPCIONADO,
            FORMATO,
            ESTADO,
        });

        res.json({
            msg: 'Registro creado correctamente',
            Nuevo_Registro
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al crear Registro',
            error
        });
    }
};

// Obtener todos los registros
 
export const getClase = async (req: Request, res: Response) => {
    const Listado_Clase = await clases.findAll();
    res.json({Listado_Clase})
}

// Actualizar 

export const updateClase = async (req: Request, res: Response) => {
    const { 
    ID_CLASE,
    NOMBRE,
    APROBADO,
    RECEPCIONADO,
    FORMATO,
    ESTADO,
    } = req.body;

  try {
    // Buscar el registro por su id
    const clase = await clases.findOne({ where: { ID_CLASE} });

    if (!clase) {
      return res.status(404).json({
        msg: `No se encontró un registro con el ID ${ID_CLASE}.`,
      });
    }

    // actualizar los campos que vienen en el body 
    await clase.update({
        ID_CLASE: ID_CLASE ?? clase.ID_DEPARTAMENTO,
        NOMBRE: NOMBRE ?? clases.NOMBRE, 
        APROBADO: APROBADO ?? clase.APROBADO,
        RECEPCIONADO: RECEPCIONADO ?? clases.RECEPCIONADO,
        FORMATO: FORMATO ?? clases.FORMATO,
        ESTADO: ESTADO ?? clases.ESTADO,
    });

    res.status(200).json({
      msg: `Registro con ID ${ID_CLASE} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({
      msg: "Error al actualizar el registro.",
    });
  }
};


//eliminar mediante id
  export const deleteClase = async (req: Request, res: Response) => {
    const { ID_CLASE } = req.body;
    try {
        const deletedCount = await clases.destroy({
            where: { ID_CLASE: ID_CLASE },
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_CLASE}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_CLASE} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
};