import { Request, Response } from "express";
import {  categoria } from "../models/categoria";

// Insertar 
export const createCategoria= async (req: Request, res: Response) => {
    const { CATEGORIA, ESTADO} = req.body;

    try {
        const Nuevo_Registro = await categoria.create({ 
            CATEGORIA,
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
 
export const getCategoria = async (req: Request, res: Response) => {
    const Listado_Categoria = await categoria.findAll();
    res.json({Listado_Categoria})
}

// Actualizar 

export const updateCategoria = async (req: Request, res: Response) => {
    const { 
    ID_CATEGORIA,
    CATEGORIA,
    ESTADO
    } = req.body;

  try {
    // Buscar el registro por su id
    const categorias = await categoria.findOne({ where: { ID_CATEGORIA} });

    if (!categorias) {
      return res.status(404).json({
        msg: `No se encontró un registro con el ID ${ID_CATEGORIA}.`,
      });
    }

      // actualizar los campos que vienen en el body 
      await categorias.update({
        ID_CATEGORIA: ID_CATEGORIA ?? categorias.ID_CATEGORIA,
        CATEGORIA: CATEGORIA ?? categorias.CATEGORIA,
        ESTADO: ESTADO ?? categorias.ESTADO,
    });

    res.status(200).json({
      msg: `Registro con ID ${ID_CATEGORIA} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({
      msg: "Error al actualizar el registro.",
    });
  }
};


//eliminar mediante id
  export const deleteCategoria = async (req: Request, res: Response) => {
    const { ID_CATEGORIA } = req.body;
    try {
        const deletedCount = await categoria.destroy({
            where: { ID_CATEGORIA: ID_CATEGORIA},
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_CATEGORIA}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_CATEGORIA} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
};