// src/components/AddRecord.js
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import Swal from 'sweetalert2';

const AddRecord = () => {
  const [players, setPlayers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const playerSnapshot = await getDocs(collection(db, "players"));
      const itemSnapshot = await getDocs(collection(db, "items"));
      setPlayers(playerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setItems(itemSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleAddRecord = async () => {
    if (selectedPlayer && selectedItem && value) {
      await addDoc(collection(db, "records"), {
        playerId: selectedPlayer,
        itemId: selectedItem,
        value: parseInt(value),
        date: new Date().toISOString(),
      });
      
  Swal.fire({
                title: 'Guardado',
                text: 'Estadistica registrada correctamente.',
                icon: 'success',
                confirmButtonText: 'OK'
            });      
      setValue("");
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
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleAddRecord}>Agregar</button>
    </div>
  );
};

export default AddRecord;
