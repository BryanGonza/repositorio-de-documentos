import { DataTypes } from 'sequelize';
import sequelize from '../../database/conexion';

// Modelo para la tabla tipo_documento_caracteristica
export const tipoDocumentoCaracteristica = sequelize.define(
  'tipo_documento_caracteristica',
  {
    ID_TIPO_DOCUMENTO_CARACTERISTICA: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    ID_CARACTERISTICA: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ID_DOCUMENTO: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    VALOR: {
      type: DataTypes.STRING(150),
      allowNull: true
    }
  },
  {
    tableName: 'tipo_documento_caracteristica',
    timestamps: false,
    freezeTableName: true
  }
);

// Asociaciones (FK)
tipoDocumentoCaracteristica.associate = (models: any) => {
  // Relacion con la tabla caracteristica
  tipoDocumentoCaracteristica.belongsTo(models.caracteristica, {
    foreignKey: 'ID_CARACTERISTICA',
    targetKey: 'ID_CARACTERISTICA',
    as: 'caracteristica'
  });
  // Relacion con la tabla documentos
  tipoDocumentoCaracteristica.belongsTo(models.documentos, {
    foreignKey: 'ID_DOCUMENTO',
    targetKey: 'ID_DOCUMENTO',
    as: 'documento'
  });
};
