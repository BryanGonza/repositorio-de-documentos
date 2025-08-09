import { Request, Response } from "express";

import sequelize from "../database/conexion"; // Asegúrate de que esta ruta sea correcta

// Crear rol usando procedimiento almacenado
export const createRol = async (req: Request, res: Response) => {
    const { ROL, DESCRIPCION, CREADO_POR } = req.body;

    try {
        await sequelize.query(
            `CALL crear_rol(:ROL, :DESCRIPCION, :CREADO_POR);`,
            {
                replacements: {
                    ROL,
                    DESCRIPCION,
                    CREADO_POR
                }
            }
        );

        res.json({
            msg: 'Rol creado correctamente',
        });
    } catch (error) {
        console.error('Error al crear Rol:', error);
        res.status(500).json({
            msg: 'Error al crear Rol',
            error
        });
    }
};


// Obtener todos los roles usando procedimiento almacenado
export const getRoles = async (req: Request, res: Response) => {
    try {
        const ListRoles: any = await sequelize.query(`CALL obtener_roles();`);
        res.json({ ListRoles });
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({
            msg: 'Error al obtener roles',
            error
        });
    }
};

// Actualizar un rol usando procedimiento almacenado
export const updateRoles = async (req: Request, res: Response) => {
    const { ID_ROL, ROL, DESCRIPCION, MODIFICADO_POR } = req.body;

    try {
        await sequelize.query(
            `CALL actualizar_rol(:ID_ROL, :ROL, :DESCRIPCION, :MODIFICADO_POR);`,
            {
                replacements: {
                    ID_ROL,
                    ROL,
                    DESCRIPCION,
                    MODIFICADO_POR
                }
            }
        );

        res.status(200).json({
            msg: `Rol con ID ${ID_ROL} actualizado correctamente.`,
        });
    } catch (error) {
        console.error("Error al actualizar el Rol:", error);
        res.status(500).json({
            msg: "Error al actualizar el rol.",
            error
        });
    }
};

// Eliminar rol usando procedimiento almacenado
export const deleteroles = async (req: Request, res: Response) => {
    const { ID_ROL } = req.body;
    try {
        await sequelize.query(`CALL eliminar_rol(:ID_ROL);`, {
            replacements: { ID_ROL },
        });


        res.json({
            msg: `Rol con ID ${ID_ROL} eliminado exitosamente.`,
        });
    } catch (error) {
        console.error('Error al eliminar el rol:', error);
        res.status(500).json({
            msg: 'Error al eliminar el rol.',

        });
    }
};



