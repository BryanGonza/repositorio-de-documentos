// models/index.ts
import { permisos } from './permisos';
import { ms_objetos } from './objetos';
import { parametros } from './parametros';
import { ms_usuarios } from './ms_usuarios';

ms_objetos.hasMany(permisos, {
  foreignKey: 'ID_OBJETO',
  as: 'permisos'
});


parametros.belongsTo(ms_usuarios, {
  foreignKey: 'ID_USUARIO',
  targetKey: 'ID_USUARIO',
});
export { permisos, ms_objetos, parametros, ms_usuarios };
