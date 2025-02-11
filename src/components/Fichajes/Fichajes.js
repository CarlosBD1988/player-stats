import './Fichajes.css';  // Importamos el archivo CSS con el estilo lujoso
import React, { useState, useEffect } from 'react';

const Fichajes = () => {
  const [players, setPlayers] = useState([]);  // Estado para almacenar los jugadores
  const [loading, setLoading] = useState(true);  // Estado de carga
  const [error, setError] = useState(null);  // Estado de error

  useEffect(() => {
    const fetchPlayers = async () => {
      const apiUrl = 'https://v3.football.api-sports.io/transfers';  // URL de la API de API-Football
      const apiKey = '280d01cfa3ec3f235930239729ecbce1';  // Reemplaza con tu clave de API

      const teamId = 33;  // ID del equipo (por ejemplo, FC Barcelona)

      try {
        const response = await fetch(`${apiUrl}?team=${teamId}`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': apiKey,  // La clave de API
            'X-RapidAPI-Host': 'v3.football.api-sports.io'  // El host de la API
          }
        });

        if (!response.ok) {
          throw new Error('No se pudieron obtener los datos');
        }

        const data = await response.json();
        setPlayers(data.response);  // Guardamos los jugadores en el estado
      } catch (error) {
        setError(error.message);  // Si ocurre un error, lo guardamos
      } finally {
        setLoading(false);  // Terminamos de cargar
      }
    };

    fetchPlayers();  // Llamamos a la función para obtener los jugadores
  }, []);  // Solo se ejecuta una vez cuando el componente se monta

  if (loading) {
    return <div>Cargando...</div>;  // Mostramos un mensaje mientras cargan los datos
  }

  if (error) {
    return <div>Error: {error}</div>;  // Mostramos un mensaje de error si ocurre
  }

  return (
    <div>
      <h1>Jugadores del FC Barcelona</h1>
      <ul>
        {players.map(player => (
          <li key={player.player.id}>
            <img src={player.player.photo} alt={player.player.name} width={50} />
            <p>{player.player.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Fichajes;