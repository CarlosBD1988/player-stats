import React, { useEffect, useState } from "react";
import { collection, getDocs,query,where} from "firebase/firestore";
import { db } from "../../config/firebaseConfig"; // Asegúrate de importar tu instancia de Firestore correctamente.
import { useAuth } from "../../context/AuthContext";
import Swal from 'sweetalert2';

import "./AddMetrics.css"

const AddMetrics= ()=>
{
  const API_URL = process.env.REACT_APP_API_URL;
    const { user } = useAuth();
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [formData, setFormData] = useState({
        ritmo: "",
        tiro: "",
        pase: "",
        regate: "",
        defensa: "",
        cabeza: ""
      });
      const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {

          const playerQuery=query(collection(db, "players"),where("schoolId", "==", user.schoolId));
          const playerSnapshot = await getDocs(playerQuery);
          
          setPlayers(playerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          
        };
        fetchData();
      }, [user.schoolId]);



      const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        const numericValue = value === "" ? "" : Number(value);

        // Validar que el valor esté entre 0 y 100
        if (numericValue === "" || (numericValue >= 0 && numericValue <= 100)) {
          setFormData({ ...formData, [name]: numericValue });
          setError(""); // Limpiar el error si el valor es válido
        } else {
          setError("El valor debe estar entre 0 y 99");
        }
      };


      const handleSubmit = async (e) => {
        e.preventDefault();      
       
        if (selectedPlayer) {          
          const allValuesValid = Object.values(formData).every(
            (value) => value >= 0 && value <= 100
          );
      
          if (allValuesValid) 
          {            
                const response = await fetch(`${API_URL}/metrics/add-metric`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    playerId: selectedPlayer,                            
                    stats:formData,
                    schoolId:user.schoolId,              
                    }),
                });

                const data = await response.json();
                  if(response.ok){
                  Swal.fire({
                    title: 'Guardado',
                    text: data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                }else{
                  Swal.fire({
                    title: 'Error',
                    text: data.error,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                }      

          } else {
            setError("Todos los valores deben estar entre 0 y 99.");
          }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, selecciona un jugador.',
                icon: 'error',
                confirmButtonText: 'OK'
            });         
        }
      }; 
    return (

        <div>
                <h2>Registro metrica por jugador.</h2>

                <select onChange={(e) => setSelectedPlayer(e.target.value)}>
                    <option value="">Seleccionar jugador</option>
                    {players.map((player) => (
                    <option key={player.id} value={player.id}>
                        {player.name}
                    </option>
                ))}
            </select>

        <form onSubmit={handleSubmit} className="form-container">
        <div class="form-item">
          <label>Ritmo (Promedio de velocidad y aceleración):</label>
          <input
            type="number"
            name="ritmo"
            value={formData.ritmo}
            onChange={handleInputChange}
            placeholder="Ingrese el ritmo"
            min="0"
            max="100"
            required
          />
        </div>

        <div class="form-item">
          <label>Tiro (EA, tiro lejano y potencia):</label>
          <input
            type="number"
            name="tiro"
            value={formData.tiro}
            onChange={handleInputChange}
            placeholder="Ingrese el tiro"
            min="0"
            max="100"
            required
          />
        </div>

        <div class="form-item">
          <label>Pase (Promedio de pase corto, largo y centros):</label>
          <input
            type="number"
            name="pase"
            value={formData.pase}
            onChange={handleInputChange}
            placeholder="Ingrese el pase"
            min="0"
            max="100"
            required
          />
        </div>

        <div class="form-item">
          <label>Regate (Regate, control, agilidad y equilibrio):</label>
          <input
            type="number"
            name="regate"
            value={formData.regate}
            onChange={handleInputChange}
            placeholder="Ingrese el regate"
            min="0"
            max="100"
            required
          />
        </div>

        <div class="form-item">
          <label>Defensa (Marcaje, entradas, robos y fuerza):</label>
          <input
            type="number"
            name="defensa"
            value={formData.defensa}
            onChange={handleInputChange}
            placeholder="Ingrese la defensa"
            min="0"
            max="100"
            required
          />
        </div>

        <div class="form-item">
          <label>Cabeza (Salto, precisión y fuerza):</label>
          <input
            type="number"
            name="cabeza"
            value={formData.cabeza}
            onChange={handleInputChange}
            placeholder="Ingrese el cabezazo"
            min="0"
            max="100"
            required
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar mensaje de error si es necesario */}

        <button type="submit">Guardar Estadísticas</button>
      </form>

            


        </div>
    )
}
export default AddMetrics;
