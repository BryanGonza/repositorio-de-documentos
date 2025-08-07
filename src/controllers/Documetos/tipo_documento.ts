import { Request, Response } from "express";
import {  tipo_documento } from "../../models/Documentos/tipo_documento";

// Insertar 
export const createTipo_d = async (req: Request, res: Response) => {
    const { TIPO_DOCUMENTO, ESTADO} = req.body;

    try {
        const Nuevo_Registro = await tipo_documento.create({
            TIPO_DOCUMENTO,
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
 
export const getTipo_d = async (req: Request, res: Response) => {
    const Listado_Tipo_Documentos = await tipo_documento.findAll();
    res.json({Listado_Tipo_Documentos})
}

// Actualizar 

export const updateTipo_d = async (req: Request, res: Response) => {
    const { 
    ID_TIPO_DOCUMENTO,
    TIPO_DOCUMENTO,
    ESTADO
    } = req.body;

  try {
    // Buscar el registro por su id
    const tipo_documentos = await tipo_documento.findOne({ where: { ID_TIPO_DOCUMENTO} });

    if (!tipo_documentos) {
      return res.status(404).json({
        msg: `No se encontró un registro con el ID ${ID_TIPO_DOCUMENTO}.`,
      });
    }

      // actualizar los campos que vienen en el body 
      await tipo_documentos.update({
        ID_TIPO_DOCUMENTO: ID_TIPO_DOCUMENTO ?? tipo_documentos.ID_TIPO_DOCUMENTO,
        TIPO_DOCUMENTO: TIPO_DOCUMENTO?? tipo_documentos.TIPO_DOCUMENTO,
        ESTADO: ESTADO ?? tipo_documentos.ESTADO
    });

    res.status(200).json({
      msg: `Registro con ID ${ID_TIPO_DOCUMENTO} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({
      msg: "Error al actualizar el registro.",
    });
  }
};


//eliminar mediante id
  export const deleteTipo_d = async (req: Request, res: Response) => {
    const { ID_TIPO_DOCUMENTO } = req.body;
    try {
        const deletedCount = await tipo_documento.destroy({
            where: { ID_TIPO_DOCUMENTO: ID_TIPO_DOCUMENTO },
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_TIPO_DOCUMENTO}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_TIPO_DOCUMENTO} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
};