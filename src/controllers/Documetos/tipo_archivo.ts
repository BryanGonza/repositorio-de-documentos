import { Request, Response } from "express";

import sequelize from "../../database/conexion";


// Insertar usando procedimiento almacenado

export const createTipo_archivo = async (req: Request, res: Response) => {
    const { TIPO_ARCHIVO, LIMITE_ALMACENAMIENTO } = req.body;

    try {
        await sequelize.query(
            "CALL PINSERT_TIPO_ARCHIVO(:tipo, :limite)",
            {
                replacements: { 
                    tipo: TIPO_ARCHIVO,
                    limite: LIMITE_ALMACENAMIENTO
                }
            }
        );

        res.json({
            msg: 'Registro creado correctamente mediante procedimiento almacenado.'
        });
    } catch (error : any) {
        res.status(500).json({
            msg: 'Error al crear registro.',
            error: error.message

        });
    }
};


// Obtener todos los registros usando procedimiento almacenado
export const getTipo_archivo = async (req: Request, res: Response) => {
    try {
        const [Listado_Tipo_Archivo] = await sequelize.query("CALL PSELECT_TIPO_ARCHIVO()");
        res.json({ Listado_Tipo_Archivo:Listado_Tipo_Archivo });
    } catch (error : any) {
        res.status(500).json({
            msg: 'Error al obtener registros.',
            error: error.message
        });
    }
};

// Actualizar usando procedimiento almacenado
export const updateTipo_archivo = async (req: Request, res: Response) => {
    const { ID_TIPO_ARCHIVO, TIPO_ARCHIVO, LIMITE_ALMACENAMIENTO } = req.body;

    try {
        await sequelize.query(
            "CALL PUPDATE_TIPO_ARCHIVO(:id, :tipo, :limite)",
            {
                replacements: {
                    id: ID_TIPO_ARCHIVO,
                    tipo: TIPO_ARCHIVO,
                    limite: LIMITE_ALMACENAMIENTO
                }
            }
        );

        res.status(200).json({
            msg: `Registro con ID ${ID_TIPO_ARCHIVO} actualizado correctamente mediante procedimiento almacenado.`
        });
    } catch (error : any) {
        res.status(500).json({
            msg: "Error al actualizar el registro.",
            error: error.message
        });
    }
};

// Eliminar usando procedimiento almacenado
export const deleteTipo_archivo = async (req: Request, res: Response) => {
    const { ID_TIPO_ARCHIVO } = req.body;

    try {
        await sequelize.query(
            "CALL PDELETE_TIPO_ARCHIVO(:id)",
            {
                replacements: { id: ID_TIPO_ARCHIVO }
            }
        );

        res.json({
            msg: `Registro con ID ${ID_TIPO_ARCHIVO} eliminado correctamente mediante procedimiento almacenado.`
        });
    } catch (error : any) {
        res.status(500).json({
            msg: 'Error al eliminar el registro.',
            error: error.message
        });
    }
};

