import { DataTypes } from "sequelize";
import sequelize from "../database/conexion";

export const estado = sequelize.define(
    'estado',
    {
        ID_ESTADO: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        ESTADO: {type: DataTypes.STRING,allowNull: true},
      
    },
    {
        timestamps: false,
        tableName: 'estado',
        freezeTableName: true,
    }
);