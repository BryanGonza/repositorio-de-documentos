import { Request, Response } from 'express';
import sequelize from '../../database/conexion';

// Obtener todas las clases
export const getClase = async (req: Request, res: Response) => {
  try {
    const result: any = await sequelize.query("CALL obtener_clases();");

    // Aseguramos que siempre devolvemos un array con datos
    const lista = Array.isArray(result) ? result : [];

    if (!lista || lista.length === 0) {
      return res.status(404).json({ msg: "No hay clases registradas." });
    }

    // Convertir ESTADO a boolean para el frontend
    const listaClases = lista.map((clase: any) => ({
      ...clase,
      ESTADO: clase.ESTADO === 1
    }));

    // Cambio de clave para que coincida con el frontend
    res.json({ Listado_Clase: listaClases });
  } catch (error) {
    console.error("Error al obtener las clases:", error);
    res.status(500).json({
      msg: "Error al obtener la lista de clases.",
    });
  }
};

// Crear una nueva clase
export const createClase = async (req: Request, res: Response) => {
  const { NOMBRE, APROBADO, RECEPCIONADO, FORMATO, ESTADO } = req.body;

  try {
    await sequelize.query(
      `CALL crear_clase(
        :NOMBRE,
        :APROBADO,
        :RECEPCIONADO,
        :FORMATO,
        :ESTADO
      );`,
      {
        replacements: {
          NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
          APROBADO: APROBADO ? APROBADO.toUpperCase() : null,
          RECEPCIONADO: RECEPCIONADO ? RECEPCIONADO.toUpperCase() : null,
          FORMATO: FORMATO ? FORMATO.toUpperCase() : null,
          ESTADO: ESTADO ? 1 : 0 // Convertimos booleano a TINYINT
        }
      }
    );

    res.status(201).json({
      msg: `Clase ${NOMBRE?.toUpperCase() || 'sin nombre'} creada correctamente.`,
    });

  } catch (error: any) {
    console.error("Error al crear la clase:", error);
    res.status(500).json({
      msg: `Error al crear la clase ${NOMBRE?.toUpperCase() || ''}.`,
    });
  }
};

// Actualizar clase
export const updateClase = async (req: Request, res: Response) => {
  const { ID_CLASE, NOMBRE, APROBADO, RECEPCIONADO, FORMATO, ESTADO } = req.body;

  try {
    const id = parseInt(ID_CLASE);

    if (isNaN(id)) {
      return res.status(400).json({ msg: "El ID de la clase debe ser un número válido." });
    }

    await sequelize.query(`
      CALL actualizar_clase(
        :ID_CLASE,
        :NOMBRE,
        :APROBADO,
        :RECEPCIONADO,
        :FORMATO,
        :ESTADO
      )
    `, {
      replacements: {
        ID_CLASE: id,
        NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
        APROBADO: APROBADO ? APROBADO.toUpperCase() : null,
        RECEPCIONADO: RECEPCIONADO ? RECEPCIONADO.toUpperCase() : null,
        FORMATO: FORMATO ? FORMATO.toUpperCase() : null,
        ESTADO: ESTADO ? 1 : 0 // Convertimos booleano a TINYINT
      }
    });

    res.status(200).json({ msg: `Clase con ID ${id} actualizada correctamente.` });
  } catch (error: any) {
    console.error("Error al actualizar la clase:", error);

    if (error.original?.sqlMessage) {
      return res.status(400).json({ msg: error.original.sqlMessage });
    }

    res.status(500).json({ msg: "Error al actualizar la clase." });
  }
};

// Eliminar clase
export const deleteClase = async (req: Request, res: Response) => {
  const { ID_CLASE } = req.body;

  try {
    await sequelize.query('CALL eliminar_clase(:ID_CLASE)', {
      replacements: { ID_CLASE },
    });

    res.json({
      msg: `Clase con ID ${ID_CLASE} eliminada exitosamente.`,
    });
  } catch (error: any) {
    console.error("Error al eliminar la clase:", error);

    const msg = error?.original?.sqlMessage || "Error al eliminar la clase.";
    res.status(500).json({ msg });
  }
};