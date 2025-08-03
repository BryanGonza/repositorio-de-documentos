import { DataTypes } from "sequelize";
import sequelize from "../database/conexion";

export const ms_objetos = sequelize.define(
  'ms_objetos',
  {
    ID_OBJETO: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    OBJETO: { type: DataTypes.STRING, allowNull: true },
    TIPO_OBJETO: { type: DataTypes.STRING, allowNull: true },
    DESCRIPCION: { type: DataTypes.STRING, allowNull: true },
    FECHA_CREACION: { type: DataTypes.DATE, allowNull: true },
    CREADO_POR: { type: DataTypes.STRING, allowNull: true },
    FECHA_MODIFICACION: { type: DataTypes.DATE, allowNull: true },
    MODIFICADO_POR: { type: DataTypes.STRING, allowNull: true },
  },
  {
    timestamps: false,
    tableName: 'tbl_objetos',
    freezeTableName: true,
  }
);
