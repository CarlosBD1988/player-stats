// src/components/AddRecord.js
import { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs,query,where} from "firebase/firestore";

import { useAuth } from "../../context/AuthContext";

import Swal from 'sweetalert2';

const AddRecord = () => {
  const [players, setPlayers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [value, setValue] = useState("");

  const { user } = useAuth();


  useEffect(() => {
    const fetchData = async () => {
      
      const playerQuery=query(collection(db, "players"), where("schoolId", "==", user.schoolId));
      const playerSnapshot = await getDocs(playerQuery);
      
      const itemsQuery=query(collection(db, "items"), where("schoolId", "==", user.schoolId));
      const itemSnapshot = await getDocs(itemsQuery);

      setPlayers(playerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setItems(itemSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, [user.schoolId]);

  const handleAddRecord = async () => {

    const API_URL = process.env.REACT_APP_API_URL;

    if (selectedPlayer && selectedItem && value) {
    
      Swal.fire({
        title: "¿Está seguro de almacenar este record?",
        text: "Esta acción guardará la estadística de manera permanente.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "No, cancelar",
        customClass: {
          popup: "custom-swal-popup",
        },
      }).then(async (result) => {
        if (result.isConfirmed) 
        {    
              const response = await fetch(`${API_URL}/records/add-record`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    playerId:selectedPlayer,
                    itemId:selectedItem,
                    value,
                    schoolId:user.schoolId, 
                    username: user.name}),
                });

                const data = await response.json();
                if(response.ok)
                {
                  Swal.fire({title: 'Guardado', text: data.message,icon: 'success',confirmButtonText: 'OK'});
                }
                else  {
                  Swal.fire("Error", "Error registrando estadistica." + data.error, "error");
                }   
          setValue("");
        } 
        else{      
          Swal.fire("Cancelado", "La acción ha sido cancelada.", "info");
        }
      });
    } else {
      Swal.fire("Error", "Por favor complete todos los campos antes de guardar.", "error");
    }
  };
  

  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Validar que el valor sea un número positivo y dentro de un rango aceptable
    if (/^\d*$/.test(inputValue) && inputValue <= 100) {
      setValue(inputValue); // Aceptar solo números hasta 1,000,000
    }
  };


  return (
    <div>
      <h2>Agregar Registro</h2>
      <select onChange={(e) => setSelectedPlayer(e.target.value)}>
        <option value="">Seleccionar jugador</option>
        {players.map((player) => (
          <option key={player.id} value={player.id}>
            {player.name}
          </option>
        ))}
      </select>
      <select onChange={(e) => setSelectedItem(e.target.value)}>
        <option value="">Seleccionar item</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Valor"
        value={value}
        onChange={handleChange}
        max="100"
      />
      <button onClick={handleAddRecord}>Agregar</button>
    </div>
  );
};

export default AddRecord;
