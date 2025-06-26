import { DataTypes } from "sequelize";
import sequelize from "../../database/conexion";


export const categoria = sequelize.define(
    'categoria',
    {
        ID_CATEGORIA: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        CATEGORIA: {type: DataTypes.STRING,allowNull: true},
        ESTADO: {type: DataTypes.BOOLEAN,allowNull: true},
    },
    {
        timestamps: false,
        tableName: 'tbl_categoria',
        freezeTableName: true,
    }
);