import { Request, Response } from "express";
import { parametros } from "../models/parametros";

export const CrearParametro = async (req: Request, res: Response) => {
  const { PARAMETRO, VALOR, ADMIN_INTENTOS_INVALIDOS } = req.body;

  

  try {
    parametros.create({
      PARAMETRO: PARAMETRO.toUpperCase(),
      VALOR: VALOR.toUpperCase(),
      ADMIN_INTENTOS_INVALIDOS: ADMIN_INTENTOS_INVALIDOS,
      FECHA_CREACION: new Date(),
      FECHA_MODIFICACION: new Date(),
    });

    res.json({
      msg: `Parametro ${PARAMETRO} creado correctamente.`,
    });
  } catch (error) {
    res.status(400).json({
      msg: `Existe un error al crear el parametro => `,
      error,
    });
  }
};

//eliminar parametro
export const deleteParametro = async (req: Request, res: Response) => {
  const { ID_PARAMETRO } = req.body;
  try {
    const deletedCount = await parametros.destroy({
      where: { ID_PARAMETRO: ID_PARAMETRO },
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        msg: `No se encontró el parametro ${ID_PARAMETRO}.`,
      });
    }
    res.json({
      msg: `Parametro con ID ${ID_PARAMETRO} eliminado exitosamente.`,
    });
  } catch (error) {
    console.error("Error al eliminar el Parametro:", error);
    res.status(500).json({
      msg: "Error al eliminar el Parametro.",
    });
  }
};

//Actualizar parametros :)
export const updateParametros = async (req: Request, res: Response) => {
  const {
    ID_PARAMETRO,
    PARAMETRO,
    VALOR,
    ADMIN_INTENTOS_INVALIDOS,
    ID_USUARIO,
    FECHA_MODIFICACION,
  } = req.body;

  try {
    // Buscar el parametro por su id
    const parametro = await parametros.findOne({ where: { ID_PARAMETRO } });

    if (!parametro) {
      return res.status(404).json({
        msg: `No se encontró un parametro con el ID ${ID_PARAMETRO}.`,
      });
    }

    // actualizar los campos que vienen en el body
    await parametro.update({
      PARAMETRO: PARAMETRO ? PARAMETRO.toUpperCase() : parametro.PARAMETRO,
      VALOR: VALOR ? VALOR.toUpperCase() : parametro.VALOR,
      ADMIN_INTENTOS_INVALIDOS:
        ADMIN_INTENTOS_INVALIDOS ?? parametro.ADMIN_INTENTOS_INVALIDOS,
      FECHA_MODIFICACION: FECHA_MODIFICACION ?? new Date(),
    });

    res.status(200).json({
      msg: `Parametro con ID ${ID_PARAMETRO} actualizado correctamente.`,
    });
  } catch (error) {
    console.error("Error al actualizar el Parametro:", error);
    res.status(500).json({
      msg: "Error al actualizar el Parametro.",
    });
  }
};

//Get parametros
export const getParametros = async (req: Request, res: Response) => {
  const ListParametros = await parametros.findAll();
  res.json({ ListParametros });
};

