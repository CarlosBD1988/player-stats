// src/components/PrivateRoute/PrivateRoute.js
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children ,allowedRoles = []}) => {
  const { user } = useAuth();

  // Si no hay usuario autenticado, redirige al login
  if (!user) {
    return <Navigate to="/SignIn" />;
  }

   // Si hay roles definidos y el usuario no tiene uno permitido, redirige
   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/no-autorizado" />; // Crea esta ruta
  }

  return children;
};

export default PrivateRoute;