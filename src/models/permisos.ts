import { DataTypes } from "sequelize";
import sequelize from "../database/conexion";
import { ms_objetos } from "./objetos";

export const permisos = sequelize.define('TBL_PERMISOS', {
  ID_PERMISO: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  ID_ROL: { type: DataTypes.INTEGER, allowNull: false },
  ID_OBJETO: { type: DataTypes.INTEGER, allowNull: false },
  PERMISO_INSERCION: { type: DataTypes.STRING, allowNull: true },
  PERMISO_ELIMINACION: { type: DataTypes.STRING, allowNull: true },
  PERMISO_ACTUALIZACION: { type: DataTypes.STRING, allowNull: true },
  PERMISO_CONSULTAR: { type: DataTypes.STRING, allowNull: true },
  CREADO_POR: { type: DataTypes.STRING, allowNull: true },
  MODIFICADO_POR: { type: DataTypes.STRING, allowNull: true },
  FECHA_CREACION: { type: DataTypes.DATE, allowNull: true },
  FECHA_MODIFICACION: { type: DataTypes.DATE, allowNull: true }
}, {
  timestamps: false,
  tableName: 'TBL_PERMISOS',
  freezeTableName: true,
});

// Definir la relación con el alias correcto
permisos.belongsTo(ms_objetos, {
  foreignKey: 'ID_OBJETO',
  as: 'objeto'  // ESTE es el alias que usaremos
});
