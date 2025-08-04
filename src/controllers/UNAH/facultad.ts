import { Request, Response } from 'express';
import { Facultad } from '../../models/UNAH/facultad';
import sequelize from '../../database/conexion';

// Obtener todas las facultades
export const getFacultad = async (req: Request, res: Response) => {
  try {
    const result: any = await sequelize.query("CALL select_facultades();");
    
    if (!result || result.length === 0) {
      return res.status(404).json({ msg: "No hay facultades registrados." });
    }

    res.json({ Lista_Facultad: result });
  } catch (error) {
    console.error("Error al obtener las facultades:", error);
    res.status(500).json({
      msg: "Error al obtener la lista de facultades.",
    });
  }
};

// Crear una nueva facultad
export const createFacultad = async (req: Request, res: Response) => {
  const { NOMBRE, DESCRIPCION, ESTADO } = req.body;

  try {
    await sequelize.query(
      `CALL insertar_facultad(
        :NOMBRE,
        :DESCRIPCION,
        :ESTADO
      );`,
      {
        replacements: {
          NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
          DESCRIPCION: DESCRIPCION ? DESCRIPCION.toUpperCase() : null,
          ESTADO: ESTADO ?? null,
        }
      }
    );

    res.status(201).json({
      msg: `Facultad ${NOMBRE?.toUpperCase() || 'sin nombre'} creada correctamente.`,
    });

  } catch (error: any) {
    console.error("Error al crear la facultad:", error);
    res.status(500).json({
      msg: `Error al crear la facultad ${NOMBRE?.toUpperCase() || ''}.`,
    });
  }
};



export const updateFacultad = async (req: Request, res: Response) => {
  const {
    ID_FACULTAD,
    NOMBRE,
    DESCRIPCION,
    ESTADO,
  } = req.body;

  try {
    const id = parseInt(ID_FACULTAD);

    if (isNaN(id)) {
      return res.status(400).json({ msg: "El ID de la facultad debe ser un número válido." });
    }

    await sequelize.query(`
      CALL actualizar_facultad(
        :ID_FACULTAD,
        :NOMBRE,
        :DESCRIPCION,
        :ESTADO
      )
    `, {
      replacements: {
        ID_FACULTAD: id,
        NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
        DESCRIPCION: DESCRIPCION ? DESCRIPCION.toUpperCase() : null,
        ESTADO: ESTADO ?? null // no usar toUpperCase aquí
      }
    });

    res.status(200).json({ msg: `Facultad con ID ${id} actualizada correctamente.` });
  } catch (error: any) {
    console.error("Error al actualizar la facultad:", error);

    if (error.original?.sqlMessage) {
      return res.status(400).json({ msg: error.original.sqlMessage });
    }

    res.status(500).json({ msg: "Error al actualizar la facultad." });
  }
};



//ELIMINAR
export const deleteFacultad = async (req: Request, res: Response) => {
  const { ID_FACULTAD} = req.body;

  try {
    await sequelize.query('CALL eliminar_facultad(:ID_FACULTAD)', {
      replacements: { ID_FACULTAD },
    });

    res.json({
      msg: `Facultad con ID ${ID_FACULTAD} eliminado exitosamente.`,
    });
  } catch (error: any) {
    console.error("Error al eliminar la facultad:", error);

    const msg = error?.original?.sqlMessage || "Error al eliminar la facultad.";
    res.status(500).json({ msg });
  }
};

