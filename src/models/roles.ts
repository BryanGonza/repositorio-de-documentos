import { DataTypes } from "sequelize";
import sequelize from "../database/conexion";

export const ms_roles = sequelize.define(
    'ms_roles',
    {
        ID_ROL: {
            type: DataTypes.INTEGER,
            primaryKey: true,
 
        },
        ROL: {type: DataTypes.STRING, allowNull: true},
        DESCRIPCION: {type: DataTypes.STRING, allowNull: true},
        FECHA_CREACION: {type: DataTypes.DATE, allowNull: true},
        CREADO_POR: {type: DataTypes.STRING, allowNull: true},
        FECHA_MODIFICACION: {type: DataTypes.DATE, allowNull: true},
        MODIFICADO_POR: {type: DataTypes.STRING, allowNull: true},
    },
    {
        timestamps: false, // Desactivar createdAt y updatedAt 
        tableName: 'tbl_roles',
        freezeTableName: true,
    }
);
