
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/conexion';


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

    ID_TIPO_DOCUMENTO: {
      type: DataTypes.INTEGER,
      allowNull: false

    }
  },
  {
    tableName: 'tbl_tipo_documento_caracteristica',
    timestamps: false,
    freezeTableName: true
  }
);


// Definición completa de asociaciones
export function setupTipoDocumentoCaracteristicaAssociations(models: any) {

  tipoDocumentoCaracteristica.belongsTo(models.caracteristica, {
    foreignKey: 'ID_CARACTERISTICA',
    targetKey: 'ID_CARACTERISTICA',
    as: 'caracteristica'
  });

  tipoDocumentoCaracteristica.belongsTo(models.tipo_documento, {
    foreignKey: 'ID_TIPO_DOCUMENTO',
    targetKey: 'ID_TIPO_DOCUMENTO',
    as: 'tipoDocumento'
  });
}

