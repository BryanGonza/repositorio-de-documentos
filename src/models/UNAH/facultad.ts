import { DataTypes } from "sequelize";
import sequelize from "../../database/conexion";


export const Facultad = sequelize.define(
    'Facultad',
    {
        ID_FACULTAD: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        NOMBRE: {type: DataTypes.STRING,allowNull: true},
        DESCRIPCION: {type: DataTypes.STRING,allowNull: true},
        ESTADO: {type: DataTypes.BOOLEAN,allowNull: true}
    },
    {
        timestamps: false,
        tableName: 'tbl_facultad',
        freezeTableName: true,
    }
);
