import { DataTypes } from "sequelize";
import sequelize from "../../database/conexion";

// Modelo para la tabla documentos_det (detalle de documentos)
export const documentoDet = sequelize.define(
  "documentos_det",
  {
    ID_DOCUMENTO_DET: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ID_DOCUMENTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_DEPARTAMENTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_CLASE: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ID_ESTRUCTURA_ARCHIVOS: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_TIPO_ARCHIVO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_TIPO_DOCUMENTO_CARACTERISTICA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_CATEGORIA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_SUB_CATEGORIA: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    FORMATO: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    NOMBRE: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    tableName: "documentos_det",
    timestamps: false,
    freezeTableName: true,
  }
);

// Asociaciones 
documentoDet.associate = (models: any) => {
  documentoDet.belongsTo(models.documentos, {
    foreignKey: "ID_DOCUMENTO",
    targetKey: "ID_DOCUMENTO",
    as: "documento",
  });
  documentoDet.belongsTo(models.departamentos, {
    foreignKey: "ID_DEPARTAMENTO",
    targetKey: "ID_DEPARTAMENTO",
    as: "departamento",
  });
  documentoDet.belongsTo(models.clase, {
    foreignKey: "ID_CLASE",
    targetKey: "ID_CLASE",
    as: "clase",
  });
  documentoDet.belongsTo(models.estructura_archivos, {
    foreignKey: "ID_ESTRUCTURA_ARCHIVOS",
    targetKey: "ID_ESTRUCTURA_ARCHIVOS",
    as: "estructuraArchivo",
  });
  documentoDet.belongsTo(models.tipo_archivo, {
    foreignKey: "ID_TIPO_ARCHIVO",
    targetKey: "ID_TIPO_ARCHIVO",
    as: "tipoArchivo",
  });
  documentoDet.belongsTo(models.tipo_documento_caracteristica, {
    foreignKey: "ID_TIPO_DOCUMENTO_CARACTERISTICA",
    targetKey: "ID_TIPO_DOCUMENTO_CARACTERISTICA",
    as: "caracteristica",
  });
  documentoDet.belongsTo(models.categoria, {
    foreignKey: "ID_CATEGORIA",
    targetKey: "ID_CATEGORIA",
    as: "categoria",
  });
  documentoDet.belongsTo(models.sub_categoria, {
    foreignKey: "ID_SUB_CATEGORIA",
    targetKey: "ID_SUB_CATEGORIA",
    as: "subCategoria",
  });
};
