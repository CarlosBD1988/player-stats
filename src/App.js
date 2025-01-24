import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./components/Home/Home";
import AddJugador from "./components/AddPlayer/AddPlayer";
import AddItem from "./components/AddItem/AddItem";
import AddRecord from "./components/AddRecord/AddRecord";
import AddMetrics from "./components/AddMetrics/AddMetrics";
import VerConsolidado from "./components/ViewConsolidateStatics/ViewConsolidateStatics";
import MetricsPlayer from "./components/MetricsPlayer/MetricsPlayer";
import Audit from "./components/Audit/Audit";
import Footer from "./components/Footer/Footer";
import MatchAttendance from "./components/MatchAttendance/MatchAttendance";
import SignIn from "./components/SignIn/SignIn";


import "./App.css";


function App() {
  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav className="navbar">
          <Link to="/" className="navbar-brand">Player Stats</Link>
          <ul className="navbar-menu">
            <li>
              <Link to="/">Inicio</Link>
            </li>
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
              Metricas
              <ul className="dropdown-menu">
                    <li><Link to="/crear-metrica">Agregar </Link></li>
                    <li><Link to="/por-jugador">Visualizar </Link></li>
              </ul>
            </li>



            <li className="dropdown">
              Estadísticas
              <ul className="dropdown-menu">
                  <li><Link to="/ver-consolidado">Ver Consolidado</Link></li>                   
              </ul>
            </li>
            <li className="dropdown">
              Auditoria
              <ul className="dropdown-menu">
                <li><Link to="/auditoria">Ver Movimientos</Link></li>
              </ul>
            </li>
            <li className="dropdwon">
             Login
              <ul className="dropdown-menu">
              <li><Link to="/SignIn">Login</Link></li>
              </ul>
            </li>
          </ul>
        </nav>
        <Footer />
        {/* Rutas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crear-jugador" element={<AddJugador />} />
          <Route path="/crear-item" element={<AddItem />} />
          <Route path="/crear-registro" element={<AddRecord />} />
          <Route path="/crear-metrica" element={<AddMetrics />} />
          <Route path="//confirmar-asistencia" element={<MatchAttendance />} />


          

          <Route path="/ver-consolidado" element={<VerConsolidado />} />
          <Route path="/por-jugador" element={< MetricsPlayer/>} />
          <Route path="/auditoria" element={<Audit />} />
          <Route path="/SignIn" element={<SignIn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

