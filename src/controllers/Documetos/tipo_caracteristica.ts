import { Request, Response } from 'express';
import sequelize from '../../database/conexion';

// Obtener todos los tipos de característica
export const getTipo_c = async (req: Request, res: Response) => {
  try {
    const result: any = await sequelize.query("CALL select_tipo_caracteristicas();");

    if (!result || result.length === 0) {
      return res.status(404).json({ msg: "No hay tipos de característica registrados." });
    }

    res.json({ Listado_Tipo_Caracteristica: result });
  } catch (error) {
    console.error("Error al obtener los tipos de característica:", error);
    res.status(500).json({
      msg: "Error al obtener la lista de tipos de característica.",
    });
  }
};

// Crear nuevo tipo de característica
export const createTipo_c = async (req: Request, res: Response) => {
  const { TIPO_CARACTERISTICA } = req.body;

  try {
    await sequelize.query(
      `CALL insertar_tipo_caracteristica(:TIPO_CARACTERISTICA);`,
      {
        replacements: {
          TIPO_CARACTERISTICA: TIPO_CARACTERISTICA ? TIPO_CARACTERISTICA.toUpperCase() : null
        }
      }
    );

    res.status(201).json({
      msg: `Tipo de característica '${TIPO_CARACTERISTICA?.toUpperCase() || 'sin nombre'}' creada correctamente.`,
    });
  } catch (error: any) {
    console.error("Error al crear el tipo de característica:", error);
    res.status(500).json({
      msg: "Error al crear el tipo de característica.",
    });
  }
};

// Actualizar tipo de característica
export const updateTipo_c = async (req: Request, res: Response) => {
  const { ID_TIPO_CARACTERISTICA, TIPO_CARACTERISTICA } = req.body;

  try {
    const id = parseInt(ID_TIPO_CARACTERISTICA);

    if (isNaN(id)) {
      return res.status(400).json({ msg: "El ID debe ser un número válido." });
    }

    await sequelize.query(
      `CALL actualizar_tipo_caracteristica(:ID_TIPO_CARACTERISTICA, :TIPO_CARACTERISTICA);`,
      {
        replacements: {
          ID_TIPO_CARACTERISTICA: id,
          TIPO_CARACTERISTICA: TIPO_CARACTERISTICA ? TIPO_CARACTERISTICA.toUpperCase() : null
        }
      }
    );

    res.status(200).json({ msg: `Tipo de característica con ID ${id} actualizado correctamente.` });
  } catch (error: any) {
    console.error("Error al actualizar el tipo de característica:", error);
    res.status(500).json({ msg: "Error al actualizar el tipo de característica." });
  }
};

// Eliminar tipo de característica
export const deleteTipo_c = async (req: Request, res: Response) => {
  const { ID_TIPO_CARACTERISTICA } = req.body;

  try {
    await sequelize.query(
      'CALL eliminar_tipo_caracteristica(:ID_TIPO_CARACTERISTICA);',
      {
        replacements: { ID_TIPO_CARACTERISTICA },
      }
    );

    res.json({
      msg: `Tipo de característica con ID ${ID_TIPO_CARACTERISTICA} eliminado exitosamente.`,
    });
  } catch (error: any) {
    console.error("Error al eliminar el tipo de característica:", error);

    const msg = error?.original?.sqlMessage || "Error al eliminar el tipo de característica.";
    res.status(500).json({ msg });
  }
};

