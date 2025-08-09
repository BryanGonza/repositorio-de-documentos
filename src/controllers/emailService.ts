import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Request, Response } from "express";
import axios from "axios";



dotenv.config();

// USar APi para obtener los parametros
async function obtenerParametrosEspecificos() {
  try {
    // Llamada a la API para obtener los parámetros
    const response = await axios.get('http://localhost:3016/api/parametros/getParametros');
    const ListParametros = response.data.ListParametros;
    
    let correoRecuperacion = '';
    let contrasenaAplicacion = '';

    ListParametros.forEach((parametro: any) => {
      if (parametro.PARAMETRO === 'CORREO ELECTRONICO QUE ENVIA RECUPERACCION DE CONTRASEÑA') {
        correoRecuperacion = parametro.VALOR;
      } else if (parametro.PARAMETRO === 'CONTRASEÑA DE APLICACCION') {
        contrasenaAplicacion = parametro.VALOR;
      }
    });

    // Retornar los valorse
    return { correoRecuperacion, contrasenaAplicacion };
  } catch (error) {
    console.error('Error al obtener los parámetros:', error);
    throw error;
  }
}

export const configurarTransporter = async () => {
  try {
    // Obtener los valores de correo y contraseña desde la base de datos
    const { correoRecuperacion, contrasenaAplicacion } = await obtenerParametrosEspecificos();

    console.log("Correo de recuperación:", correoRecuperacion);
    console.log("Contraseña de aplicación:", contrasenaAplicacion);

    // Crear el transporter de nodemailer con los valores obtenidos
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: correoRecuperacion, // Correo electrónico de parametros 
        pass: contrasenaAplicacion, // Contraseña de aplicación de parametros
      },
    });

    return transporter;
  } catch (error) {
    console.error("Error al configurar el transporter:", error);
    throw error;
  }
};




