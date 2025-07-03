import { Request, Response } from "express";
import {  version } from "../../models/Documentos/version";
import { DATE } from "sequelize";

// Insertar 
export const createVersion= async (req: Request, res: Response) => {
    const {ID_USUARIO, NOMBRE, CAMBIOS} = req.body;

    try {
        const Nuevo_Registro = await version.create({ 
            ID_USUARIO,
            NOMBRE,
            CAMBIOS,
            FECHA_ACTU: new Date(),
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
 
export const getVersion = async (req: Request, res: Response) => {
    const Listado_Version = await version.findAll();
    res.json({Listado_Version})
}

// Actualizar 

export const updateVersion = async (req: Request, res: Response) => {
    const { 
    ID_VERSION,
    ID_USUARIO,
    NOMBRE,
    CAMBIOS,
    FECHA_ACTU
    } = req.body;

  try {
    // Buscar el registro por su id
    const versiones = await version.findOne({ where: { ID_VERSION} });

    if (!versiones) {
      return res.status(404).json({
        msg: `No se encontró un registro con el ID ${ID_VERSION}.`,
      });
    }

      // actualizar los campos que vienen en el body 
      await versiones.update({
        ID_VERSION: ID_VERSION ?? versiones.ID_SUB_CATEGORIA,
        ID_USUARIO: ID_USUARIO ?? versiones.ID_USUARIO,
        NOMBRE: NOMBRE ?? versiones.NOMBRE,
        CAMBIOS: CAMBIOS ?? versiones.CAMBIOS,
        FECHA_ACTU: FECHA_ACTU ?? new Date(), 
    });

    res.status(200).json({
      msg: `Registro con ID ${ID_VERSION} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({
      msg: "Error al actualizar el registro.",
    });
  }
};


//eliminar mediante id
  export const deleteVersion = async (req: Request, res: Response) => {
    const { ID_VERSION } = req.body;
    try {
        const deletedCount = await version.destroy({
            where: { ID_VERSION: ID_VERSION},
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_VERSION}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_VERSION} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
};