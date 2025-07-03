import { Request, Response } from "express";
import {  departamentos } from "../../models/UNAH/departamentos";

// Insertar 
export const createDep = async (req: Request, res: Response) => {
    const { ID_FACULTAD, NOMBRE, ESTADO } = req.body;

    try {
        const Nuevo_Registro = await departamentos.create({
            ID_FACULTAD,
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
 
export const getDep = async (req: Request, res: Response) => {
    const Listado_Departamentos = await departamentos.findAll();
    res.json({Listado_Departamentos})
}

// Actualizar 

export const updateDep = async (req: Request, res: Response) => {
    const { 
    ID_DEPARTAMENTO,
    ID_FACULTAD,
    NOMBRE,
    ESTADO,
    } = req.body;

  try {
    // Buscar el registro por su id
    const Departamentos = await departamentos.findOne({ where: { ID_DEPARTAMENTO } });

    if (!Departamentos) {
      return res.status(404).json({
        msg: `No se encontró un registro con el ID ${ID_DEPARTAMENTO}.`,
      });
    }

    // actualizar los campos que vienen en el body 
    await Departamentos.update({
        ID_DEPARTAMENTO: ID_DEPARTAMENTO ??Departamentos.ID_DEPARTAMENTO,
        ID_FACULTAD: ID_FACULTAD ?? Departamentos.ID_FACULTAD,
        NOMBRE: NOMBRE ?? Departamentos.NOMBRE, 
        ESTADO: ESTADO ?? Departamentos.ESTADO
    });

    res.status(200).json({
      msg: `Registro con ID ${ID_DEPARTAMENTO} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({
      msg: "Error al actualizar el registro.",
    });
  }
};


//eliminar mediante id
  export const deleteDep = async (req: Request, res: Response) => {
    const { ID_DEPARTAMENTO } = req.body;
    try {
        const deletedCount = await departamentos.destroy({
            where: { ID_DEPARTAMENTO: ID_DEPARTAMENTO },
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                msg: `No se encontró un registro con el ID ${ID_DEPARTAMENTO}.`,
            });
        }
        res.json({
            msg: `Registro con ID ${ID_DEPARTAMENTO} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
};