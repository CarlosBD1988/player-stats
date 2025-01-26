// src/components/LandingPage/LandingPage.js
import React from "react";
import { Link } from "react-router-dom";

import "./LandingPage.css"

function LandingPage() {
  return (
    <div className="landing-page">
        <div class="welcome-container">
            <h1>¡Bienvenido a <span class="app-name">Player Stats</span>! ⚽️</h1>
            <p>
            Descubre una plataforma avanzada para gestionar y analizar estadísticas deportivas, creada especialmente para potenciar el desempeño de los jugadores de nuestra escuela de fútbol.
            </p>
            <h3>📊 <strong>Qué puedes hacer aquí:</strong></h3>
            <ul>
              <li>🔍 Analiza tu progreso con estadísticas detalladas.</li>
              <li>📈 Visualiza métricas clave de rendimiento.</li>
              <li>🎯 Mejora con información personalizada.</li>
            </ul>
            <p class="cta-text">
              💪 <strong>Nuestro objetivo es tu crecimiento deportivo.</strong> Esta herramienta está hecha para ayudarte a alcanzar tu máximo potencial.
            </p>

            <p class="cta-text">
                Lleva tu rendimiento al siguiente nivel con nuestra herramienta exclusiva para el desarrollo deportivo. ¡Transformemos los datos en éxitos!
            </p>
            <p class="final-message">
              ¡Comencemos a transformar datos en éxitos deportivos!
            </p>
        </div>

        <div class="cta-btn-container">
          <Link to="/signin">
          <button class="cta-btn">Empieza a Explorar</button>
          </Link>
        </div>
     
    </div>
  );
}

export default LandingPage;
