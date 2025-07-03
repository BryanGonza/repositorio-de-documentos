import { Request, Response } from "express";
import {  caracteristica } from "../../models/Documentos/caracteristica";

// Insertar 
export const createCaracteristica= async (req: Request, res: Response) => {
    const { ID_TIPO_CARACTERISTICA, CARACTERISTICA, VALORES_PREDETERMINADOS} = req.body;

    try {
        const Nuevo_Registro = await caracteristica.create({
            ID_TIPO_CARACTERISTICA, 
            CARACTERISTICA,
            VALORES_PREDETERMINADOS
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
 
export const getCaracteristica = async (req: Request, res: Response) => {
    const Listado_Caracteristicas = await caracteristica.findAll();
    res.json({Listado_Caracteristicas})
}

// Actualizar 

export const updateCaracteristica = async (req: Request, res: Response) => {
    const { 
    ID_CARACTERISTICA,
    ID_TIPO_CARACTERISTICA,
    CARACTERISTICA,
    VALORES_PREDETERMINADOS
    } = req.body;

  try {
    // Buscar el registro por su id
    const caracteristicas = await caracteristica.findOne({ where: { ID_CARACTERISTICA} });

    if (!caracteristicas) {
      return res.status(404).json({
        msg: `No se encontró un registro con el ID ${ID_CARACTERISTICA}.`,
      });
    }

      // actualizar los campos que vienen en el body 
      await caracteristicas.update({
        ID_CARACTERISTICA: ID_CARACTERISTICA ?? caracteristicas.ID_CARACTERISTICA,
        ID_TIPO_CARACTERISTICA: ID_TIPO_CARACTERISTICA ?? caracteristicas.ID_TIPO_CARACTERISTICA,
        CARACTERISTICA: CARACTERISTICA ?? caracteristicas.CARACTERISTICA,
        VALORES_PREDETERMINADOS: VALORES_PREDETERMINADOS ?? caracteristicas.VALORES_PREDETERMINADOS
    });

    res.status(200).json({
      msg: `Registro con ID ${ID_CARACTERISTICA} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({
      msg: "Error al actualizar el registro.",
    });
  }
};


//eliminar mediante id
  export const deleteCaracteristica = async (req: Request, res: Response) => {
    const { ID_CARACTERISTICA } = req.body;
    try {
        const deletedCount = await caracteristica.destroy({
            where: { ID_CARACTERISTICA: ID_CARACTERISTICA},
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_CARACTERISTICA}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_CARACTERISTICA} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
};