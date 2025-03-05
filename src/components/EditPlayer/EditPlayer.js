import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Swal from "sweetalert2";

function EditPlayer() {
  const { id } = useParams(); // Obtiene el ID del jugador desde la URL

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

  useEffect(() => {
    const fetchPlayer = async () => {
      try {

        const API_URL = process.env.REACT_APP_API_URL;
        const response = await fetch(`${API_URL}/players/get-player/${id}`);
        if (!response.ok) {
          throw new Error("Error al cargar los datos del jugador.");
        }
        const data = await response.json();
        setPlayer(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

 
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!player) return <p>Jugador no encontrado.</p>;

  const handleChange = (e) => {
    setPlayer({ ...player, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const API_URL = process.env.REACT_APP_API_URL;
        console.log(`${API_URL}/players/update/${id}`)
        const response = await fetch(`${API_URL}/players/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({playerData: player}),
      });
      
      const data = await response.json();
        if (!response.ok) {
            
            Swal.fire({title:"Error",text: data.error,icon: "error",})
            return
        }      
        
        Swal.fire("Éxito", data.message,   "success");
     
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({title: "Error",text: "Hubo un problema al actualizar el jugador.",icon: "error",})
    }
  };
    return (
        <div>
          <h2>Editando jugador: {player.name} {player.lastname}</h2>
          <form onSubmit={handleSubmit}>           
    
          <label>Documento de identidad:</label>
          <input type="text" name="documentNumber" readOnly />

            <label>Nombre:</label>
            <input type="text" name="name" value={player.name} onChange={handleChange} />
    
            <label>Apellido:</label>
            <input type="text" name="lastname" value={player.lastname} onChange={handleChange} />
    
            <label>Fecha de nacimiento:</label>
            <input type="date" name="birthDate" value={player.birthDate} onChange={handleChange} />    
            
    
            <label>Altura (cm):</label>
            <input type="number" name="height" value={player.height} onChange={handleChange} />
    
            <label>Peso (kg):</label>
            <input type="number" name="weight" value={player.weight} onChange={handleChange} />
    
            <label>Posición:</label>
            <input type="text" name="position" value={player.position} onChange={handleChange} />
    
            <label>Equipo favorito:</label>
            <input type="text" name="fanTeam" value={player.fanTeam} onChange={handleChange} />
    
            <label>País:</label>
            <input type="text" name="country" value={player.country} onChange={handleChange} />  
                
            <button type="submit">Guardar Cambios</button>
          </form>
        </div>
      );
    }

export default EditPlayer;