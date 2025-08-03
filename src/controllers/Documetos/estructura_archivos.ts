import { Request, Response } from 'express';
import sequelize from '../../database/conexion';

// Obtener todas las estructuras de archivos
export const getEstructura = async (req: Request, res: Response) => {
  try {
    const result: any = await sequelize.query("CALL select_estructuras_archivos();");
    
    if (!result || result.length === 0) {
      return res.status(404).json({ msg: "No hay estructuras de archivos registradas." });
    }

    res.json({ Listado_Estrucura_Archivos: result });
  } catch (error) {
    console.error("Error al obtener las estructuras:", error);
    res.status(500).json({
      msg: "Error al obtener la lista de estructuras de archivos.",
    });
  }
};

// Crear una nueva estructura de archivos
export const createEstructura = async (req: Request, res: Response) => {
  const { ID_DEPARTAMENTO, ESPACIO_ALMACENAMIENTO, NOMBRE, UBICACION } = req.body;

  try {
    await sequelize.query(
      `CALL insertar_estructura_archivos(
        :ID_DEPARTAMENTO,
        :ESPACIO_ALMACENAMIENTO,
        :NOMBRE,
        :UBICACION
      );`,
      {
        replacements: {
          ID_DEPARTAMENTO: ID_DEPARTAMENTO || null,
          ESPACIO_ALMACENAMIENTO: ESPACIO_ALMACENAMIENTO || null,
          NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
          UBICACION: UBICACION ? UBICACION.toUpperCase() : null
        }
      }
    );

    res.status(201).json({
      msg: `Estructura de archivos ${NOMBRE?.toUpperCase() || 'sin nombre'} creada correctamente.`,
    });

  } catch (error: any) {
    console.error("Error al crear la estructura:", error);
    res.status(500).json({
      msg: `Error al crear la estructura de archivos ${NOMBRE?.toUpperCase() || ''}.`,
      error: error.message
    });
  }
};

// Actualizar estructura de archivos
export const updateEstructura = async (req: Request, res: Response) => {
  const {
    ID_ESTRUCTURA_ARCHIVOS,
    ID_DEPARTAMENTO,
    ESPACIO_ALMACENAMIENTO,
    NOMBRE,
    UBICACION
  } = req.body;

  try {
    const id = parseInt(ID_ESTRUCTURA_ARCHIVOS);

    if (isNaN(id)) {
      return res.status(400).json({ msg: "El ID de la estructura debe ser un número válido." });
    }

    await sequelize.query(`
      CALL actualizar_estructura_archivos(
        :ID_ESTRUCTURA_ARCHIVOS,
        :ID_DEPARTAMENTO,
        :ESPACIO_ALMACENAMIENTO,
        :NOMBRE,
        :UBICACION
      )
    `, {
      replacements: {
        ID_ESTRUCTURA_ARCHIVOS: id,
        ID_DEPARTAMENTO: ID_DEPARTAMENTO || null,
        ESPACIO_ALMACENAMIENTO: ESPACIO_ALMACENAMIENTO || null,
        NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
        UBICACION: UBICACION ? UBICACION.toUpperCase() : null
      }
    });

    res.status(200).json({ msg: `Estructura con ID ${id} actualizada correctamente.` });
  } catch (error: any) {
    console.error("Error al actualizar la estructura:", error);

    if (error.original?.sqlMessage) {
      return res.status(400).json({ msg: error.original.sqlMessage });
    }

    res.status(500).json({ msg: "Error al actualizar la estructura de archivos." });
  }
};

// Eliminar estructura de archivos
export const deleteEstructura = async (req: Request, res: Response) => {
  const { ID_ESTRUCTURA_ARCHIVOS } = req.body;

  try {
    await sequelize.query('CALL eliminar_estructura_archivos(:ID_ESTRUCTURA_ARCHIVOS)', {
      replacements: { ID_ESTRUCTURA_ARCHIVOS },
    });

    res.json({
      msg: `Estructura con ID ${ID_ESTRUCTURA_ARCHIVOS} eliminada exitosamente.`,
    });
  } catch (error: any) {
    console.error("Error al eliminar la estructura:", error);

    const msg = error?.original?.sqlMessage || "Error al eliminar la estructura de archivos.";
    res.status(500).json({ msg });
  }
};