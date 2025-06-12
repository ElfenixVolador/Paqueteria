export const tienePermiso = (modulo, accion) => {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario?.permisos) return false;

    return usuario.permisos.some(p => p.modulo === modulo && p.accion === accion);
  } catch (e) {
    return false;
  }
};
