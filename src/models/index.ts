// models/index.ts
import { permisos } from './permisos';
import { ms_objetos } from './objetos';

// Ya definiste la asociación en permisos.ts, pero si querés también definir la inversa:
ms_objetos.hasMany(permisos, {
  foreignKey: 'ID_OBJETO',
  as: 'permisos'
});

export { permisos, ms_objetos };
