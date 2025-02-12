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
      <ul className="navbar-menu">
        <li><Link to="/home">Inicio</Link></li>
        
        {['admin', 'tecnico'].includes(user?.role) && (
        <>  
          <li className="dropdown">
            Acciones
            <ul className="dropdown-menu">
              <li><Link to="/crear-jugador">Crear Jugador</Link></li>
              <li><Link to="/crear-item">Crear Ítem</Link></li>
              <li><Link to="/crear-registro">Crear Registro individual</Link></li>
              <li><Link to="/confirmar-asistencia">Asistencia a partidos</Link></li>
              <li><Link to="/crear-registros-masivo">Crear Registro multiples</Link></li>
            </ul>
          </li>
        </>
        )}


        <li className="dropdown">
          Métricas
          <ul className="dropdown-menu">
          {['admin', 'tecnico'].includes(user?.role) && (
            <> 
              <li><Link to="/crear-metrica">Agregar</Link></li>
              <li><Link to="/por-jugador">Visualizar por jugador</Link></li>
            </>
          )}  
          
          {['admin','tecnico', 'jugador'].includes(user?.role) && (
            <> 
              <li><Link to="/individual">Mis Metricas</Link></li>
          </>
          )} 
          </ul>
        </li>

        <li className="dropdown">
          Estadísticas
          <ul className="dropdown-menu">
            <li><Link to="/ver-consolidado">Ver Consolidado</Link></li>
          </ul>
        </li>
        
        {['admin','administrativo'].includes(user?.role) && ( 
        <>         
          <li className="dropdown">
          Panel administrativo
          <ul className="dropdown-menu">
              
              <li><Link to="/crear-categoria">Crear Categoria</Link></li>
              <li><Link to="/crear-sede">Crear Sede</Link></li>    
              <li><Link to="/crear-tecnico">Crear Tecnico</Link></li>    
              <li><Link to="/crear-agenda">Publicar evento</Link></li>    
              <li><Link to="/cargar-csv-players">Crear jugadores desde CSV</Link></li>               
                            
          </ul>
        </li>        
        </> )}

        {user?.role === 'admin' && ( // Menu Auditoria solo visible para usuarios admin
        <>         
          <li className="dropdown">
          Admin del sistema
          <ul className="dropdown-menu">          
              <li><Link to="/crear-escuela">Crear nueva escuela</Link></li>
              <li><Link to="/crear-usuario">Crear nuevo usuario del sistema</Link></li>
              <li><Link to="/auditoria">Auditoria</Link></li>            
          </ul>
        </li>
        
        </> )}
      

        <li className="dropdown">
        {user ? (
          <>
            <li className="navbar-item">
              Bienvenido, {user.name} {user.lastname} - <strong>Rol: {user.role}</strong> 
            </li>
            <li className="navbar-item">
              <label onClick={handleLogout}> Cerrar sesión </label>
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



