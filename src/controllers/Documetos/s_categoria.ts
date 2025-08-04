import { Request, Response } from "express";

import sequelize from "../../database/conexion";

// Crear una nueva sub-categoría
export const createS_categoria = async (req: Request, res: Response) => {
  const { ID_CATEGORIA, SUB_CATEGORIA, ESTADO } = req.body;

  try {
    await sequelize.query(
      `CALL crear_sub_categoria(
        :ID_CATEGORIA,
        :SUB_CATEGORIA,
        :ESTADO
      );`,
      {
        replacements: {
          ID_CATEGORIA,
          SUB_CATEGORIA: SUB_CATEGORIA ? SUB_CATEGORIA.toUpperCase() : null,
          ESTADO: ESTADO ? 1 : 0,
        },
      }
    );

    res.status(201).json({
      msg: `Sub-categoría ${SUB_CATEGORIA?.toUpperCase() || 'sin nombre'} creada correctamente.`,
    });
  } catch (error: any) {
    console.error("Error al crear la sub-categoría:", error);
    res.status(500).json({
      msg: `Error al crear la sub-categoría ${SUB_CATEGORIA?.toUpperCase() || ''}.`,
      error,

    });
  }
};


// Obtener todas las sub-categorías (devuelve NOMBRE_CATEGORIA)
export const getS_categoria = async (req: Request, res: Response) => {
  try {
    const result: any = await sequelize.query("CALL obtener_sub_categorias();");

    if (!result || result.length === 0) {
      return res.status(404).json({ msg: "No hay sub-categorías registradas." });
    }

    const listaSubCategorias = result.map((sub: any) => ({
      ID_SUB_CATEGORIA: sub.ID_SUB_CATEGORIA,
      SUB_CATEGORIA: sub.SUB_CATEGORIA,
      ESTADO: sub.ESTADO === 1,
      NOMBRE_CATEGORIA: sub.NOMBRE_CATEGORIA, // Solo nombre
    }));

    res.json({ Listado_Sub_Categoria: listaSubCategorias });
  } catch (error) {
    console.error("Error al obtener las sub-categorías:", error);
    res.status(500).json({
      msg: "Error al obtener la lista de sub-categorías.",
    });
  }
};

// Actualizar sub-categoría
export const updateS_categoria = async (req: Request, res: Response) => {
  const { ID_SUB_CATEGORIA, ID_CATEGORIA, SUB_CATEGORIA, ESTADO } = req.body;

  try {
    const id = parseInt(ID_SUB_CATEGORIA);
    if (isNaN(id)) {
      return res.status(400).json({ msg: "El ID de la sub-categoría debe ser un número válido." });
    }

    await sequelize.query(
      `CALL actualizar_sub_categoria(
        :ID_SUB_CATEGORIA,
        :ID_CATEGORIA,
        :SUB_CATEGORIA,
        :ESTADO
      );`,
      {
        replacements: {
          ID_SUB_CATEGORIA: id,
          ID_CATEGORIA,
          SUB_CATEGORIA: SUB_CATEGORIA ? SUB_CATEGORIA.toUpperCase() : null,
          ESTADO: ESTADO ? 1 : 0,
        },
      }
    );

    res.status(200).json({ msg: `Sub-categoría con ID ${id} actualizada correctamente.` });
  } catch (error: any) {
    console.error("Error al actualizar la sub-categoría:", error);
    res.status(500).json({
      msg: "Error al actualizar la sub-categoría.",
      error,
    });
  }
};

// Eliminar sub-categoría
export const deleteS_categoria = async (req: Request, res: Response) => {
  const { ID_SUB_CATEGORIA } = req.body;

  try {
    await sequelize.query('CALL eliminar_sub_categoria(:ID_SUB_CATEGORIA)', {
      replacements: { ID_SUB_CATEGORIA },
    });

    res.json({
      msg: `Sub-categoría con ID ${ID_SUB_CATEGORIA} eliminada exitosamente.`,
    });
  } catch (error: any) {
    console.error("Error al eliminar la sub-categoría:", error);
    res.status(500).json({
      msg: "Error al eliminar la sub-categoría.",
      error,
    });
  }

};