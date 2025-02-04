import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { db } from '../../config/firebaseConfig'; // Asegúrate de tener esta configuración
import { collection, getDocs, query, where } from 'firebase/firestore';



import './SignIn.css'; // Importando el archivo de estilos CSS

const LoginForm = () => {
  // Estado para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  const { login } = useAuth();
  const navigate = useNavigate(); // Para redirigir al menú
  const [loading, setLoading] = useState(false)


  // Manejo del envío del formulario
  const handleSignIn  = async (event) => {
    event.preventDefault(); 
    setLoading(true);
    try {
      // Buscar en la base de datos de Firebase
      const q = query(collection(db, 'Users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        // Verificar la contraseña (Asegúrate de encriptarla en producción)
        if (user.password === password) {
          login(user); // Guardar el usuario en el contexto de autenticación
          Swal.fire('Bienvenido', `¡Hola, ${user.name} ${user.lastname}!`, 'success');
          navigate('/home'); // Redirigir al menú principal o a donde desees
        } else {
          Swal.fire('Error', 'Las credenciales son incorrectas', 'error');
        }
      } else {
        Swal.fire('Error', 'Las credenciales son incorrectas', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error al intentar iniciar sesión', 'error');
    }
    
    setLoading(false);






  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSignIn }>      
        <h2>Iniciar sesión</h2> 
        <img src="logo.png" alt="Decorativo" className="log" />       
        <div className="input-container">
          <label htmlFor="email">Usuario:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}  required placeholder="Ingresa tu Email"/>
        </div>
        <div className="input-container">
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Ingresa tu contraseña"/>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;