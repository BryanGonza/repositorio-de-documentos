import { DataTypes } from "sequelize";
import sequelize from "../../database/conexion";


export const s_categoria = sequelize.define(
    'sub_categoria',
    {
        ID_SUB_CATEGORIA: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        ID_CATEGORIA: {type: DataTypes.INTEGER,allowNull: true},
        SUB_CATEGORIA: {type: DataTypes.INTEGER,allowNull: true},
        ESTADO: {type: DataTypes.BOOLEAN,allowNull: true},
    },
    {
        timestamps: false,
        tableName: 'sub_categoria',
        freezeTableName: true,
    }
);