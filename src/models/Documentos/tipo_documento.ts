import { DataTypes } from "sequelize";
import sequelize from "../../database/conexion";


export const tipo_documento = sequelize.define(
    'tipo_documento',
    {
        ID_TIPO_DOCUMENTO: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        TIPO_DOCUMENTO: {type: DataTypes.STRING,allowNull: true},
        ESTADO: {type: DataTypes.BOOLEAN,allowNull: true},
    },
    {
        timestamps: false,
        tableName: 'tbl_tipo_documento',
        freezeTableName: true,
    }
);