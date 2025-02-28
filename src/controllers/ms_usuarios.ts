import { Request, Response } from "express";
import bycryp from "bcrypt";
import { ms_usuarios } from "../models/ms_usuarios";
import { Op, where } from "sequelize";
import jwt from "jsonwebtoken";
import sequelize from "../database/conexion";
import { transporter } from "../controllers/emailService";

//Registrar un usuario
export const registrerUser = async (req: Request, res: Response) => {
  const {
    ID_USUARIO,
    ID_DEPARTAMENTO,
    NUM_IDENTIDAD,
    ID_CARGO,
    DIRECCION_1,
    DIRECCION_2,
    USUARIO,
    NOMBRE_USUARIO,
    ESTADO_USUARIO,
    CONTRASEÑA,
    ID_ROL,
    FECHA_ULTIMA_CONEXION,
    PREGUNTAS_CONTESTADAS,
    CREADO_POR,
    FECHA_MODIFICACION,
    MODIFICADO_POR,
    PRIMER_INGRESO,
    FECHA_VENCIMIENTO,
    CORREO_ELECTRONICO,
  } = req.body;
 
  const user = await ms_usuarios.findOne({
    where: {
      [Op.or]: {
        CORREO_ELECTRONICO: CORREO_ELECTRONICO,
        NUM_IDENTIDAD: NUM_IDENTIDAD.toString(),
      },
    },
  });

  if (user) {
    return res.status(400).json({
      msg: `Ya existe un usuario con email ${CORREO_ELECTRONICO} o el numero de identidad ${NUM_IDENTIDAD}`,
    });
  }

  // console.log("Estoy aqui...");
  const CONTRASEÑAHash = await bycryp.hash(CONTRASEÑA, 10);
  console.log("Datos recibidos:", req.body);
  try {
    await ms_usuarios.create({
      ID_USUARIO: ID_USUARIO,
      ID_DEPARTAMENTO: ID_DEPARTAMENTO,
      NUM_IDENTIDAD: NUM_IDENTIDAD,
      ID_CARGO: ID_CARGO,
      DIRECCION_1: DIRECCION_1,
      DIRECCION_2: DIRECCION_2,
      USUARIO: USUARIO.toUpperCase(),
      NOMBRE_USUARIO: NOMBRE_USUARIO.toUpperCase(),
      ESTADO_USUARIO: ESTADO_USUARIO,
      CONTRASEÑA: CONTRASEÑA.toUpperCase(),
      ID_ROL: ID_ROL,
      FECHA_ULTIMA_CONEXION: FECHA_ULTIMA_CONEXION,
      PREGUNTAS_CONTESTADAS: PREGUNTAS_CONTESTADAS,
      FECHA_CREACION: new Date(),
      CREADO_POR: CREADO_POR,
      FECHA_MODIFICACION: FECHA_MODIFICACION,
      MODIFICADO_POR: MODIFICADO_POR,
      PRIMER_INGRESO: PRIMER_INGRESO,
      FECHA_VENCIMIENTO: FECHA_VENCIMIENTO,
      CORREO_ELECTRONICO: CORREO_ELECTRONICO.toUpperCase(),
    });
    


    res.json({
      msg: `Usuario ${NOMBRE_USUARIO.toUpperCase()} creado correctamente...`,
    });
  } catch (error: any) {
    console.error("Error en la creación del usuario:", error);
    res.status(500).json({
      msg: `Error al crear usuario ${NOMBRE_USUARIO.toUpperCase()}.`,
      
    });
  }
  
  
  
};

//Get para traer todos los usuarios
export const getUsuarios = async (req: Request, res: Response) => {
  const ListUsuarios = await ms_usuarios.findAll();
  res.json({ ListUsuarios });
};
//Login de Usuario
export const login = async (req: Request, res: Response) => {
  const { CORREO_ELECTRONICO, CONTRASEÑA } = req.body;

  try {
    const [resultado] = await sequelize.query(
    "CALL ValidarUsuario(?, ?);", 
  {
    replacements: [CORREO_ELECTRONICO, CONTRASEÑA], // Pasamos los valores en un array
  }
    );

    //jwt
    const token = jwt.sign(
      { CORREO_ELECTRONICO: CORREO_ELECTRONICO },
      process.env.Secret_key || "Repositorio_Documentos_2025",
      { expiresIn: "1h" }
    );

    //Respuesta al cliente
    return res.json({
      success: true,
      msg: resultado?.Mensaje || "Inicio de sesión exitoso",
      token,
    });
  } catch (error: any) {
    if (error.parent && error.parent.sqlState === "45000") {
      return res.status(400).json({
        msg: error.parent.sqlMessage || "Error en el login",
      });
    }

    console.error("Error: ", error);
    return res.status(500).json({
      msg: "Error del servidor",
    });
  }
};

//eliminar un Usuario mediante id
export const deleteUsuario = async (req: Request, res: Response) => {
  const { ID_USUARIO } = req.body;
  try {
    const deletedCount = await ms_usuarios.destroy({
      where: { ID_USUARIO: ID_USUARIO },
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        msg: `No se encontró un usuario con el ID ${ID_USUARIO}.`,
      });
    }
    res.json({
      msg: `Usuario con ID ${ID_USUARIO} eliminado exitosamente.`,
    });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({
      msg: "Error al eliminar el usuario.",
    });
  }
};

