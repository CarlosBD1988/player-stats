import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home/Home";
import CrearJugador from "./components/AddPlayer/AddPlayer";
import CrearItem from "./components/AddItem/AddItem";
import CrearRegistro from "./components/AddRecord/AddRecord";
import AddMetrics from "./components/AddMetrics/AddMetrics";

import VerConsolidado from "./components/VerConsolidado";
import MetricsPlayer from "./components/MetricsPlayer/MetricsPlayer";

import Audit from "./components/Audit/Audit";

import Footer from "./components/Footer/Footer";

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
              <Link to="/">Home</Link>
            </li>
            <li className="dropdown">
              Actions
              <ul className="dropdown-menu">
                <li><Link to="/crear-jugador">Crear Jugador</Link></li>
                <li><Link to="/crear-item">Crear Ítem</Link></li>
                <li><Link to="/crear-registro">Crear Registro</Link></li>
                
              </ul>
            </li>

            <li className="dropdown">
              Metricas
              <ul className="dropdown-menu">
                    <li><Link to="/crear-metrica">Agregar metrica a jugador</Link></li>
                   <li><Link to="/por-jugador">Atributos básicos del jugador</Link></li>
              </ul>
            </li>



            <li className="dropdown">
              Estadísticas
              <ul className="dropdown-menu">
                  <li><Link to="/ver-consolidado">Ver Consolidado</Link></li>                   
              </ul>
            </li>
            <li className="dropdown">
              Auditoria  del sistema
              <ul className="dropdown-menu">
                <li><Link to="/auditoria">Ver movimientos</Link></li>
              </ul>
            </li>
          </ul>
        </nav>
        <Footer />
        {/* Rutas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crear-jugador" element={<CrearJugador />} />
          <Route path="/crear-item" element={<CrearItem />} />
          <Route path="/crear-registro" element={<CrearRegistro />} />
          <Route path="/crear-metrica" element={<AddMetrics />} />

          <Route path="/ver-consolidado" element={<VerConsolidado />} />
          <Route path="/por-jugador" element={< MetricsPlayer/>} />
          <Route path="/auditoria" element={<Audit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

