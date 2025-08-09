
import { Request, Response } from 'express';
import sequelize from '../../database/conexion';

// ✅ Obtener todas las versiones
export const getVersion = async (req: Request, res: Response) => {
  try {
    const result: any = await sequelize.query("CALL listar_versiones();");

    if (!result || result.length === 0) {
      return res.status(404).json({ msg: "No hay versiones registradas." });
    }

    res.json({Listado_Version: result });
  } catch (error) {
    console.error("Error al obtener las versiones:", error);
    res.status(500).json({ msg: "Error al obtener las versiones." });
  }
};

// ✅ Crear nueva versión
export const createVersion = async (req: Request, res: Response) => {
  const { ID_USUARIO, NOMBRE, CAMBIOS, FECHA_ACTU } = req.body;

  try {
    await sequelize.query(`
      CALL insertar_version(:ID_USUARIO, :NOMBRE, :CAMBIOS, :FECHA_ACTU);
    `, {
      replacements: {
        ID_USUARIO,
        NOMBRE: NOMBRE?.toUpperCase() || null,
        CAMBIOS: CAMBIOS || null,
        FECHA_ACTU:new Date()
      }
    });

    res.status(201).json({ msg: "Versión creada correctamente." });
  } catch (error) {
    console.error("Error al crear la versión:", error);
    res.status(500).json({ msg: "Error al crear la versión." });
  }
};

//Actualizar version

export const updateVersion = async (req: Request, res: Response) => {
  const { ID_VERSION, ID_USUARIO, NOMBRE, CAMBIOS, FECHA_ACTU } = req.body;

  try {
    const id = parseInt(ID_VERSION);

    if (isNaN(id)) {
      return res.status(400).json({ msg: "El ID de la versión debe ser un número válido." });
    }

    await sequelize.query(`
      CALL actualizar_version(:ID_VERSION, :ID_USUARIO, :NOMBRE, :CAMBIOS, :FECHA_ACTU);
    `, {
      replacements: {
        ID_VERSION: id,
        ID_USUARIO: ID_USUARIO ?? null,
        NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
        CAMBIOS: CAMBIOS ?? null,
        FECHA_ACTU: FECHA_ACTU ? new Date(FECHA_ACTU) : new Date() // usa fecha actual si no viene
      }
    });

    res.status(200).json({ msg: `Versión con ID ${id} actualizada correctamente.` });
  } catch (error) {
    console.error("Error al actualizar la versión:", error);
    res.status(500).json({ msg: "Error al actualizar la versión." });

  }
};


// ✅ Eliminar versión
export const deleteVersion = async (req: Request, res: Response) => {
  const { ID_VERSION } = req.body;

  try {
    await sequelize.query(`
      CALL eliminar_version(:ID_VERSION);
    `, {
      replacements: { ID_VERSION }
    });

    res.json({ msg: `Versión con ID ${ID_VERSION} eliminada exitosamente.` });
  } catch (error: any) {
    console.error("Error al eliminar la versión:", error);
    const msg = error?.original?.sqlMessage || "Error al eliminar la versión.";
    res.status(500).json({ msg });
  }
}

