import { Request, Response } from "express";
import {  estado } from "../models/estado";

// Insertar 
export const createEstado= async (req: Request, res: Response) => {
    const { ESTADO} = req.body;

    try {
        const Nuevo_Registro = await estado.create({ 
           ESTADO
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
 
export const getEstado = async (req: Request, res: Response) => {
    const Listado_Estado = await estado.findAll();
    res.json({Listado_Estado})
}

// Actualizar 

export const updateEstado = async (req: Request, res: Response) => {
    const { 
    ID_ESTADO,
    ESTADO
    } = req.body;

  try {
    // Buscar el registro por su id
    const estados = await estado.findOne({ where: { ID_ESTADO} });

    if (!estados) {
      return res.status(404).json({
        msg: `No se encontró un registro con el ID ${ID_ESTADO}.`,
      });
    }

      // actualizar los campos que vienen en el body 
      await estados.update({
        ID_ESTADO: ID_ESTADO?? estados.ID_ESTADO,
        ESTADO: ESTADO ?? estados.ESTADO
    });

    res.status(200).json({
      msg: `Registro con ID ${ID_ESTADO} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({
      msg: "Error al actualizar el registro.",
    });
  }
};


//eliminar mediante id
  export const deleteEstado = async (req: Request, res: Response) => {
    const { ID_ESTADO } = req.body;
    try {
        const deletedCount = await estado.destroy({
            where: { ID_ESTADO: ID_ESTADO},
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_ESTADO}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_ESTADO} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
};