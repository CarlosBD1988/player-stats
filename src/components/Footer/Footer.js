// src/components/Footer.js
import React from "react";
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <p className="text">
        &copy; {new Date().getFullYear()} Statistics Football. Todos los derechos reservados.
      </p>
    </footer>
  );
};


export default Footer;
