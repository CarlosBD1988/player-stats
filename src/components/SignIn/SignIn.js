import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import "./SignIn.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const API_URL = process.env.REACT_APP_API_URL;

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user); // Guarda el usuario en el contexto
        localStorage.setItem("token", data.token); // Guarda el token en localStorage
        Swal.fire("Bienvenido", `¡Hola, ${data.user.name} ${data.user.lastname}!`, "success");
        navigate("/home");
      } else {
        Swal.fire("Error", data.error, "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSignIn}>
        <h2>Iniciar sesión</h2>
        <img src="logo.png" alt="Decorativo" className="log" />
        <div className="input-container">
          <label htmlFor="email">Usuario:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Ingresa tu Email" />
        </div>
        <div className="input-container">
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Ingresa tu contraseña" />
        </div>
        <button type="submit" disabled={loading} className="button-in">
          {loading ? "Iniciando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
