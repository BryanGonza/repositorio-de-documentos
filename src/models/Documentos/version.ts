import { DataTypes } from "sequelize";
import sequelize from "../../database/conexion";


export const version = sequelize.define(
    'version',
    {
        ID_VERSION: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        ID_USUARIO: {type: DataTypes.INTEGER,unique: true},
        NOMBRE: {type: DataTypes.INTEGER,allowNull: true},
        CAMBIOS: {type: DataTypes.BOOLEAN,allowNull: true},
        FECHA_ACTU: {type: DataTypes.DATE,allowNull: true},
    },
    {
        timestamps: false,
        tableName: 'version',
        freezeTableName: true,
    }
);