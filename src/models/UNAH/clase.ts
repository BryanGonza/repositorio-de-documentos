import { DataTypes } from "sequelize";
import sequelize from "../../database/conexion";

export const clases = sequelize.define(
    'clase',
    {
        ID_CLASE: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        NOMBRE: {type: DataTypes.STRING,allowNull: true},
        APROBADO: {type: DataTypes.STRING,allowNull: true},
        RECEPCIONADO: {type: DataTypes.STRING,allowNull: true},
        FORMATO: {type: DataTypes.STRING,allowNull: true},
        ESTADO: {type: DataTypes.BOOLEAN,allowNull: true}
    },
    {
        timestamps: false,
        tableName: 'tbl_clase',
        freezeTableName: true,
    }
);