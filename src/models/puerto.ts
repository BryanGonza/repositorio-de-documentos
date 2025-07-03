// src/config/puerto.ts
import { Op } from "sequelize";
import { parametros } from "../models/parametros";

export const obtenerPuertoDesdeBD = async (): Promise<number> => {
  const resultado = await parametros.findOne({
    where: {
      PARAMETRO: {
        [Op.like]: '%PUERTO%BACKEND%',
      },
    },
  });

  return Number(resultado?.VALOR) || 3016; 
};
