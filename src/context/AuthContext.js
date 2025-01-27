// src/context/AuthContext.js
import React, { createContext, useState, useContext } from "react";

// Creamos el contexto de autenticación
const AuthContext = createContext();

// Componente que envuelve la app y provee el estado de autenticación
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Estado del usuario autenticado

  // Funciones de autenticación (puedes reemplazar estas funciones con las reales)
  const login = (userData) => {
    setUser(userData); // Establecer el usuario autenticado
  };

  const logout = () => {
    setUser(null); // Eliminar la sesión del usuario
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children} {/* Esto renderiza los componentes hijos de AuthProvider */}
    </AuthContext.Provider>
  );
}

// Custom hook para acceder fácilmente al contexto
export function useAuth() {
  return useContext(AuthContext); // Nos permite usar el contexto desde cualquier componente
}
