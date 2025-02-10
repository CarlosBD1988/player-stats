import { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs,query, where} from "firebase/firestore";

import { useAuth } from "../../context/AuthContext";
import './ViewConsolidateStatics.css'; 

const ViewConsolidateStatics = () => {

  const { user } = useAuth(); // Obtener el usuario autenticado

  const [records, setRecords] = useState([]);
  const [players, setPlayers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {

        if (!user?.schoolId) return;

        const playerQuery = query(collection(db, "players"), where("schoolId", "==", user.schoolId));
        const playerSnapshot = await getDocs(playerQuery);
        //const playerSnapshot = await getDocs(collection(db, "players"));        
        
        
        const itemsQuery = query(collection(db, "items"), where("schoolId", "==", user.schoolId));
        const itemSnapshot = await getDocs(itemsQuery);
        
        const recordSnapshot = await getDocs(collection(db, "records"));

        const playersMap = playerSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data().name;
          return acc;
        }, {});
        const itemsMap = itemSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data().name;
          return acc;
        }, {});

        const recordsData = recordSnapshot.docs.map((doc) => ({
          ...doc.data(),
          playerName: playersMap[doc.data().playerId],
          itemName: itemsMap[doc.data().itemId],
        }));

        // Establecer el estado
        setPlayers(Object.values(playersMap));  // Los nombres de los jugadores
        setItems(Object.values(itemsMap));      // Los nombres de los ítems
        setRecords(recordsData);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.schoolId]);

  // Calcular el total acumulado por jugador e ítem
  const calculateTotal = (player, item) => {
    return records
      .filter((record) => record.playerName === player && record.itemName === item)
      .reduce((sum, record) => sum + record.value, 0);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Reportes Consolidados</h2>
      <table>
        <thead>
          <tr>
            <th>Jugador</th>
            {items.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player}>
              <td>{player}</td>
              {items.map((item) => {
                const total = calculateTotal(player, item); // Sumar los valores
                return <td key={item}>{total}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewConsolidateStatics;
