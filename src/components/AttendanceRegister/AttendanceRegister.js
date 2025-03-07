import { useState, useEffect } from "react";
import { collection, query, where, getDocs,addDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import Swal from 'sweetalert2';


const RegisterAttendance = () => {
  const [eventType, setEventType] = useState(""); // "training" o "match"
  const [trainings, setTrainings] = useState([]); // Lista de entrenamientos
  const [matches, setMatches] = useState([]); // Lista de partidos
  const [selectedEvent, setSelectedEvent] = useState("");
  const [players, setPlayers] = useState([]); // Lista de jugadores
  const [selectedPlayers, setSelectedPlayers] = useState([]); // Jugadores seleccionados
  const { user } = useAuth();

  // Cargar eventos cuando cambia eventType
  useEffect(() => {
    if (!user?.schoolId) return;

    const fetchEvents = async () => {
      try {
        // Obtener entrenamientos
        const trainingQuery = query(collection(db, "trainings"), where("schoolId", "==", user.schoolId));
        const trainingSnapshot = await getDocs(trainingQuery);
        setTrainings(trainingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Obtener partidos
        const matchQuery = query(collection(db, "matches"), where("schoolId", "==", user.schoolId));
        const matchSnapshot = await getDocs(matchQuery);
        setMatches(matchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [user?.schoolId]);

  // Cargar lista de jugadores al iniciar
  useEffect(() => {
    if (!user?.schoolId) return;

    const fetchPlayers = async () => {
      try {
        const q = query(collection(db, "players"), where("schoolId", "==", user.schoolId));
        const querySnapshot = await getDocs(q);
        const fetchedPlayers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlayers(fetchedPlayers);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, [user?.schoolId]);

  const events = eventType === "training" ? trainings : eventType === "match" ? matches : [];

  
  // Agregar un nuevo combobox de jugadores
  const addPlayerSelect = () => {
    setSelectedPlayers([...selectedPlayers, ""]);
  };

  // Manejar cambio en el select de jugadores
  const handlePlayerChange = (index, value) => {
    const updatedPlayers = [...selectedPlayers];
    updatedPlayers[index] = value;
    setSelectedPlayers(updatedPlayers);
  };

  // Eliminar un select de jugadores
  const removePlayerSelect = (index) => {
    const updatedPlayers = [...selectedPlayers];
    updatedPlayers.splice(index, 1);
    setSelectedPlayers(updatedPlayers);
  };



  const saveAttendance = async () => {

    const validPlayers = selectedPlayers.filter(playerId => playerId !== "");

    if (!selectedEvent || validPlayers.length === 0) {
      Swal.fire("Campos incompletos", "Por favor completa todos los campos obligatorios", "warning");      
      return;
    }

    const collectionName =
      eventType === "training" ? "assistenceTraining" : "assistenceMatches";

    try {
      const batch = validPlayers.map((playerId) =>
        addDoc(collection(db, collectionName), {
          schoolId:user.schoolId,
          eventId: selectedEvent,
          playerId,
          timestamp: new Date(),
        })
      );

      await Promise.all(batch);
      alert("Asistencias registradas correctamente.");
      setSelectedPlayers([]); // Limpiar selección después de guardar
    } catch (error) {
      console.error("Error al guardar asistencias:", error);
      Swal.fire("Error", "Hubo un error al guardar las asistencias.", "error");
      
    }
  };




  return (
    <div>
      <h2>Registro de Asistencia</h2>

      {/* Selección de tipo de evento */}
      <label>Seleccionar tipo de evento:</label>
      <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
        <option value="">-- Seleccione --</option>
        <option value="training">Entrenamiento</option>
        <option value="match">Partido</option>
      </select>

  {/* Lista de eventos filtrada por eventType */}
  {eventType && (
        <div>
          <label>Seleccionar evento:</label>
          {events.length > 0 ? (
            <select onChange={(e) => setSelectedEvent(e.target.value)}> 
             <option value="">Seleccione un evento</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          ) : (
            <p>No hay eventos programados</p>
          )}
        </div>
      )}

      {/* Agregar asistentes */}
      <h3>Asistentes</h3>
      <button onClick={addPlayerSelect}>➕ Agregar Asistente</button>

      {selectedPlayers.map((player, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
          <select value={player} onChange={(e) => handlePlayerChange(index, e.target.value)}>
            <option value="">-- Seleccione un jugador --</option>
            {players.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} {p.lastname}
              </option>
            ))}
          </select>
          <button onClick={() => removePlayerSelect(index)}>Eliminar ❌</button>
        </div>
      ))}

    <button onClick={saveAttendance}>💾 Guardar Asistencias</button>
    </div>
  );
};

export default RegisterAttendance;
