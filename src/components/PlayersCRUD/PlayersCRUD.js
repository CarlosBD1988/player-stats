import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useAuth } from "../../context/AuthContext"; // Importar el contexto de autenticación

import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;

const PlayersCRUD = () => {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth(); // Acceder al estado del usuario autenticado

  const fetchPlayers = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/players/list-players/${user.schoolId}`);
      
      if (!response.ok) {      
        const errorData = await response.json();
        console.warn("Error en la respuesta:", errorData.message);
        setPlayers([]); 
        return;
      }

      const data = await response.json();   

      if (Array.isArray(data)) {
        setPlayers(data);
      } else {
        setPlayers([]); // Si no es un array, aseguramos que sea vacío
      }     
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  }, [user.schoolId]); 

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handleDelete = async (playerId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
            const response = await fetch(`${API_URL}/players/delete?id=${playerId}`);
          
            if(!response.ok){
                Swal.fire({title: "Error",text: response.error,icon: "error",})
            }
            Swal.fire("Eliminado!", response.data, "success");
            fetchPlayers();

        } catch (error) {
          console.error("Error deleting player:", error);
        }
      }
    });
  };

  return (
    <div>
      <h2>Gestión de Jugadores</h2>
      <button onClick={() => navigate("/crear-jugador")}>
        Crear nuevo Jugador.
      </button>
      <button onClick={() => navigate("/cargar-csv-players")}>
        Importar jugadores desde CSV.
      </button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.lastname}</td>
              <td>
                <button onClick={() => {
                    console.log("Navigating to:", `/players/edit/${player.id}`);  
                    navigate(`/players/edit/${player.id}`)
                }
                
                  
                  }>
                  Editar
                </button>
                <button onClick={() => handleDelete(player.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayersCRUD;
