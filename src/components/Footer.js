// src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        &copy; {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
    padding: "10px 0",
    position: "fixed",
    bottom: 0,
    width: "100%",
    boxShadow: "0 -2px 5px rgba(0,0,0,0.2)",
  },
  text: {
    margin: 0,
    fontSize: "14px",
  },
};

export default Footer;
