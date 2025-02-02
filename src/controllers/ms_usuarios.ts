import { Request, Response } from "express"
import bycryp from 'bcrypt'
import { ms_usuarios } from "../models/ms_usuarios"
import { Op, where} from "sequelize"
import jwt from "jsonwebtoken"
import sequelize from "../database/conexion"



//Registrar un usuario 
export const registrerUser = async (req: Request, res: Response) => {

    const {ID_USUARIO, NUM_IDENTIDAD, ID_CARGO, DIRECCION_1, DIRECCION_2, USUARIO, NOMBRE_USUARIO, ESTADO_USUARIO,
        CONTRASEÑA, ID_ROL, FECHA_ULTIMA_CONEXION, PREGUNTAS_CONTESTADAS, FECHA_CREACION, CREADO_POR, FECHA_MODIFICACION,
        MODIFICADO_POR, PRIMER_INGRESO, FECHA_VENCIMIENTO, CORREO_ELECTRONICO } = req.body
    
    const user = await ms_usuarios.findOne({where: { [Op.or]: {CORREO_ELECTRONICO: CORREO_ELECTRONICO, NUM_IDENTIDAD: NUM_IDENTIDAD}}})
    
   if(user){
       return res.status(400).json({
        msg: `Ya existe un usuario con email => ${CORREO_ELECTRONICO} o el numero de identidad ${NUM_IDENTIDAD}`
        
    })
   }

    // console.log("Estoy aqui...");
    const CONTRASEÑAHash = await bycryp.hash(CONTRASEÑA, 10)


 try {
     await ms_usuarios.create({ 
        ID_USUARIO: ID_USUARIO,
        NUM_IDENTIDAD: NUM_IDENTIDAD,
        ID_CARGO: ID_CARGO,
        DIRECCION_1: DIRECCION_1.toUpperCase(),
        DIRECCION_2: DIRECCION_2.toUpperCase(),
        USUARIO: USUARIO.toUpperCase(),
        NOMBRE_USUARIO: NOMBRE_USUARIO.toUpperCase(),
        ESTADO_USUARIO: ESTADO_USUARIO,
        CONTRASEÑA: CONTRASEÑA,
        ID_ROL: ID_ROL,
        FECHA_ULTIMA_CONEXION: FECHA_ULTIMA_CONEXION,
        PREGUNTAS_CONTESTADAS: PREGUNTAS_CONTESTADAS,
        FECHA_CREACION: FECHA_CREACION,
        CREADO_POR: CREADO_POR,
        FECHA_MODIFICACION: FECHA_MODIFICACION,
        MODIFICADO_POR: MODIFICADO_POR,
        PRIMER_INGRESO: PRIMER_INGRESO,
        FECHA_VENCIMIENTO: FECHA_VENCIMIENTO,
        CORREO_ELECTRONICO: CORREO_ELECTRONICO,
    })

    res.json({
        msg : `Usuario ${NOMBRE_USUARIO.toUpperCase()} creado correctamente...`
    })

 } catch (error) {
    res.status(400).json({
        msg: `Error al crear usuario ${NOMBRE_USUARIO.toUpperCase()}.`
    })
 }
}


