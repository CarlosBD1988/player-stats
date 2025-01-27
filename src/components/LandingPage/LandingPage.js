// src/components/LandingPage/LandingPage.js
import React from "react";
import { Link } from "react-router-dom";

import "./LandingPage.css"

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Sección Hero */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Bienvenido al Mundo del Fútbol</h1>
          <p>Donde la pasión y el talento se encuentran.</p>
          <div class="cta-btn-container">
          <Link to="/signin">
          <button class="cta-btn">Empieza a Explorar</button>
          </Link>
        </div>
        </div>
      </header>

      {/* Sección de Información */}
      <section className="info-section">
        <h2>Últimas Noticias</h2>
        <div className="cards-container">
          <div className="card">
            <h3>Nuevos Talentos</h3>
            <p>Descubre a las jóvenes promesas del fútbol mundial.</p>
          </div>
          <div className="card">
            <h3>Partidos en Vivo</h3>
            <p>No te pierdas los partidos más emocionantes.</p>
          </div>
          <div className="card">
            <h3>Entrenamientos</h3>
            <p>Aprende las técnicas de los mejores jugadores.</p>
          </div>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section className="contact-section">
        <h2>Contacto</h2>
        <p>¿Tienes alguna pregunta? ¡Contáctanos!</p>
        <form className="contact-form">
          <input type="text" placeholder="Nombre" required />
          <input type="email" placeholder="Correo Electrónico" required />
          <textarea placeholder="Mensaje" required></textarea>
          <button type="submit">Enviar</button>
        </form>
      </section>
    </div>
  );
};
export default LandingPage;