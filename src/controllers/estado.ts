import { Request, Response } from "express";
import sequelize from "../database/conexion"; 

// Insertar estado usando procedimiento almacenado
export const createEstado = async (req: Request, res: Response) => {
    const { ESTADO } = req.body;

    try {
        const [Nuevo_Registro] = await sequelize.query(
            `CALL PINSERT_ESTADO(:estado);`,
            {
                replacements: { estado: ESTADO }
            }
        );

        res.json({
            msg: 'Registro creado correctamente',
            Nuevo_Registro
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al crear Registro',
            error
        });
    }
};

// Obtener todos los estados usando procedimiento almacenado
export const getEstado = async (req: Request, res: Response) => {
    try {
        const Lista_Estado = await sequelize.query(`CALL PSELECT_ESTADO();`);
        res.json({ Listado_Estado:Lista_Estado });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener registros',
            error
        });
    }
};

// Actualizar estado usando procedimiento almacenado
export const updateEstado = async (req: Request, res: Response) => {
    const { ID_ESTADO, ESTADO } = req.body;

    try {
        await sequelize.query(
            `CALL PUPDATE_ESTADO(:id, :estado);`,
            {
                replacements: {
                    id: ID_ESTADO,
                    estado: ESTADO
                }
            }
        );

        res.status(200).json({
            msg: `Registro con ID ${ID_ESTADO} actualizado correctamente.`,
        });
    } catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            msg: "Error al actualizar el registro.",
        });
    }
};

// Eliminar estado usando procedimiento almacenado
export const deleteEstado = async (req: Request, res: Response) => {
    const { ID_ESTADO } = req.body;

    try {
        await sequelize.query(
            `CALL PDELETE_ESTADO(:id);`,
            {
                replacements: { id: ID_ESTADO }
            }
        );

        res.json({
            msg: `Registro con ID ${ID_ESTADO} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
        });
    }
};
