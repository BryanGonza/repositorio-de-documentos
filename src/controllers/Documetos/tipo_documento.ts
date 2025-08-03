import { Request, Response } from 'express';
import sequelize from '../../database/conexion';

// Obtener todos los tipos de documento
export const getTipo_d = async (req: Request, res: Response) => {
  try {
    const result: any = await sequelize.query("CALL obtener_tbl_tipo_documento();");

    if (!result || result.length === 0) {
      return res.status(404).json({ msg: "No hay tipos de documento registrados." });
    }

    res.json({ Listado_Tipo_Documentos: result });
  } catch (error) {
    console.error("Error al obtener los tipos de documento:", error);
    res.status(500).json({
      msg: "Error al obtener la lista de tipos de documento.",
    });
  }
};

// Crear un nuevo tipo de documento
export const createTipo_d = async (req: Request, res: Response) => {
  const { TIPO_DOCUMENTO, ESTADO } = req.body;

  try {
    await sequelize.query(
      `CALL crear_tbl_tipo_documento(:TIPO_DOCUMENTO, :ESTADO);`,
      {
        replacements: {
          TIPO_DOCUMENTO: TIPO_DOCUMENTO ? TIPO_DOCUMENTO.toUpperCase() : null,
          ESTADO: ESTADO ?? null
        }
      }
    );

    res.status(201).json({
      msg: `Tipo de documento ${TIPO_DOCUMENTO?.toUpperCase() || 'sin nombre'} creado correctamente.`,
    });

  } catch (error: any) {
    console.error("Error al crear el tipo de documento:", error);
    res.status(500).json({
      msg: `Error al crear el tipo de documento ${TIPO_DOCUMENTO?.toUpperCase() || ''}.`,
    });
  }
};

// Actualizar tipo de documento
export const updateTipo_d = async (req: Request, res: Response) => {
  const { ID_TIPO_DOCUMENTO, TIPO_DOCUMENTO, ESTADO } = req.body;

  try {
    const id = parseInt(ID_TIPO_DOCUMENTO);

    if (isNaN(id)) {
      return res.status(400).json({ msg: "El ID del tipo de documento debe ser un número válido." });
    }

    await sequelize.query(`CALL actualizar_tbl_tipo_documento(
      :ID_TIPO_DOCUMENTO,
      :TIPO_DOCUMENTO,
      :ESTADO
    )`, {
      replacements: {
        ID_TIPO_DOCUMENTO: id,
        TIPO_DOCUMENTO: TIPO_DOCUMENTO ? TIPO_DOCUMENTO.toUpperCase() : null,
        ESTADO: ESTADO ?? null
      }
    });

    res.status(200).json({ msg: `Tipo de documento con ID ${id} actualizado correctamente.` });
  } catch (error: any) {
    console.error("Error al actualizar el tipo de documento:", error);

    if (error.original?.sqlMessage) {
      return res.status(400).json({ msg: error.original.sqlMessage });
    }

    res.status(500).json({ msg: "Error al actualizar el tipo de documento." });
  }
};

// Eliminar tipo de documento
export const deleteTipo_d = async (req: Request, res: Response) => {
  const { ID_TIPO_DOCUMENTO } = req.body;

  try {
    await sequelize.query('CALL eliminar_tbl_tipo_documento(:ID_TIPO_DOCUMENTO)', {
      replacements: { ID_TIPO_DOCUMENTO },
    });

    res.json({
      msg: `Tipo de documento con ID ${ID_TIPO_DOCUMENTO} eliminado exitosamente.`,
    });
  } catch (error: any) {
    console.error("Error al eliminar el tipo de documento:", error);

    const msg = error?.original?.sqlMessage || "Error al eliminar el tipo de documento.";
    res.status(500).json({ msg });
  }
};