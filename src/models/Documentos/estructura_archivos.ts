import { DataTypes } from "sequelize";
import sequelize from "../../database/conexion";


export const estructura_archivos = sequelize.define(
    'estructura_archivos',
    {
        ID_ESTRUCTURA_ARCHIVOS: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        ID_DEPARTAMENTO: {type: DataTypes.INTEGER,unique: true},
        ESPACIO_ALMACENAMIENTO: {type: DataTypes.BIGINT,allowNull: true},
        NOMBRE: {type: DataTypes.STRING,allowNull: true},
        UBICACION: {type: DataTypes.STRING,allowNull: true}
    },
    {
        timestamps: false,
        tableName: 'estructura_archivos',
        freezeTableName: true,
    }
);