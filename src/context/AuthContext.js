// src/context/AuthContext.js
import React, { createContext, useState, useContext } from "react";

// Creamos el contexto de autenticación
const AuthContext = createContext();

// Componente que envuelve la app y provee el estado de autenticación
export function AuthProvider({ children }) {
    
    const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
  });


  const login = (userData) => {
    setUser(userData); 
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateSchoolId = (schoolId) => {
    if (user) {
      const updatedUser = { ...user, schoolId }; // Solo actualizamos schoolId
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Guardar cambio en localStorage
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout,updateSchoolId }}>
      {children} {/* Esto renderiza los componentes hijos de AuthProvider */}
    </AuthContext.Provider>
  );
}

// Custom hook para acceder fácilmente al contexto
export function useAuth() {
  return useContext(AuthContext); // Nos permite usar el contexto desde cualquier componente
}
