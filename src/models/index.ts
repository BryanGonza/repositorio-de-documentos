import { departamentos } from './UNAH/departamentos';
import { categoria } from './Documentos/categoria';
import { s_categoria } from './Documentos/s_categoria';
import { clases } from './UNAH/clase';
import { tipo_archivo } from './Documentos/tipo_archivo';
import { caracteristica } from './Documentos/caracteristica';
import { permisos } from './permisos';
import { ms_objetos } from './objetos';
import { parametros } from './parametros';
import { ms_usuarios } from './ms_usuarios';
import { documentos } from './Documentos/Documentos.model';
import { documentoDet } from './Documentos/docuemtosDet';
import { documentoVersiones } from './Documentos/docVersion';
import { version } from './Documentos/version';
import { tipoDocumentoCaracteristica } from './Documentos/TipoDocCaracteristica';
import { tipo_documento } from './Documentos/tipo_documento';

// Asociaciones permisos
ms_objetos.hasMany(permisos, {
  foreignKey: 'ID_OBJETO',
  as: 'permisos'
});

// Asociaciones parámetros / usuarios
parametros.belongsTo(ms_usuarios, {
  foreignKey: 'ID_USUARIO',
  targetKey: 'ID_USUARIO'
});

// Documentos ↔ detalle
documentos.hasMany(documentoDet, {
  foreignKey: 'ID_DOCUMENTO',
  as: 'detalles'
});
documentoDet.belongsTo(documentos, {
  foreignKey: 'ID_DOCUMENTO',
  targetKey: 'ID_DOCUMENTO',
  as: 'documento'
});

// Detalle ↔ versiones
documentoDet.hasMany(documentoVersiones, {
  foreignKey: 'ID_DOCUMENTO_DET',
  as: 'versiones'
});
documentoVersiones.belongsTo(documentoDet, {
  foreignKey: 'ID_DOCUMENTO_DET',
  targetKey: 'ID_DOCUMENTO_DET',
  as: 'detalle'
});

// Versión ↔ documento_versiones
version.hasMany(documentoVersiones, {
  foreignKey: 'ID_VERSION',
  as: 'documentoVersiones'
});
documentoVersiones.belongsTo(version, {
  foreignKey: 'ID_VERSION',
  targetKey: 'ID_VERSION',
  as: 'version'
});

// Detalle ↔ dimensiones fijas
documentoDet.belongsTo(departamentos, {
  foreignKey: 'ID_DEPARTAMENTO',
  targetKey: 'ID_DEPARTAMENTO',
  as: 'departamento'
});
documentoDet.belongsTo(categoria, {
  foreignKey: 'ID_CATEGORIA',
  targetKey: 'ID_CATEGORIA',
  as: 'categoria'
});
documentoDet.belongsTo(s_categoria, {
  foreignKey: 'ID_SUB_CATEGORIA',
  targetKey: 'ID_SUB_CATEGORIA',
  as: 'subCategoria'
});
documentoDet.belongsTo(clases, {
  foreignKey: 'ID_CLASE',
  targetKey: 'ID_CLASE',
  as: 'clase'
});
documentoDet.belongsTo(tipo_archivo, {
  foreignKey: 'ID_TIPO_ARCHIVO',
  targetKey: 'ID_TIPO_ARCHIVO',
  as: 'tipoArchivo'
});



// AAACaracterística dinámica ↔ documentos
tipoDocumentoCaracteristica.belongsTo(tipo_documento, {
  foreignKey: 'ID_TIPO_DOCUMENTO',
  targetKey: 'ID_TIPO_DOCUMENTO',
  as: 'tipo_documento'
});

// Característica dinámica ↔ catálogo de características
tipoDocumentoCaracteristica.belongsTo(caracteristica, {
  foreignKey: 'ID_CARACTERISTICA',
  targetKey: 'ID_CARACTERISTICA',
  as: 'def'
});
// Característica dinámica ↔ detalle y versiones

tipoDocumentoCaracteristica.hasMany(documentoVersiones, {
  foreignKey: 'ID_TIPO_DOCUMENTO_CARACTERISTICA',
  as: 'versionesCaracteristica'
});



export {
  permisos,
  ms_objetos,
  parametros,
  ms_usuarios,
  documentos,
  documentoDet,
  documentoVersiones,
  version,
  tipoDocumentoCaracteristica,
  departamentos,
  categoria,
  s_categoria,
  clases,
  tipo_archivo,
  caracteristica
};
