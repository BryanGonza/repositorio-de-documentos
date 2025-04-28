import { DataTypes } from 'sequelize';
import sequelize from '../../database/conexion';

// Modelo para la tabla "documentos_versiones"
export const documentoVersiones = sequelize.define(
  'documentos_versiones', // nombre real de la tabla en la base
  {
    ID_DOCUMENTO_VERSIONES: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    ID_VERSION: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ID_DOCUMENTO_DET: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    FECHA_DESDE: {
      type: DataTypes.DATE,
      allowNull: false
    },
    FECHA_HASTA: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ESTADO: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    DESCRIPCION: {
      type: DataTypes.STRING(150),
      allowNull: true
    }
  },
  {
    tableName: 'documentos_versiones',
    timestamps: false,
    freezeTableName: true
  }
);

// Asociaciones (FK)
documentoVersiones.associate = (models: any) => {
  // Relacion con tabla 'version' (modelo 'version')
  documentoVersiones.belongsTo(models.version, {
    foreignKey: 'ID_VERSION',
    targetKey: 'ID_VERSION',
    as: 'version'
  });
  // Relacion con tabla 'documentos_det' (modelo 'documentoDet')
  documentoVersiones.belongsTo(models.documentoDet, {
    foreignKey: 'ID_DOCUMENTO_DET',
    targetKey: 'ID_DOCUMENTO_DET',
    as: 'detalle'
  });
};
