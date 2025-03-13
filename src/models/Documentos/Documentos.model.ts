import { DataTypes } from "sequelize";
import sequelize from "../../database/conexion";

export const documentos = sequelize.define(
    // Tabla documentos
    'documentos',
    {
        ID_DOCUMENTO: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        ID_USUARIO: {type: DataTypes.NUMBER, allowNull: false},
        ID_VERSION: {type: DataTypes.NUMBER, allowNull: true},
        ID_ESTADO: {type: DataTypes.NUMBER, allowNull: false},
        ID_TIPO_DOCUMENTO: {type: DataTypes.NUMBER, allowNull: true},
        NOMBRE: {type: DataTypes.STRING, allowNull: true},
        FORMATO: {type: DataTypes.STRING, allowNull: true},
        URL: {type: DataTypes.STRING, allowNull: true},
        URl_DOW: {type: DataTypes.STRING, allowNull: true},
        FECHA_SUBIDA: {type: DataTypes.DATE, allowNull: true},
        DRIVE_ID: {type: DataTypes.STRING, allowNull: true}
    }, {
        timestamps: false, // Desactivar createdAt y updatedAt 
        tableName: 'documentos',
        freezeTableName: true,
      }
);