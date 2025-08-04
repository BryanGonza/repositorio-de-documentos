import { Model, DataTypes } from "sequelize";
import sequelize from "../../database/conexion";
import { documentos } from "./Documentos.model";
import { tipoDocumentoCaracteristica } from "./TipoDocCaracteristica";

export class DocumentoCaracteristica extends Model {
  public ID_DOCUMENTO_CARACTERISTICA!: number;
  public ID_DOCUMENTO!: number;
  public ID_TIPO_DOCUMENTO_CARACTERISTICA!: number;
  public VALOR!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DocumentoCaracteristica.init(
  {
    ID_DOCUMENTO_CARACTERISTICA: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "ID_DOCUMENTO_CARACTERISTICA",
    },
    ID_DOCUMENTO: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "ID_DOCUMENTO",
    },
    ID_TIPO_DOCUMENTO_CARACTERISTICA: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'ID_TIPO_DOCUMENTO_CARACTERISTICA'
    },
    VALOR: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'VALOR'
    },
  },
  {
    tableName: "tbl_documento_caracteristica",
    sequelize,
    timestamps: false,
    underscored: false,
  }
);

// Relaciones
// Un documento puede tener muchas instancias de caracteristicas
documentos.hasMany(DocumentoCaracteristica, {
  foreignKey: "ID_DOCUMENTO",
  as: "caracteristicas",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});
DocumentoCaracteristica.belongsTo(documentos, {
  foreignKey: { name: "ID_DOCUMENTO", field: "ID_DOCUMENTO" },
  as: "documento",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

// La plantilla de caracteristica (definicion) tiene muchas instancias
tipoDocumentoCaracteristica.hasMany(DocumentoCaracteristica, {
  foreignKey: "ID_TIPO_DOCUMENTO_CARACTERISTICA",
  as: "instancias",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
DocumentoCaracteristica.belongsTo(tipoDocumentoCaracteristica, {
  foreignKey: {
    name: "ID_TIPO_DOCUMENTO_CARACTERISTICA",
    field: "ID_TIPO_DOCUMENTO_CARACTERISTICA",
  },
  as: "definicion",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

export default DocumentoCaracteristica;