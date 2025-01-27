// src/components/Navbar/Navbar.js
import React from "react";
import { Link, useNavigate  } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Importar el contexto de autenticación

function Navbar() {
  const { user ,logout } = useAuth(); // Acceder al estado del usuario autenticado
  const navigate = useNavigate();

   // Función para manejar el cierre de sesión
   const handleLogout = () => {
    logout(); // Borra el usuario del estado
    navigate("/SignIn"); // Redirige al login (o a "/" si prefieres la landing page)
  };
  
  if (!user) {
    return null; // Si no hay usuario, no mostramos el navbar
  }

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">Player Stats</Link>
      <ul className="navbar-menu">
        <li><Link to="/home">Inicio</Link></li>
        <li className="dropdown">
          Acciones
          <ul className="dropdown-menu">
            <li><Link to="/crear-jugador">Crear Jugador</Link></li>
            <li><Link to="/crear-item">Crear Ítem</Link></li>
            <li><Link to="/crear-registro">Crear Registro</Link></li>
            <li><Link to="/confirmar-asistencia">Asistencia a partidos</Link></li>
          </ul>
        </li>

        <li className="dropdown">
          Métricas
          <ul className="dropdown-menu">
            <li><Link to="/crear-metrica">Agregar</Link></li>
            <li><Link to="/por-jugador">Visualizar</Link></li>
          </ul>
        </li>

        <li className="dropdown">
          Estadísticas
          <ul className="dropdown-menu">
            <li><Link to="/ver-consolidado">Ver Consolidado</Link></li>
          </ul>
        </li>
        
        {user?.role === 'admin' && ( // Menu Auditoria solo visible para usuarios admin
        <>         
          <li className="dropdown">
          Auditoría
          <ul className="dropdown-menu">
            <li><Link to="/auditoria">Ver Movimientos</Link></li>
          </ul>
        </li>
        
        </> )}
      

        <li className="dropdown">
        {user ? (
          <>
            <li className="navbar-item">
              Bienvenido, {user.name} {user.lastname}
            </li>
            <li className="navbar-item">
              <button onClick={handleLogout}>Cerrar sesión</button>
            </li>
          </>
        ) : (
          <li className="navbar-item">
            <Link to="/SignIn">Iniciar sesión</Link>
          </li>
        )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
