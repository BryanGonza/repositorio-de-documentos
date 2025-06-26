import { DataTypes } from "sequelize";
import sequelize from "../../database/conexion";
import { Model } from "sequelize/types";
export const caracteristica = sequelize.define(
    'caracteristica',
    {
        ID_CARACTERISTICA: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        ID_TIPO_CARACTERISTICA: {type: DataTypes.STRING,unique: true},
        CARACTERISTICA: {type: DataTypes.STRING,allowNull: true},
        VALORES_PREDETERMINADOS: {type: DataTypes.BOOLEAN,allowNull: true}
    },
    {
        
        timestamps: false,
        tableName: 'tbl_caracteristica',
        freezeTableName: true,
    }
);