import React, { useEffect, useState } from "react";
import { collection, getDocs, query,where} from "firebase/firestore";
import { db } from "../../config/firebaseConfig"; 
import SimpleRadarChart from "./SimpleRadarChart";
import PlayerCard from "../PlayerCard/PlayerCard";

import { useAuth } from "../../context/AuthContext";

import "./MetricsPlayer.css";

const MetricsPlayer = ()=>
{
    
    const { user } = useAuth(); // Obtener el usuario autenticado
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchPlayers  = async () => {
        
        //const playerSnapshot = await getDocs(collection(db, "players"));            
        const playerQuery = query(collection(db, "players"), where("schoolId", "==", user.schoolId));
        const playerSnapshot = await getDocs(playerQuery);     
        setPlayers(playerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          
        };
        fetchPlayers ();
      }, [user.schoolId]);

      useEffect(() => {
        if (!selectedPlayer) return;

        const fetchMetrics = async () => {
          setLoading(true);
          setError(null);
          setMetrics(null)
          try {
            const API_URL = process.env.REACT_APP_API_URL;      
            const response = await fetch(`${API_URL}/metrics/read-metric/${selectedPlayer}`);            

            if (!response.ok) throw new Error("No se pudieron obtener las métricas");

            const data = await response.json();

            if (data.length > 0) {
              console.log(data[data.length - 1])
              setMetrics(data[data.length - 1]); // 🔥 Toma la última métrica de la lista
            } else {
              setMetrics(null);
            }
            
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchMetrics();
      }, [selectedPlayer]);
      

      const handlePlayerChange = (e) => {
        const playerId = e.target.value;
        setSelectedPlayer(playerId);
      
        if (!playerId) {
          setMetrics(null); // 🔥 Limpiar la métrica cuando no hay jugador seleccionado
        }
      };



    return (
        <div>
                <h2> Metrica Individual: </h2>

                <select className="select1" onChange={handlePlayerChange} value={selectedPlayer}>
                    <option value="">Seleccionar jugador</option>
                    {players.map((player) => (
                    <option key={player.id} value={player.id}>
                        {player.name}
                    </option>
                ))}
            </select>
            
            {loading && <p>Cargando métricas...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {!loading && metrics && (

        <div>                      
          <div className="metrics-container">                
                <div className="metrics-grid"> 
                    <div className="metric">
                    <strong>Ritmo: </strong>
                    <span>{metrics.stats.ritmo}</span>
                    </div>
                    <div className="metric">
                    <strong>Tiro: </strong>
                    <span>{metrics.stats.tiro}</span>
                    </div>
                    <div className="metric">
                    <strong>Pase: </strong>
                    <span>{metrics.stats.pase}</span>
                    </div>
                    <div className="metric">
                    <strong>Regate: </strong>
                    <span>{metrics.stats.regate}</span>
                    </div>
                    <div className="metric">
                    <strong>Defensa: </strong>
                    <span>{metrics.stats.defensa}</span>
                    </div>
                    <div className="metric">
                    <strong>Cabeza: </strong>
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
      )}
       
      {!loading && !metrics && selectedPlayer && <p>No hay métricas disponibles para este jugador.</p>}
      </div>
    );
};
export default MetricsPlayer;
