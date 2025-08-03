import { Request, Response } from "express";
import sequelize from "../../database/conexion";

// Crear una nueva categoría
export const createCategoria = async (req: Request, res: Response) => {
  const { CATEGORIA, ESTADO } = req.body;

  try {
    await sequelize.query(
      `CALL crear_categoria(
        :CATEGORIA,
        :ESTADO
      );`,
      {
        replacements: {
          CATEGORIA: CATEGORIA ? CATEGORIA.toUpperCase() : null,
          ESTADO: ESTADO ? 1 : 0,
        },
      }
    );

    res.status(201).json({
      msg: `Categoría ${CATEGORIA?.toUpperCase() || "sin nombre"} creada correctamente.`,
    });
  } catch (error: any) {
    console.error("Error al crear la categoría:", error);
    res.status(500).json({
      msg: `Error al crear la categoría ${CATEGORIA?.toUpperCase() || ""}.`,
      error,
    });
  }
};

// Obtener todas las categorías
export const getCategoria = async (req: Request, res: Response) => {
  try {
    const result: any = await sequelize.query("CALL obtener_categorias();");

    if (!result || result.length === 0) {
      return res.status(404).json({ msg: "No hay categorías registradas." });
    }

    // Convertir ESTADO a boolean
    const listaCategorias = result.map((cat: any) => ({
      ...cat,
      ESTADO: cat.ESTADO === 1,
    }));

   res.json({ 
      Listado_Categoria: listaCategorias,   // Para CategoriaComponent
      Listado_Categorias: listaCategorias   // Para SubCategoriaComponent
    });
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    res.status(500).json({
      msg: "Error al obtener la lista de categorías.",
    });
  }
};

// Actualizar categoría
export const updateCategoria = async (req: Request, res: Response) => {
  const { ID_CATEGORIA, CATEGORIA, ESTADO } = req.body;

  try {
    const id = parseInt(ID_CATEGORIA);

    if (isNaN(id)) {
      return res.status(400).json({ msg: "El ID de la categoría debe ser un número válido." });
    }

    await sequelize.query(
      `CALL actualizar_categoria(
        :ID_CATEGORIA,
        :CATEGORIA,
        :ESTADO
      );`,
      {
        replacements: {
          ID_CATEGORIA: id,
          CATEGORIA: CATEGORIA ? CATEGORIA.toUpperCase() : null,
          ESTADO: ESTADO ? 1 : 0,
        },
      }
    );

    res.status(200).json({ msg: `Categoría con ID ${id} actualizada correctamente.` });
  } catch (error: any) {
    console.error("Error al actualizar la categoría:", error);
    res.status(500).json({
      msg: "Error al actualizar la categoría.",
      error,
    });
  }
};

// Eliminar categoría (recibiendo ID en el body)
export const deleteCategoria = async (req: Request, res: Response) => {
  const { ID_CATEGORIA } = req.body;

  if (!ID_CATEGORIA || isNaN(ID_CATEGORIA)) {
    return res.status(400).json({ msg: "ID de categoría inválido." });
  }

  try {
    await sequelize.query("CALL eliminar_categoria(:ID_CATEGORIA);", {
      replacements: { ID_CATEGORIA },
    });

    res.json({
      msg: `Categoría con ID ${ID_CATEGORIA} eliminada exitosamente.`,
    });
  } catch (error: any) {
    console.error("Error al eliminar la categoría:", error);
    res.status(500).json({
      msg: "Error al eliminar la categoría.",
      error,
    });
  }
};