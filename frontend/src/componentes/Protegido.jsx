import React from 'react';
import { tienePermiso } from '../utils/permisos';

const Protegido = ({ modulo, accion, children }) => {
  if (!tienePermiso(modulo, accion)) {
    return <h1 className="text-red-500 p-4">Acceso denegado</h1>;
  }

  return <>{children}</>;
};

export default Protegido;
