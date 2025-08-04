import { Request, Response } from 'express';
import sequelize from '../../database/conexion';

// ✅ Obtener todas las características
export const getCaracteristica = async (req: Request, res: Response) => {
  try {
    const result: any = await sequelize.query("CALL select_caracteristicas();");

    if (!result || result.length === 0) {
      return res.status(404).json({ msg: "No hay características registradas." });
    }

    res.json({ Listado_Caracteristicas: result });
  } catch (error) {
    console.error("Error al obtener las características:", error);
    res.status(500).json({ msg: "Error al obtener las características." });
  }
};

// ✅ Crear una nueva característica
export const createCaracteristica = async (req: Request, res: Response) => {
  const { ID_TIPO_CARACTERISTICA, CARACTERISTICA, VALORES_PREDETERMINADOS } = req.body;

  try {
    await sequelize.query(`
      CALL insertar_caracteristica(:ID_TIPO_CARACTERISTICA, :CARACTERISTICA, :VALORES_PREDETERMINADOS);
    `, {
      replacements: {
        ID_TIPO_CARACTERISTICA,
        CARACTERISTICA: CARACTERISTICA?.toUpperCase() || null,
        VALORES_PREDETERMINADOS: VALORES_PREDETERMINADOS || null
      }
    });

    res.status(201).json({ msg: "Característica creada correctamente." });
  } catch (error) {
    console.error("Error al crear la característica:", error);
    res.status(500).json({ msg: "Error al crear la característica." });
  }
};

// ✅ Actualizar una característica
export const updateCaracteristica = async (req: Request, res: Response) => {
  const { ID_CARACTERISTICA, ID_TIPO_CARACTERISTICA, CARACTERISTICA, VALORES_PREDETERMINADOS } = req.body;

  try {
    const id = parseInt(ID_CARACTERISTICA);

    if (isNaN(id)) {
      return res.status(400).json({ msg: "El ID de la característica debe ser un número válido." });
    }

    await sequelize.query(`
      CALL actualizar_caracteristica(:ID_CARACTERISTICA, :ID_TIPO_CARACTERISTICA, :CARACTERISTICA, :VALORES_PREDETERMINADOS);
    `, {
      replacements: {
        ID_CARACTERISTICA: id,
        ID_TIPO_CARACTERISTICA,
        CARACTERISTICA: CARACTERISTICA?.toUpperCase() || null,
        VALORES_PREDETERMINADOS: VALORES_PREDETERMINADOS || null
      }
    });

    res.status(200).json({ msg: `Característica con ID ${id} actualizada correctamente.` });
  } catch (error) {
    console.error("Error al actualizar la característica:", error);
    res.status(500).json({ msg: "Error al actualizar la característica." });
  }
};

// ✅ Eliminar una característica
export const deleteCaracteristica = async (req: Request, res: Response) => {
  const { ID_CARACTERISTICA } = req.body;

  try {
    await sequelize.query(`
      CALL eliminar_caracteristica(:ID_CARACTERISTICA);
    `, {
      replacements: { ID_CARACTERISTICA }
    });

    res.json({ msg: `Característica con ID ${ID_CARACTERISTICA} eliminada exitosamente.` });
  } catch (error: any) {
    console.error("Error al eliminar la característica:", error);
    const msg = error?.original?.sqlMessage || "Error al eliminar la característica.";
    res.status(500).json({ msg });
  }
};
