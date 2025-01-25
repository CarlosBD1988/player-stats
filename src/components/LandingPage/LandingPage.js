// src/components/LandingPage/LandingPage.js
import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landing-page">
      <h1>Bienvenido a Player Stats</h1>
      <p>Conoce las estadísticas de tus jugadores y equipos de fútbol</p>
      <Link to="/signin">
        <button>Iniciar sesión</button>
      </Link>
    </div>
  );
}

export default LandingPage;
