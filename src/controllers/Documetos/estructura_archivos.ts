import { Request, Response } from "express";
import {  estructura_archivos } from "../../models/Documentos/estructura_archivos";

// Insertar 
export const createEstructura = async (req: Request, res: Response) => {
    const { ID_DEPARTAMENTO, ESPACIO_ALMACENAMIENTO, NOMBRE,UBICACION } = req.body;

    try {
        const Nuevo_Registro = await estructura_archivos.create({
            ID_DEPARTAMENTO,
            ESPACIO_ALMACENAMIENTO,
            NOMBRE,
            UBICACION,
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
 
export const getEstructura = async (req: Request, res: Response) => {
    const Listado_Estrucura_Archivos = await estructura_archivos.findAll();
    res.json({Listado_Estrucura_Archivos})
}

// Actualizar 

export const updateEstructura = async (req: Request, res: Response) => {
    const { 
    ID_ESTRUCTURA_ARCHIVOS,
    ID_DEPARTAMENTO,
    ESPACIO_ALMACENAMIENTO,
    NOMBRE,
    UBICACION,
    } = req.body;

  try {
    // Buscar el registro por su id
    const estructura = await estructura_archivos.findOne({ where: { ID_ESTRUCTURA_ARCHIVOS } });

    if (!estructura) {
      return res.status(404).json({
        msg: `No se encontró un registro con el ID ${ID_ESTRUCTURA_ARCHIVOS}.`,
      });
    }

      // actualizar los campos que vienen en el body 
      await estructura.update({
        ID_ESTRUCTURA_ARCHIVOS: ID_ESTRUCTURA_ARCHIVOS ?? estructura.ID_ESTRUCTURA_ARCHIVOS,
        ID_DEPARTAMENTO: ID_DEPARTAMENTO ??estructura.ID_DEPARTAMENTO,
        ESPACIO_ALMACENAMIENTO: ESPACIO_ALMACENAMIENTO ?? estructura.ESPACIO_ALMACENAMIENTO,
        NOMBRE: NOMBRE ?? estructura.NOMBRE, 
        UBICACION: UBICACION ?? estructura.UBICACION
    });

    res.status(200).json({
      msg: `Registro con ID ${ID_ESTRUCTURA_ARCHIVOS} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({
      msg: "Error al actualizar el registro.",
    });
  }
};


//eliminar mediante id
  export const deleteEstructura = async (req: Request, res: Response) => {
    const { ID_ESTRUCTURA_ARCHIVOS } = req.body;
    try {
        const deletedCount = await estructura_archivos.destroy({
            where: { ID_ESTRUCTURA_ARCHIVOS: ID_ESTRUCTURA_ARCHIVOS },
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_ESTRUCTURA_ARCHIVOS}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_ESTRUCTURA_ARCHIVOS} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
};