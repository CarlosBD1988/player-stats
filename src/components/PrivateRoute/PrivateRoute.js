// src/components/PrivateRoute/PrivateRoute.js
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // Si no hay usuario autenticado, redirige al login
  if (!user) {
    return <Navigate to="/SignIn" />;
  }

  // Si el usuario está autenticado, renderiza el componente
  return children;
};

export default PrivateRoute;