import React, { useState } from 'react';
import './SignIn.css'; // Importando el archivo de estilos CSS

const LoginForm = () => {
  // Estado para los campos del formulario
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Manejo del envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault(); // Evitar recarga de página
    console.log('Usuario:', username);
    console.log('Contraseña:', password);
    // Aquí puedes agregar lógica para autenticar al usuario
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>      
        <h2>Iniciar sesión</h2> 
        <img src="logo.png" alt="Decorativo" className="log" />       
        <div className="input-container">
          <label htmlFor="username">Usuario:</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            placeholder="Ingresa tu usuario"
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Ingresa tu contraseña"
          />
        </div>
        <button type="submit" className="submit-btn">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default LoginForm;