//Actualizar usuarios ;)
export const updateUsuario = async (req: Request, res: Response) => {
  const { ID_USUARIO, CONTRASEÑA, ...campos } = req.body;

  try {
    // Buscar usuario
    const usuario = await ms_usuarios.findOne({ where: { ID_USUARIO } });
    if (!usuario) {
      return res.status(404).json({ msg: `No se encontró un usuario con el ID ${ID_USUARIO}.` });
    }

    // Si se envía una nueva contraseña, encriptarla
    if (CONTRASEÑA) {
      campos.CONTRASEÑA = await CONTRASEÑA;
    }

    // Convertir valores a mayúsculas donde corresponda
    if (campos.USUARIO) campos.USUARIO = campos.USUARIO.toUpperCase();
    if (campos.NOMBRE_USUARIO) campos.NOMBRE_USUARIO = campos.NOMBRE_USUARIO.toUpperCase();
    if (campos.CORREO_ELECTRONICO) campos.CORREO_ELECTRONICO = campos.CORREO_ELECTRONICO.toUpperCase();
    if (campos.DIRECCION_1) campos.DIRECCION_1 = campos.DIRECCION_1.toUpperCase();
    if (campos.DIRECCION_2) campos.DIRECCION_2 = campos.DIRECCION_2.toUpperCase();
    
    // Si hay cambios, actualiza el usuario
    if (Object.keys(campos).length > 0) {
      await usuario.update(campos);
    }

    res.status(200).json({ msg: `Usuario con ID ${ID_USUARIO} actualizado correctamente.` });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ msg: "Error al actualizar el usuario." });
  }
};

//Traer usuario
export const getUsuarioEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        msg: `Debe proporcionar paramentros`,
      });
    }
    const user = await ms_usuarios.findOne({
      where: { CORREO_ELECTRONICO: email },
    });

    if (!email) {
      return res.status(404).json({
        msg: `Usuario no encontrado`,
      });
    }
    res.json(user);
  } catch (error) {
    console.error("Error buscr usuario: ", error);
    res.status(500).json({
      msg: `Error de servidor`,
    });
  }
};



// Genrar un código
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { correoE } = req.body;
    if (!correoE) {
      return res.status(400).json({
        msg: "El campo 'email' es requerido.",
      });
    }

    const user = await ms_usuarios.findOne({
      where: { CORREO_ELECTRONICO: correoE },
    });

    if (!user) {
      return res.status(404).json({
        msg: "No existe un usuario con ese correo.",
      });
    }

    // Generar el código y fecha de expiración 
    const code = generateCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await user.update({
      resetCode: code,
      resetCodeExpires: expires,
    });

    // Enviar el correo con Nodemailer
    await transporter.sendMail({
      from: process.env.EMAIL_USER, 
      to: correoE,
      subject: "Recuperación de contraseña",
      html: `<p>Estimado/a <strong>${user.NOMBRE_USUARIO}</strong>,</p>
    
      <p>Gracias por utilizar los servicios de la <strong>Universidad Nacional Autónoma de Honduras</strong>.</p>
      
      <p>Para continuar con el proceso de recuperación de su contraseña, por favor siga los siguientes pasos:</p>
      
      <ol>
        <li>Introduzca el siguiente código de recuperación en la página correspondiente:</li>
        <p><strong>Código de Recuperación: ${code}</strong></p>
        <li>Haga clic en el siguiente enlace para acceder a la página de verificación:<br>
        <a href="http://localhost:4200/ResetContrasena">http://localhost:4200/ResetContrasena</a></li>
      </ol>
      
      <p>Tenga en cuenta que este <strong>código expira en 15 minutos.</strong></p>
      
      <p>Si no ha solicitado la recuperación de su contraseña, por favor ignore este mensaje.</p>
      
      <p>Atentamente,<br>
      <strong>Universidad Nacional Autónoma de Honduras</strong></p>
      
         
      <div style="background-color: #333; color: #fff; text-align: center; padding: 10px 0; position: fixed; bottom: 0; width: 100%;">
        
        <p>© Derechos reservados Universidad Nacional Autónoma de Honduras 2025 Desarrollado por TechDesign.</p>
        <img src="https://eslared.net/sites/default/files/2020-06/unah_logo.png" alt="Logo UNAH" style="width: 50px; height: auto;">
  </div>`
    });

    return res.json({
      msg: "Código de recuperación enviado al correo.",
    });
  } catch (error) {
    console.error("Error en recuperacion de contraseña:", error);
    return res.status(500).json({
      msg: "Error del servidor al solicitar recuperación.",

      error
    });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { correoE, code, newContrasena } = req.body;
    if (!correoE || !code || !newContrasena) {
      return res.status(400).json({
        msg: "correo, codigo, y neueva Contraseña son requeridos."
      });
    }

    // Buscar usuario por correo
    const user = await ms_usuarios.findOne({
      where: { CORREO_ELECTRONICO: correoE },
    });
    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado."
      });
    }

    // Verificar que el código coincida
    if (user.getDataValue("resetCode") !== code) {
      return res.status(400).json({
        msg: "El código es inválido."
      });
    }

    // Verificar que no esté expirado
    const expires: Date | null = user.getDataValue("resetCodeExpires");
    if (!expires || expires.getTime() < Date.now()) {
      return res.status(400).json({
        msg: "El código ha expirado, solicita uno nuevo."
      });
    }

    // // Hashear la nueva contraseña
    // const hashedPassword = await bycryp.hash(newPassword, 10);

    // Actualizar la contraseña y limpiar el code
    await user.update({
      CONTRASEÑA: newContrasena,
      resetCode: null,
      resetCodeExpires: null,
    });

    return res.json({
      msg: "Contraseña restablecida correctamente."
    });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    return res.status(500).json({
      msg: "Error del servidor al restablecer la contraseña.",
      error
    });
  }
};
