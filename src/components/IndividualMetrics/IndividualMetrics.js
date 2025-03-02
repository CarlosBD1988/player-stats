import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import PlayerCard from "../PlayerCard/PlayerCard";
import SimpleRadarChart from "../MetricsPlayer/SimpleRadarChart";

const IndividualMetrics = () => {
  const { user } = useAuth(); // Obtener el usuario autenticado
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null); 

  useEffect(() => {

    if (!user?.playerId) {
      setError("No hay ningún usuario seleccionado.");
      return;
    }
    setError(null);
    setMetrics(null)

    const fetchMetrics = async () => {       
      try {
        const API_URL = process.env.REACT_APP_API_URL;      
        const response = await fetch(`${API_URL}/metrics/read-metric/${user.playerId}`);            
        console.log(user.playerId)
        if (!response.ok) {
          setError("No se pudieron obtener las métricas error API, "+ response.error);          
        }

        const data = await response.json();

        if (data.length > 0) {          
          setMetrics(data[data.length - 1]); 
        } else {
          setMetrics(null);
        }        
      } catch (error) {
        setError(error.message);
      }    
    };

    fetchMetrics();
  }, [user.playerId]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }
  return (
    <div>
      <h2>Métrica Individual</h2>

      {metrics ? (
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
                <PlayerCard playerName={user.name} metrics={metrics.stats} />
              </div>
              <div className="SimpleRadarChart">
                {metrics && <SimpleRadarChart metrics={metrics.stats} />}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No se han encontrado métricas para este jugador.</p>
      )}
    </div>
  );
};

export default IndividualMetrics;