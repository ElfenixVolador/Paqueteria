import { Navigate, useLocation } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const location = useLocation();

  if (!usuario || usuario.rol !== 'admin') {
    alert('⚠️ Acceso denegado: solo el administrador puede acceder a esta sección.');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAdmin;
