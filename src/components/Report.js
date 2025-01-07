// src/components/Report.js
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const Report = () => {
  const [records, setRecords] = useState([]);
  const [players, setPlayers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const playerSnapshot = await getDocs(collection(db, "players"));
      const itemSnapshot = await getDocs(collection(db, "items"));
      const recordSnapshot = await getDocs(collection(db, "records"));

      const playersMap = playerSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().name;
        return acc;
      }, {});
      const itemsMap = itemSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().name;
        return acc;
      }, {});
      const data = recordSnapshot.docs.map((doc) => ({
        ...doc.data(),
        playerName: playersMap[doc.data().playerId],
        itemName: itemsMap[doc.data().itemId],
      }));

      setPlayers(playerSnapshot.docs.map((doc) => doc.data().name));
      setItems(itemSnapshot.docs.map((doc) => doc.data().name));
      setRecords(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Reportes</h2>
      <table>
        <thead>
          <tr>
            <th>Jugador</th>
            {items.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player}>
              <td>{player}</td>
              {items.map((item, index) => {
                const total = records
                  .filter((r) => r.playerName === player && r.itemName === item)
                  .reduce((sum, r) => sum + r.value, 0);
                return <td key={index}>{total}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
