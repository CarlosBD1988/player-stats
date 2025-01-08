import React, { useEffect, useState } from "react";
import { collection, getDocs, query,where} from "firebase/firestore";
import { db } from "../firebaseConfig"; 


const MetricsPlayer = ()=>
{
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        const fetchPlayers  = async () => {
          const playerSnapshot = await getDocs(collection(db, "players"));         
          setPlayers(playerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          
        };
        fetchPlayers ();
      }, []);



      useEffect(() => {
        if (selectedPlayer) {
          const fetchMetrics = async () => {
            const metricsQuery = query(
              collection(db, "playerStats"),
              where("playerId", "==", selectedPlayer)
            );
    
            const metricsSnapshot = await getDocs(metricsQuery);
            const metricsData = metricsSnapshot.docs.map((doc) => doc.data());
    
            if (metricsData.length > 0) {
              setMetrics(metricsData[metricsData.length - 1]); // Solo se muestra la última entrada de métricas
            } else {
              setMetrics(null); // Si no hay métricas, poner a null
            }
          };
    
          fetchMetrics();
        }
      }, [selectedPlayer]); 

    return (

        <div>
                <h2>Estadística por jugador</h2>

                <select onChange={(e) => setSelectedPlayer(e.target.value)}>
                    <option value="">Seleccionar jugador</option>
                    {players.map((player) => (
                    <option key={player.id} value={player.id}>
                        {player.name}
                    </option>
                ))}
            </select>
            
            {metrics ? (
        <div>
          <h3>Métricas del jugador seleccionado:</h3>
          <p><strong>Ritmo:</strong> {metrics.stats.ritmo}</p>
          <p><strong>Tiro:</strong> {metrics.stats.tiro}</p>
          <p><strong>Pase:</strong> {metrics.stats.pase}</p>
          <p><strong>Regate:</strong> {metrics.stats.regate}</p>
          <p><strong>Defensa:</strong> {metrics.stats.defensa}</p>
          <p><strong>Cabeza:</strong> {metrics.stats.cabeza}</p>
        </div>
      ) : (
        <p>No se han encontrado métricas para este jugador.</p>
      )}


        </div>
    )
}
export default MetricsPlayer;
