import { Request, Response } from 'express';
import sequelize from '../../database/conexion';

// Obtener todos los departamentos
export const getDep = async (req: Request, res: Response) => {
  try {
    const result: any = await sequelize.query("CALL select_departamentos();");

    if (!result || result.length === 0) {
      return res.status(404).json({ msg: "No hay departamentos registrados." });
    }

    res.json({ Listado_Departamentos: result });
  } catch (error) {
    console.error("Error al obtener los departamentos:", error);
    res.status(500).json({
      msg: "Error al obtener la lista de departamentos.",
    });
  }
};

export const createDep = async (req: Request, res: Response) => {
  const { ID_FACULTAD, NOMBRE, ESTADO } = req.body;

  console.log("Datos recibidos para crear departamento:", req.body);

  try {
    await sequelize.query(`
      CALL insertar_departamento(:ID_FACULTAD, :NOMBRE, :ESTADO)
    `, {
      replacements: {
        ID_FACULTAD,
        NOMBRE,
        ESTADO: ESTADO ? 1 : 0
      }
    });

    res.status(201).json({
      msg: 'Departamento creado correctamente.',
    });
  } catch (error: any) {
    console.error("Error al crear el departamento:", error);
    res.status(500).json({
      msg: "Error al crear el departamento.",
    });
  }
};


<<<<<<< HEAD
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
=======


// Actualizar un departamento
export const updateDep = async (req: Request, res: Response) => {
  const {
    ID_DEPARTAMENTO,
    ID_FACULTAD,
    NOMBRE,
    ESTADO
  } = req.body;

  try {
    const id = parseInt(ID_DEPARTAMENTO);

    if (isNaN(id)) {
      return res.status(400).json({ msg: "El ID del departamento debe ser un número válido." });
    }

    await sequelize.query(
      `CALL actualizar_departamento(
        :ID_DEPARTAMENTO,
        :ID_FACULTAD,
        :NOMBRE,
        :ESTADO
      );`,
      {
        replacements: {
          ID_DEPARTAMENTO: id,
          ID_FACULTAD,
          NOMBRE: NOMBRE ? NOMBRE.toUpperCase() : null,
          ESTADO: ESTADO ?? null
        }
      }
    );

    res.status(200).json({ msg: `Departamento con ID ${id} actualizado correctamente.` });
  } catch (error: any) {
    console.error("Error al actualizar el departamento:", error);
    res.status(500).json({ msg: "Error al actualizar el departamento." });
  }
};

// Eliminar un departamento
export const deleteDep = async (req: Request, res: Response) => {
  const { ID_DEPARTAMENTO } = req.body;

  try {
    await sequelize.query(
      'CALL eliminar_departamento(:ID_DEPARTAMENTO);',
      {
        replacements: { ID_DEPARTAMENTO },
      }
    );

    res.json({
      msg: `Departamento con ID ${ID_DEPARTAMENTO} eliminado exitosamente.`,
    });
  } catch (error: any) {
    console.error("Error al eliminar el departamento:", error);

    const msg = error?.original?.sqlMessage || "Error al eliminar el departamento.";
    res.status(500).json({ msg });
  }
};
>>>>>>> 421f3d2379d885e91410d9e83ebbbc659c5e403b
