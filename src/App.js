import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import CrearJugador from "./components/AddPlayer";
import CrearItem from "./components/AddItem";
import CrearRegistro from "./components/AddRecord";
import VerConsolidado from "./components/VerConsolidado";
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
              Estadísticas
              <ul className="dropdown-menu">
                <li><Link to="/ver-consolidado">Ver Consolidado</Link></li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* Rutas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crear-jugador" element={<CrearJugador />} />
          <Route path="/crear-item" element={<CrearItem />} />
          <Route path="/crear-registro" element={<CrearRegistro />} />
          <Route path="/ver-consolidado" element={<VerConsolidado />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
