import { Request, Response } from "express";
import { Facultad } from "../../models/UNAH/facultad";

// Insertar 
export const createFacultad = async (req: Request, res: Response) => {
    const { NOMBRE, ESTADO } = req.body;

    try {
        const Nuevo_Registro = await Facultad.create({
            NOMBRE,
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
 
export const getFacultad = async (req: Request, res: Response) => {
    const Lista_Facultad = await Facultad.findAll();
    res.json({Lista_Facultad})
}

// Actualizar 

export const updateFacultad = async (req: Request, res: Response) => {
    const { 
    ID_FACULTAD,
    NOMBRE,
    ESTADO,
    } = req.body;

  try {
    // Buscar el registro por su id
    const facultad = await Facultad.findOne({ where: { ID_FACULTAD } });

    if (!facultad) {
      return res.status(404).json({
        msg: `No se encontró un registro con el ID ${ID_FACULTAD}.`,
      });
    }

    // actualizar los campos que vienen en el body 
    await facultad.update({
        ID_FACULTAD: ID_FACULTAD ?? facultad.ID_FACULTAD,
        NOMBRE: NOMBRE ?? facultad.NOMBRE, 
        ESTADO: ESTADO ?? facultad.ESTADO
    });

    res.status(200).json({
      msg: `Registro con ID ${ID_FACULTAD} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({
      msg: "Error al actualizar el registro.",
    });
  }
};


//eliminar mediante id
  export const deleteFacultad = async (req: Request, res: Response) => {
    const { ID_FACULTAD } = req.body;
    try {
        const deletedCount = await Facultad.destroy({
            where: { ID_FACULTAD: ID_FACULTAD },
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_FACULTAD}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_FACULTAD} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
};

