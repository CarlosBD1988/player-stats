// src/components/MatchAttendance.js
import { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs, query, where, addDoc} from "firebase/firestore";
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
    // Validar que todos los jugadores tengan un valor seleccionado
    if (selectedPlayers.some((player) => player === "")) {
      Swal.fire("Error", "Todos los jugadores deben ser seleccionados.", "error");
      return;
    }
  
    // Solicitar el PIN para la validación
    Swal.fire({
      title: "Ingrese el PIN",
      input: "password", // Oculta los caracteres para mayor seguridad
      inputPlaceholder: "Ingrese su PIN de 4 dígitos",
      inputAttributes: {
        maxlength: 4,
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Validar",
      cancelButtonText: "Cancelar",
      customClass: {
        input: "custom-input",
        popup: "custom-swal-popup",
      },
      preConfirm: async (pin) => {
        if (!pin || pin.length !== 4) {
          Swal.showValidationMessage("Debe ingresar un PIN válido de 4 dígitos.");
        }
        return pin; // Retorna el PIN ingresado
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const pin = result.value;
  
        try {
          // Validar el PIN en la colección Tokens
          const tokenResponsable = await validarToken(pin); // Asume que tienes esta función implementada
          if (tokenResponsable) {
            // ID del item fijo
            const itemId = "uKOAjjzOB6szDTkF9e0r";            
  
            // Crear registros en la colección "records" y "audit"
            const records = selectedPlayers.map(async (playerId) => {
              // Registro en "records"
              await addDoc(collection(db, "records"), {
                playerId: playerId,
                itemId: itemId,
                value: 1,
                date: new Date().toISOString(),
              });
  
              // Registro en "audit"
              await addDoc(collection(db, "audit"), {
                user: tokenResponsable, // El nombre del dueño del token usado
                action: "new record",
                playerId: playerId,
                itemId: itemId,
                value: 1,
                date: new Date().toISOString(),
              });
            });
  
            // Asegurarse de que todos los registros se completen antes de continuar
            await Promise.all(records);
  
            // Mostrar mensaje de éxito
            Swal.fire("Éxito", "Estadísticas guardadas exitosamente.", "success");
  
            // Reiniciar el formulario
            setSelectedPlayers([""]);
          } else {
            // Si el PIN no es válido, mostrar mensaje de error
            Swal.fire("Error", "El PIN ingresado no es válido.", "error");
          }
        } catch (error) {
          console.error("Error al guardar la asistencia:", error);
          Swal.fire("Error", "Hubo un problema al guardar la asistencia.", "error");
        }
      }
    });
  };
  

  const validarToken = async (pin) => {
    try {
      // Buscar el token en la colección Tokens
      const tokenRef = collection(db, "Tokens");
      const q = query(tokenRef, where("tokenRef", "==", pin)); // Validar por el campo tokenRef
      const snapshot = await getDocs(q);
  
      if (!snapshot.empty) {
        const tokenDoc = snapshot.docs[0].data();
        return tokenDoc.user; // Retorna el nombre del usuario responsable
      } else {
        return null; // No existe el token
      }
    } catch (error) {
      console.error("Error al validar el token:", error);
      return null;
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
