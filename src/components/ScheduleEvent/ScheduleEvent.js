import { useState,useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../config/firebaseConfig";
import { collection, query, where, getDocs,addDoc } from "firebase/firestore";
import Swal from 'sweetalert2';


import "./ScheduleEvent.css";

const ScheduleEvent = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);


    useEffect(() => {
        if (user?.schoolId) {
          const fetchCategories = async () => {
            try {
              const q = query(collection(db, "categories"), where("schoolId", "==", user.schoolId));
              const querySnapshot = await getDocs(q);
              const fetchedCategories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setCategories(fetchedCategories);
            } catch (error) {
              console.error("Error fetching categories: ", error);
            }
          };
          fetchCategories();
        }
      }, [user?.schoolId]);





  const handleAddEvent = () => {
    setEvents([...events, { type: "", date: "", time: "", category: "", location: "", opponent: "" }]);

  };

  const handleEventChange = (index, field, value) => {
    const updatedEvents = [...events];
    updatedEvents[index][field] = value;
    setEvents(updatedEvents);
  };

  const handleRemoveEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const handleSaveEvents = async () => {
  
          if (!user?.schoolId) {
            Swal.fire("Error", "No se pudo obtener el ID de la escuela", "error");
            return;
          }

          for (const event of events) {
            if (!event.type || !event.date || !event.time || !event.category || !event.location) {
              Swal.fire("Campos incompletos", "Por favor completa todos los campos obligatorios", "warning");
              return;
            }

            if (event.type === "match" && !event.opponent) {
              Swal.fire("Campos incompletos", "El equipo contrincante es obligatorio para partidos", "warning");
              return;
            }
          }

          try {
            for (const event of events) {
            
              const eventData = { 
                schoolId: user.schoolId, 
                name:event.name,
                date: event.date, 
                time: event.time, 
                category: event.category, 
                location: event.location 
              };

              if (event.type === "training") {
                await addDoc(collection(db, "trainings"), eventData);
              } else if (event.type === "match") {
                if (!event.opponent) {
                  Swal.fire("Campos incompletos", "El equipo contrincante es obligatorio para partidos", "warning");
                  return;
                }
                await addDoc(collection(db, "matches"), { ...eventData, opponent: event.opponent });
              }
            }
            Swal.fire("Éxito", "Eventos guardados correctamente", "success");
              setEvents([]); // Limpiar formulario después de guardar
          }
          catch (error) {
              console.error("Error guardando eventos:", error);
              Swal.fire("Error", "Hubo un problema al guardar los eventos", "error");
          } 
  };

  return (
    <div className="container">
      <h2>Agendar Entrenamiento o Partido</h2>
      {events.map((event, index) => (
        <div key={index} className="event-box">

        <label className="LblInput">Tipo de evento:</label> 
          <select onChange={(e) => handleEventChange(index, "type", e.target.value)}>
            <option value="">Seleccionar Tipo</option>
            <option value="training">Entrenamiento</option>
            <option value="match">Partido</option>
          </select>

          <label htmlFor="name" className="LblInput">Nombre evento:</label>
          <input id="name" type="text" onChange={(e) => handleEventChange(index, "name", e.target.value)} placeholder="Nombre evento" />


          <label htmlFor="date" className="LblInput">Fecha:</label>
          <input id="date" type="date" onChange={(e) => handleEventChange(index, "date", e.target.value)} placeholder="Fecha" />

          {event.type === "training" && (
            <>    
             <label htmlFor="timeTraining" className="LblInput">Hora entrenamiento:</label>
              <input id="timeTraining"  type="time" onChange={(e) => handleEventChange(index, "time", e.target.value)} placeholder="Hora" />
            
              <label htmlFor="categoryTraining" className="LblInput">Categoria:</label>
              <select id="categoryTraining" onChange={(e) => handleEventChange(index, "category", e.target.value)}>
                <option value="">Seleccionar Categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            
              <label htmlFor="Ubicacion" className="LblInput">Sede Entrenamiento:</label>
              <input id="Ubicacion" type="text" onChange={(e) => handleEventChange(index, "location", e.target.value)} placeholder="Ubicación" />
            </>
          )}
          {event.type === "match" && (
            <>
              <label htmlFor="timeMatch" className="LblInput">Hora partido:</label>
              <input id="timeMatch" type="time" onChange={(e) => handleEventChange(index, "time", e.target.value)} placeholder="Hora" />
                
              <label htmlFor="categoryMatch" className="LblInput">Categoria:</label>
              <select id="categoryMatch" onChange={(e) => handleEventChange(index, "category", e.target.value)}>
                <option value="">Seleccionar Categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              
              <label htmlFor="team" className="LblInput">Equipo Contrincante:</label>
              <input id="team" type="text" onChange={(e) => handleEventChange(index, "opponent", e.target.value)} placeholder="Equipo Contrincante" />
              
              <label htmlFor="UbicacionMatch" className="LblInput">Sede partido:</label>
              <input  id="UbicacionMatch" type="text" onChange={(e) => handleEventChange(index, "location", e.target.value)} placeholder="Lugar del Partido" />
            </>
          )}
          <button className="DeleteButton" onClick={() => handleRemoveEvent(index)}>Eliminar</button>
        </div>
      ))}
      <button className="AddButton"  onClick={handleAddEvent}>+ Agregar Evento</button>
      <button  className="SaveButton" onClick={handleSaveEvents}>Guardar Eventos</button>
    </div>
  );
};

export default ScheduleEvent;
