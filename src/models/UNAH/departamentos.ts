import { DataTypes } from "sequelize";
import sequelize from "../../database/conexion";


export const departamentos = sequelize.define(
    'Departamento',
    {
        ID_DEPARTAMENTO: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        ID_FACULTAD: {type: DataTypes.INTEGER,unique: true},
        NOMBRE: {type: DataTypes.STRING,allowNull: true},
        ESTADO: {type: DataTypes.BOOLEAN,allowNull: true}
    },
    {
        timestamps: false,
        tableName: 'departamentos',
        freezeTableName: true,
    }
);