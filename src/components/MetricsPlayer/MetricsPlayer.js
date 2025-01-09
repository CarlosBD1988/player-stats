import React, { useEffect, useState } from "react";
import { collection, getDocs, query,where} from "firebase/firestore";
import { db } from "../../config/firebaseConfig"; 
import SimpleRadarChart from "./SimpleRadarChart";
import PlayerCard from "../PlayerCard/PlayerCard";
import "./MetricsPlayer.css";

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
                <h2>Metricas por jugador</h2>

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
          <div className="metrics-container">                
                <div className="metrics-grid"> 
                    <div className="metric">
                    <strong>Ritmo:</strong>
                    <span>{metrics.stats.ritmo}</span>
                    </div>
                    <div className="metric">
                    <strong>Tiro:</strong>
                    <span>{metrics.stats.tiro}</span>
                    </div>
                    <div className="metric">
                    <strong>Pase:</strong>
                    <span>{metrics.stats.pase}</span>
                    </div>
                    <div className="metric">
                    <strong>Regate:</strong>
                    <span>{metrics.stats.regate}</span>
                    </div>
                    <div className="metric">
                    <strong>Defensa:</strong>
                    <span>{metrics.stats.defensa}</span>
                    </div>
                    <div className="metric">
                    <strong>Cabeza:</strong>
                    <span>{metrics.stats.cabeza}</span>
                    </div>
                </div>
                <div className="container-graphics">
                        <div className="PlayerCard">
                              <PlayerCard playerName={players.find(p => p.id === selectedPlayer)?.name} metrics={metrics.stats} />
                        </div>
                        <div className="SimpleRadarChart">
                              {selectedPlayer && metrics && (<SimpleRadarChart metrics={metrics.stats} />)}
                        </div>
                        
                </div>                  
          </div>
        </div>
      ) : (
        <p>No se han encontrado métricas para este jugador.</p>
      )}

       


      </div>
    )
}
export default MetricsPlayer;
