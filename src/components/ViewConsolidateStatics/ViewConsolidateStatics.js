import { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import './ViewConsolidateStatics.css';

const ViewConsolidateStatics = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [players, setPlayers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("campo"); // 'campo' o 'portero'

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.schoolId) return;

        const playerQuery = query(collection(db, "players"), where("schoolId", "==", user.schoolId));
        const playerSnapshot = await getDocs(playerQuery);
        
        const itemsQuery = query(collection(db, "items"), where("schoolId", "==", user.schoolId));
        const itemSnapshot = await getDocs(itemsQuery);
        
        const recordsQuery = query(collection(db, "records"), where("schoolId", "==", user.schoolId));
        const recordSnapshot = await getDocs(recordsQuery);

        const playersData = playerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const itemsData = itemSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const recordsData = recordSnapshot.docs.map(doc => ({ ...doc.data() }));

        setPlayers(playersData);
        setItems(itemsData);
        setRecords(recordsData);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.schoolId]);

  // Filtrar jugadores según la selección del filtro
  const filteredPlayers = players.filter(player => 
    filter === "portero" ? player.position === "portero" : player.position !== "portero"
  );

  // Filtrar métricas según la selección
  const filteredItems = items.filter(item => 
    filter === "portero" ? item.type === "portero" || item.type === "general" : item.type === "general"
  );

  // Determinar qué métricas generales tienen al menos un dato en porteros
  const generalItemsWithData = new Set();
  if (filter === "portero") {
    records.forEach(record => {
      const player = players.find(p => p.id === record.playerId);
      if (player?.position === "portero" && items.find(i => i.id === record.itemId)?.type === "general") {
        generalItemsWithData.add(record.itemId);
      }
    });
  }

  // Aplicar el filtro de métricas generales con datos en porteros
  const finalItems = filter === "portero" 
    ? filteredItems.filter(item => item.type === "portero" || generalItemsWithData.has(item.id))
    : filteredItems;

  const calculateTotal = (playerId, itemId) => {
    return records
      .filter(record => record.playerId === playerId && record.itemId === itemId)
      .reduce((sum, record) => sum + record.value, 0);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Reportes Consolidados</h2>
      <label>Filtrar por tipo de jugador: </label>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="campo">Jugadores de campo</option>
        <option value="portero">Porteros</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Jugador</th>
            {finalItems.map((item) => (
              <th key={item.id}>{item.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              {finalItems.map((item) => {
                const total = calculateTotal(player.id, item.id);
                return <td key={item.id}>{total}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewConsolidateStatics;
