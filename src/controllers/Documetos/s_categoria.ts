import { Request, Response } from "express";
import {  s_categoria } from "../../models/Documentos/s_categoria";

// Insertar 
export const createS_categoria= async (req: Request, res: Response) => {
    const {ID_CATEGORIA, SUB_CATEGORIA, ESTADO} = req.body;

    try {
        const Nuevo_Registro = await s_categoria.create({ 
            ID_CATEGORIA,
            SUB_CATEGORIA,
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
 
export const getS_categoria = async (req: Request, res: Response) => {
    const Listado_Sub_Categoria = await s_categoria.findAll();
    res.json({Listado_Sub_Categoria})
}

// Actualizar 

export const updateS_categoria = async (req: Request, res: Response) => {
    const { 
    ID_SUB_CATEGORIA,
    ID_CATEGORIA,
    SUB_CATEGORIA,
    ESTADO
    } = req.body;

  try {
    // Buscar el registro por su id
    const s_categorias = await s_categoria.findOne({ where: { ID_SUB_CATEGORIA} });

    if (!s_categorias) {
      return res.status(404).json({
        msg: `No se encontró un registro con el ID ${ID_SUB_CATEGORIA}.`,
      });
    }

      // actualizar los campos que vienen en el body 
      await s_categorias.update({
        ID_SUB_CATEGORIA: ID_SUB_CATEGORIA ?? s_categorias.ID_SUB_CATEGORIA,
        ID_CATEGORIA: ID_CATEGORIA ?? s_categorias.ID_CATEGORIA,
        SUB_CATEGORIA: SUB_CATEGORIA ?? s_categorias.SUB_CATEGORIA,
        ESTADO: ESTADO ?? s_categorias.ESTADO,
    });

    res.status(200).json({
      msg: `Registro con ID ${ID_SUB_CATEGORIA} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({
      msg: "Error al actualizar el registro.",
    });
  }
};


//eliminar mediante id
  export const deleteS_categoria = async (req: Request, res: Response) => {
    const { ID_SUB_CATEGORIA } = req.body;
    try {
        const deletedCount = await s_categoria.destroy({
            where: { ID_SUB_CATEGORIA: ID_SUB_CATEGORIA},
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_SUB_CATEGORIA}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_SUB_CATEGORIA} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
};