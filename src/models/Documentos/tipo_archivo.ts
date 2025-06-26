import { DataTypes } from "sequelize";
import sequelize from "../../database/conexion";

export const tipo_archivo = sequelize.define(
    'tipo_archivo',
    {
        ID_TIPO_ARCHIVO: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        TIPO_ARCHIVO: {type: DataTypes.STRING,allowNull: true},
        LIMITE_ALMACENAMIENTO: {type: DataTypes.BIGINT,allowNull: true},
    },
    {
        timestamps: false,
        tableName: 'tbl_tipo_archivo',
        freezeTableName: true,
    }
);