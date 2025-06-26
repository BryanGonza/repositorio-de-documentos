import { DataTypes } from "sequelize";
import sequelize from "../../database/conexion";

export const tipo_caracteristica = sequelize.define(
    'tipo_caracteristica',
    {
        ID_TIPO_CARACTERISTICA: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        TIPO_CARACTERISTICA: {type: DataTypes.STRING,allowNull: true}
    },
    {
        timestamps: false,
        tableName: 'tbl_tipo_caracteristica',
        freezeTableName: true,
    }
);