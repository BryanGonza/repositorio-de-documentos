import { DataTypes } from "sequelize";
import sequelize from "../database/conexion";

export const ms_usuarios = sequelize.define(
    //Tabla usuarios
    'ms_usuarios',
    {
        ID_USUARIO: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        NUM_IDENTIDAD: {type: DataTypes.INTEGER, unique: true, allowNull: false},
        ID_CARGO: {type: DataTypes.INTEGER, allowNull: true},
        DIRECCION_1: {type: DataTypes.STRING, allowNull: true},
        DIRECCION_2: {type: DataTypes.STRING, allowNull: true},
        USUARIO: {type: DataTypes.STRING, allowNull: true},
        NOMBRE_USUARIO: {type: DataTypes.STRING,  allowNull: false},
        ESTADO_USUARIO: {type: DataTypes.STRING, allowNull: true},
        CONTRASEÑA: {type: DataTypes.STRING, allowNull: false},
        ID_ROL: {type: DataTypes.INTEGER, allowNull: true},
        FECHA_ULTIMA_CONEXION: {type: DataTypes.DATE, allowNull: true},
        PREGUNTAS_CONTESTADAS: {type: DataTypes.STRING, allowNull: true},
        FECHA_CREACION: {type: DataTypes.DATE, unique: true, allowNull: true},
        CREADO_POR: {type: DataTypes.STRING, allowNull: true},
        FECHA_MODIFICACION: {type: DataTypes.DATE, allowNull: true},
        MODIFICADO_POR: {type: DataTypes.STRING, allowNull: true},
        PRIMER_INGRESO: {type: DataTypes.STRING, allowNull: true},
        FECHA_VENCIMIENTO: {type: DataTypes.DATE, allowNull: true},
        CORREO_ELECTRONICO: {type: DataTypes.STRING, unique: true, allowNull: false},
    }, {
        timestamps: false, // Desactivar createdAt y updatedAt 
        tableName: 'ms_usuarios',
        freezeTableName: true,
    
      }
)