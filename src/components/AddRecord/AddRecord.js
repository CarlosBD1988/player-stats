// src/components/AddRecord.js
import { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, addDoc, getDocs,query,where} from "firebase/firestore";

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
    if (selectedPlayer && selectedItem && value) {
      // Mostrar SweetAlert para confirmar la acción
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
        if (result.isConfirmed) {
          // Si el usuario confirma, guardar en Firestore
          await addDoc(collection(db, "records"), {
            playerId: selectedPlayer,
            itemId: selectedItem,
            value: parseInt(value),
            date: new Date().toISOString(),
            schoolId:user.schoolId
          });
  
          Swal.fire({
            title: "Guardado",
            text: "Estadística registrada correctamente.",
            icon: "success",
            confirmButtonText: "OK",
          });
  
          // Registrar en auditoría
          await addDoc(collection(db, "audit"), {
            user: user.name + " " + user.lastname,
            action: "new record",
            playerId: selectedPlayer,
            itemId: selectedItem,
            value: parseInt(value),
            date: new Date().toISOString(),
          });
  
          setValue("");
        } else {
          // Si el usuario cancela
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
