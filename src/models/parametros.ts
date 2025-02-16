import { DataTypes } from "sequelize";
import sequelize from "../database/conexion";

export const parametros = sequelize.define(
  //Tabla parametros
  "parametros",
  {
    ID_PARAMETRO: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    PARAMETRO: { type: DataTypes.STRING, allowNull: true },
    VALOR: { type: DataTypes.STRING, allowNull: true },
    ADMIN_INTENTOS_INVALIDOS: { type: DataTypes.INTEGER, allowNull: true },
    ID_USUARIO: { type: DataTypes.INTEGER, allowNull: true },
    FECHA_CREACION: { type: DataTypes.DATE, allowNull: true },
    FECHA_MODIFICACION: { type: DataTypes.DATE, allowNull: true },
  },
  {
    timestamps: false, // Desactivar createdAt y updatedAt
    tableName: "parametros",
    freezeTableName: true,
  }
);