//Get para traer todos los usuarios 
export const getUsuarios = async (req: Request, res: Response) => {
    const ListUsuarios = await ms_usuarios.findAll();
    res.json({ListUsuarios})
}
//Login de Usuario 
export const login = async (req: Request, res: Response) => {
    const { CORREO_ELECTRONICO, CONTRASEÑA } = req.body;
  
    try {
      const [resultado] = await sequelize.query(
        'CALL ValidarUsuario(:p_usuario, :p_contrasena);',
        {
          replacements: {
            p_usuario: CORREO_ELECTRONICO,
            p_contrasena: CONTRASEÑA
          }
        }
      );  

      //jwt
      const token = jwt.sign(
        { CORREO_ELECTRONICO: CORREO_ELECTRONICO },
        process.env.Secret_key || 'Repositorio_Documentos_2025',
        { expiresIn: '1h' }
      );
  
  
      //Respuesta al cliente
        res.json({
        success:'Inicio de secion exitoso',
        token
      });

    } catch (error: any) {
      if (error.parent && error.parent.sqlState === '45000') {
        return res.status(400).json({
          msg: error.parent.sqlMessage || 'Error en el login'
        });
      }
  
      console.error('Error: ', error);
      return res.status(500).json({
        msg: 'Error del servidor'
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
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({
            msg: 'Error al eliminar el usuario.',
        });
    }
};


//Actualizar usuarios ;)
export const updateUsuario = async (req: Request, res: Response) => {
  const {
    ID_USUARIO,
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
    FECHA_MODIFICACION,
    MODIFICADO_POR,
    PRIMER_INGRESO,
    FECHA_VENCIMIENTO,
    CORREO_ELECTRONICO,
  } = req.body;

  try {
    // Buscar el usuario por su id
    const usuario = await ms_usuarios.findOne({ where: { ID_USUARIO } });

    if (!usuario) {
      return res.status(404).json({
        msg: `No se encontró un usuario con el ID ${ID_USUARIO}.`,
      });
    }

    let nuevaContrasena = usuario.CONTRASEÑA;  
    if (CONTRASEÑA) {
        nuevaContrasena = (CONTRASEÑA);
      }
    // Para despues incriptar contraseña en caso de que se actualice 
    // if (CONTRASEÑA) {
    //   nuevaContrasena = await bycryp.hash(CONTRASEÑA, 10);
    // }

    // actualizar los campos que vienen en el body 
    await usuario.update({
      NUM_IDENTIDAD: NUM_IDENTIDAD ?? usuario.NUM_IDENTIDAD,
      ID_CARGO: ID_CARGO ?? usuario.ID_CARGO,
      DIRECCION_1: DIRECCION_1 ? DIRECCION_1.toUpperCase() : usuario.DIRECCION_1,
      DIRECCION_2: DIRECCION_2 ? DIRECCION_2.toUpperCase() : usuario.DIRECCION_2,
      USUARIO: USUARIO ? USUARIO.toUpperCase() : usuario.USUARIO,
      NOMBRE_USUARIO: NOMBRE_USUARIO ? NOMBRE_USUARIO.toUpperCase() : usuario.NOMBRE_USUARIO,
      ESTADO_USUARIO: ESTADO_USUARIO ?? usuario.ESTADO_USUARIO,
      ID_ROL: ID_ROL ?? usuario.ID_ROL,
      FECHA_ULTIMA_CONEXION: FECHA_ULTIMA_CONEXION ?? usuario.FECHA_ULTIMA_CONEXION,
      PREGUNTAS_CONTESTADAS: PREGUNTAS_CONTESTADAS ?? usuario.PREGUNTAS_CONTESTADAS,
      FECHA_MODIFICACION: FECHA_MODIFICACION ?? new Date(), 
      MODIFICADO_POR: MODIFICADO_POR ?? usuario.MODIFICADO_POR,
      PRIMER_INGRESO: PRIMER_INGRESO ?? usuario.PRIMER_INGRESO,
      FECHA_VENCIMIENTO: FECHA_VENCIMIENTO ?? usuario.FECHA_VENCIMIENTO,
      CORREO_ELECTRONICO: CORREO_ELECTRONICO ?? usuario.CORREO_ELECTRONICO,
    });

    res.status(200).json({
      msg: `Usuario con ID ${ID_USUARIO} actualizado correctamente.`,
   
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({
      msg: "Error al actualizar el usuario.",
    });
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
      const user = await ms_usuarios.findOne({ where: { CORREO_ELECTRONICO: email } });

      if (!email) {
        return res.status(404).json({
            msg: `Usuario no encontrado`,
        });
    }
    res.json(user)
  } catch (error) {
    console.error("Error buscr usuario: ", error);
    res.status(500).json({
      msg: `Error de servidor`
  });

  }
};




