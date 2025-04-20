import { Request, Response } from "express";
import {  tipo_archivo } from "../../models/Documentos/tipo_archivo";

// Insertar 
export const createTipo_archivo = async (req: Request, res: Response) => {
    const { TIPO_ARCHIVO, LIMITE_ALMACENAMIENTO } = req.body;

    try {
        const Nuevo_Registro = await tipo_archivo.create({
            TIPO_ARCHIVO,
            LIMITE_ALMACENAMIENTO
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

export const getTipo_archivo = async (req: Request, res: Response) => {
    const Listado_Tipo_Archivo = await tipo_archivo.findAll();
    res.json({Listado_Tipo_Archivo})
}

// Actualizar 

export const updateTipo_archivo = async (req: Request, res: Response) => {
    const { 
    ID_TIPO_ARCHIVO,
    TIPO_ARCHIVO,
    LIMITE_ALMACENAMIENTO
    } = req.body;

  try {
    // Buscar el registro por su id
    const tipo_archivos = await tipo_archivo.findOne({ where: { ID_TIPO_ARCHIVO } });

    if (!tipo_archivos) {
      return res.status(404).json({
        msg: `No se encontró un registro con el ID ${ID_TIPO_ARCHIVO}.`,
      });
    }

      // actualizar los campos que vienen en el body 
      await tipo_archivos.update({
        ID_TIPO_ARCHIVO: ID_TIPO_ARCHIVO ?? tipo_archivos.ID_TIPO_ARCHIVO,
       TIPO_ARCHIVO: TIPO_ARCHIVO ?? tipo_archivos.TIPO_ARCHIVO,
        LIMITE_ALMACENAMIENTO: LIMITE_ALMACENAMIENTO ?? tipo_archivos.LIMITE_ALMACENAMIENTO
    });

    res.status(200).json({
      msg: `Registro con ID ${ID_TIPO_ARCHIVO} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({
      msg: "Error al actualizar el registro.",
    });
  }
};


//eliminar mediante id
  export const deleteTipo_archivo = async (req: Request, res: Response) => {
    const { ID_TIPO_ARCHIVO } = req.body;
    try {
        const deletedCount = await tipo_archivo.destroy({
            where: { ID_TIPO_ARCHIVO: ID_TIPO_ARCHIVO },
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_TIPO_ARCHIVO}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_TIPO_ARCHIVO} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
};