// src/components/MatchAttendance.js
import { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs, query, where} from "firebase/firestore";
import Swal from "sweetalert2";
import "./MatchAttendance.css"


const MatchAttendance = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([""]); // Array dinámico para las listas desplegables
  const [matchDate, setMatchDate] = useState("");

  useEffect(() => {
    // Cargar la lista de jugadores desde la colección "players"
    const fetchPlayers = async () => {
      const playerQuery=query(collection(db, "players"),where("schoolId", "==", user.schoolId));
      const playerSnapshot = await getDocs(playerQuery);
      setPlayers(playerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchPlayers();

    // Establecer la fecha por defecto como la fecha actual
    setMatchDate(new Date().toISOString().split("T")[0]);
  }, [user.schoolId]);

  const handleAddPlayer = () => {
    setSelectedPlayers([...selectedPlayers, ""]); // Agregar un nuevo campo para seleccionar jugadores
  };

  const handlePlayerChange = (index, value) => {
    const updatedPlayers = [...selectedPlayers];
    updatedPlayers[index] = value;
    setSelectedPlayers(updatedPlayers); // Actualizar el array dinámico de jugadores seleccionados
  };

  const handleRemovePlayer = (index) => {
    const updatedPlayers = selectedPlayers.filter((_, i) => i !== index);
    setSelectedPlayers(updatedPlayers);
  };

  const handleSave = async () => {

    const API_URL = process.env.REACT_APP_API_URL;
    // Validar que todos los jugadores tengan un valor seleccionado
    if (selectedPlayers.some((player) => player === "")) {
      Swal.fire("Error", "Todos los jugadores deben ser seleccionados.", "error");
      return;
    }
    
    try
    {
      const formattedPlayers = selectedPlayers.map(playerId => ({ playerId }));

      const response = await fetch(`${API_URL}/assistance/register-assistance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId:user.schoolId,responsableRegister:user.name, selectedPlayers:formattedPlayers }),
      });
      const data = await response.json();
      if(response.ok)
      {
        Swal.fire({title: 'Guardado', text: data.message,icon: 'success',confirmButtonText: 'OK'});
      }
      else  {
        Swal.fire("Error", "Error registrando asistencias" + data.error, "error");
      }
    }       
        catch (error) {
          console.error("Error al guardar la asistencia:", error);
          Swal.fire("Error", "Hubo un problema al guardar la asistencia. "+ error , "error");
        }  
  };

  return (
    <div className="container">
      <h2>Asistencia a Partidos</h2>
      <div>
        <label htmlFor="matchDate" className="label">Fecha del Partido:</label>
        <input type="date" id="matchDate" value={matchDate} onChange={(e) => setMatchDate(e.target.value)}/>
      </div>

      <div className="players-container">
        <h3>Jugadores:</h3>

        <button className="add-button" onClick={handleAddPlayer}>Agregar</button>
        {selectedPlayers.map((playerId, index) => (
          <div className="player-item" key={index}>
            <select value={playerId} onChange={(e) => handlePlayerChange(index, e.target.value)}>
              <option value="">Seleccionar jugador</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
            {selectedPlayers.length > 1 && (
              <button onClick={() => handleRemovePlayer(index)}>X</button>
            )}
          </div>
        ))}

        
      </div>

      <button className="save-button " onClick={handleSave}>Guardar</button>
    </div>
  );
};

export default MatchAttendance;
