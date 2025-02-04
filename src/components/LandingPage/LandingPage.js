// src/components/LandingPage/LandingPage.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from 'emailjs-com'; // Importar emailjs
import "./LandingPage.css"

const LandingPage = () => {
  // Estado para manejar los datos del formulario de contacto
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("");

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Función para enviar el formulario de contacto con EmailJS
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Enviar el formulario utilizando EmailJS
    emailjs
      .sendForm('service_13kga4d', 'template_q27dhsg', e.target, 'Hql733UlLJTI3erVb')
      .then(
        (result) => {
          setStatus("¡Mensaje enviado con éxito!");
          setFormData({ name: "", email: "", message: "" }); // Limpiar el formulario
        },
        (error) => {
          setStatus("Error al enviar el mensaje. Inténtalo nuevamente.");
        }
      );
  };

  return (
    <div className="landing-page">
     
      <div className="cta-btn-container">
            <Link to="/signin">
              <button className="cta-btn">Empieza a Explorar</button>
            </Link>
      {/* Sección Hero */}
        </div>
      <header className="hero-section">
        <div className="hero-content">
          <img src="logo.png" alt="Decorativo" className="Log-landingp" />
          <h1>Bienvenido al Mundo del Fútbol</h1>
          <p>Donde la pasión y el talento se encuentran.</p>
        </div>
      </header>

      {/* Sección de Categorías */}
      <section className="info-section">
        <h2>Explora las Categorías</h2>
        <div className="cards-container">
          <div className="card">
            <button type="submit">Partidos en Vivo</button>
            <img src="images/tv.png" alt="Decorativo" className="img-card" />
            <p>No te pierdas los partidos más emocionantes.</p>
          </div>
          <div className="card">
          <button type="submit">Fichajes</button>
          <img src="images/ficha.png" alt="Decorativo" className="img-card" />
            <p>Entérate de las últimas incorporaciones al fútbol mundial.</p>
          </div>
          <div className="card">
          <button type="submit">Noticias</button>
          <img src="images/noti.png" alt="Decorativo" className="img-card" />
            <p>Las últimas noticias sobre equipos y jugadores.</p>
          </div>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section className="contact-section">
        <h2>Contacto</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name" 
            placeholder="Nombre" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Correo Electrónico" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <textarea 
            name="message" 
            placeholder="Mensaje" 
            value={formData.message} 
            onChange={handleChange} 
            required
          ></textarea>
          <button type="submit">Enviar</button>
        </form>
        {status && <p>{status}</p>}
      </section>
    </div>
  );
};

export default LandingPage;