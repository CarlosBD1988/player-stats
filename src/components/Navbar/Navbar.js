// src/components/Navbar/Navbar.js
import React,{useState} from "react";
import { Link, useNavigate  } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Importar el contexto de autenticación

function Navbar() {
  const { user ,logout } = useAuth(); // Acceder al estado del usuario autenticado
  const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // Manejo de submenús


   // Función para manejar el cierre de sesión
   const handleLogout = () => {
    logout(); // Borra el usuario del estado
    navigate("/SignIn"); // Redirige al login (o a "/" si prefieres la landing page)
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setOpenDropdown(null); // Cerrar cualquier submenú abierto
  };


  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  
  if (!user) {
    return null; // Si no hay usuario, no mostramos el navbar
  }

  return (
    <nav className="navbar">

              <div className="logo">
                <img src="/logoApp.ico" alt="Logo" />
              </div>


        <div className="menu-toggle" onClick={toggleMenu}>☰</div>


        <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
        
                  <li onClick={closeMenu}><Link to="/home">Inicio</Link></li>
                  
                  {['admin', 'tecnico'].includes(user?.role) && (
                  <>  
                    <li className="dropdown" onClick={() => toggleDropdown(1)}>
                      Acciones
                      <ul className={`dropdown-menu ${openDropdown === 1 ? "show" : ""}`}>
                        <li onClick={closeMenu}><Link to="/crear-jugador">Crear Jugador</Link></li>
                        <li onClick={closeMenu}><Link to="/crear-item">Crear Ítem</Link></li>
                        <li onClick={closeMenu}><Link to="/crear-registro">Crear Registro individual</Link></li>
                        <li onClick={closeMenu}><Link to="/confirmar-asistencia">Asistencia a partidos</Link></li>
                        <li onClick={closeMenu}><Link to="/crear-registros-masivo">Crear Registro multiples</Link></li>
                      </ul>
                    </li>
                  </>
                  )}


                    <li className="dropdown" onClick={() => toggleDropdown(2)}>
                      Métricas
                      <ul className="dropdown-menu">
                      {['admin', 'tecnico'].includes(user?.role) && (
                        <> 
                          <li onClick={closeMenu}><Link to="/crear-metrica">Agregar</Link></li>
                          <li onClick={closeMenu}><Link to="/por-jugador">Visualizar por jugador</Link></li>
                        </>
                      )}  
                      
                      {['admin','tecnico', 'jugador'].includes(user?.role) && (
                        <> 
                          <li onClick={closeMenu}><Link to="/individual">Mis Metricas</Link></li>
                      </>
                      )} 
                      </ul>
                    </li>

                    <li className="dropdown" onClick={() => toggleDropdown(3)}>
                      Estadísticas
                      <ul className="dropdown-menu">
                        <li onClick={closeMenu}><Link to="/ver-consolidado">Ver Consolidado</Link></li>
                      </ul>
                    </li>
        
                  {['admin','administrativo'].includes(user?.role) && ( 
                  <>         
                    <li className="dropdown" onClick={() => toggleDropdown(4)}>
                    Admin panel
                    <ul className="dropdown-menu">
                        
                        <li onClick={closeMenu}><Link to="/crear-categoria">Crear Categoria</Link></li>
                        <li onClick={closeMenu}><Link to="/crear-sede">Crear Sede</Link></li>    
                        <li onClick={closeMenu}><Link to="/crear-tecnico">Crear Tecnico</Link></li>    
                        <li onClick={closeMenu}><Link to="/crear-agenda">Publicar evento</Link></li>    
                        <li onClick={closeMenu}><Link to="/cargar-csv-players">Crear jugadores desde CSV</Link></li>               
                        <li onClick={closeMenu}><Link to="/gestionar-jugador">Administrar Jugadores</Link></li>               
                                      
                    </ul>
                  </li>        
                  </> )}

                  {user?.role === 'admin' && ( // Menu Auditoria solo visible para usuarios admin
                  <>         
                    <li className="dropdown" onClick={() => toggleDropdown(5)}>
                    Admin system
                    <ul className="dropdown-menu">          
                        <li onClick={closeMenu}><Link to="/crear-escuela">Crear nueva escuela</Link></li>
                        <li onClick={closeMenu}><Link to="/crear-usuario">Crear nuevo usuario del sistema</Link></li>
                        <li onClick={closeMenu}><Link to="/auditoria">Auditoria</Link></li>            
                    </ul>
                  </li>
                  
                  </> )}
      

                  <li className="dropdown">
                  {user ? (
                    <>
                      <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: "16px" }}>Bienvenido, {user.name} {user.lastname}</span><br />                      
                      <span style={{ color: "#FFD700" ,  fontSize: "12px" }}> {user.school && `Escuela: ${user.school}`}</span>        
                      <span style={{ color: "#FFD700",  fontSize: "12px" }}> - Rol: {user.role}</span>        <br /> <br />
                      <button onClick={handleLogout}> Cerrar sesión </button>
                      
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



