import { Request, Response } from "express";
import {  tipo_caracteristica } from "../../models/Documentos/tipo_caracteristica";

// Insertar 
export const createTipo_c= async (req: Request, res: Response) => {
    const { TIPO_CARACTERISTICA} = req.body;

    try {
        const Nuevo_Registro = await tipo_caracteristica.create({
            TIPO_CARACTERISTICA
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
 
export const getTipo_c = async (req: Request, res: Response) => {
    const Listado_Tipo_Caracteristica = await tipo_caracteristica.findAll();
    res.json({Listado_Tipo_Caracteristica})
}

// Actualizar 

export const updateTipo_c = async (req: Request, res: Response) => {
    const { 
    ID_TIPO_CARACTERISTICA,
    TIPO_CARACTERISTICA
    } = req.body;

  try {
    // Buscar el registro por su id
    const tipo_caracteristicas = await tipo_caracteristica.findOne({ where: { ID_TIPO_CARACTERISTICA} });

    if (!tipo_caracteristicas) {
      return res.status(404).json({
        msg: `No se encontró un registro con el ID ${ID_TIPO_CARACTERISTICA}.`,
      });
    }

      // actualizar los campos que vienen en el body 
      await tipo_caracteristicas.update({
        ID_TIPO_CARACTERISTICA: ID_TIPO_CARACTERISTICA ?? tipo_caracteristicas.ID_TIPO_CARACTERISTICA,
        TIPO_CARACTERISTICA: TIPO_CARACTERISTICA ?? tipo_caracteristicas.TIPO_CARACTERISTICA
    });

    res.status(200).json({
      msg: `Registro con ID ${ID_TIPO_CARACTERISTICA} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({
      msg: "Error al actualizar el registro.",
    });
  }
};


//eliminar mediante id
  export const deleteTipo_c = async (req: Request, res: Response) => {
    const { ID_TIPO_CARACTERISTICA } = req.body;
    try {
        const deletedCount = await tipo_caracteristica.destroy({
            where: { ID_TIPO_CARACTERISTICA: ID_TIPO_CARACTERISTICA},
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_TIPO_CARACTERISTICA}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_TIPO_CARACTERISTICA} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
};