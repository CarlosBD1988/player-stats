import { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, addDoc, getDocs,query ,where} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

import "./AddMultipleRecords.css"

const AddMultipleRecords = () => {
  const [players, setPlayers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [stats, setStats] = useState([{ itemId: "", value: "" }]);
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

  const handleAddStat = () => {
    setStats([...stats, { itemId: "", value: "" }]);
  };

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...stats];
    updatedStats[index][field] = value;
    setStats(updatedStats);
  };


  const handleRemoveStat = (index) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const handleAddRecords = async () => {
    if (selectedPlayer && stats.every((stat) => stat.itemId && stat.value)) {
      Swal.fire({
        title: "¿Está seguro de almacenar estos registros?",
        text: "Se guardarán todas las estadísticas del jugador.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "No, cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const batch = stats.map((stat) =>
            addDoc(collection(db, "records"), {
              playerId: selectedPlayer,
              itemId: stat.itemId,
              value: parseInt(stat.value),
              date: new Date().toISOString(),
              schoolId:user.schoolId
            })
          );

          await Promise.all(batch);

          const batchAudit = stats.map((stat) =>
            addDoc(collection(db, "audit"), {
              user: user.name + " " + user.lastname,
              itemId: stat.itemId,
              value: parseInt(stat.value),
              action: "new record",
              playerId: selectedPlayer,              
              date: new Date().toISOString(),
            })
          );
          await Promise.all(batchAudit);        

          Swal.fire("Guardado", "Todas las estadísticas han sido registradas.", "success");
          setStats([{ itemId: "", value: "" }]);
        } else {
          Swal.fire("Cancelado", "La acción ha sido cancelada.", "info");
        }
      });
    } else {
      Swal.fire("Error", "Por favor complete todos los campos antes de guardar.", "error");
    }
  };

  return (
    <div className="container">

      <div className="title-container"> 
        <h2>Agregar Múltiples Registros</h2>
      </div>

      <div className="player-container">
      <select onChange={(e) => setSelectedPlayer(e.target.value)}>
        <option value="">Seleccionar jugador</option>
        {players.map((player) => (
          <option key={player.id} value={player.id}>
            {player.name}
          </option>
        ))}
      </select>
      </div>
      
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-row">
            <select className="stat-row select" onChange={(e) => handleStatChange(index, "itemId", e.target.value)}>
              <option value="">Seleccionar item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              className="stat-row input"
              type="number"
              placeholder="Valor"
              value={stat.value}
              onChange={(e) => handleStatChange(index, "value", e.target.value)}
              min="1"
              max="100"
            />
          <button className="delete-btn " onClick={() => handleRemoveStat(index)}>Eliminar</button>
          </div>
        ))}
      </div>
      <button className="add-btn" onClick={handleAddStat}>+ Agregar Otro</button>
      <button className="save-btn" onClick={handleAddRecords}>Guardar Todo</button>
    </div>
  );
};

export default AddMultipleRecords;
