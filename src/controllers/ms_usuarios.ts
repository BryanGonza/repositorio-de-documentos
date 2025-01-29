import { Request, Response } from "express"
import bycryp from 'bcrypt'
import { ms_usuarios } from "../models/ms_usuarios"
import { Op} from "sequelize"
import jwt from "jsonwebtoken"
import sequelize from "../database/conexion"



//Crear usuario
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

      const token = jwt.sign(
        { CORREO_ELECTRONICO: CORREO_ELECTRONICO },
        process.env.Secret_key || 'Repositorio_Documentos',
        { expiresIn: '1h' }
      );
  
  
      return res.json({
        msg: 'Login exitoso',
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