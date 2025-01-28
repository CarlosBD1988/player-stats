import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs} from "firebase/firestore";
import { db } from "../../config/firebaseConfig"; 
import { useAuth } from "../../context/AuthContext";
import PlayerCard from "../PlayerCard/PlayerCard";
import SimpleRadarChart from "../MetricsPlayer/SimpleRadarChart";

const IndividualMetrics = () => {
  const { user } = useAuth(); // Obtener el usuario autenticado
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchMetrics = async () => {

      if (!user?.playerId) {
        // Si playerId es undefined o null, establecemos un error y detenemos la ejecución
        setError("Usuario con Role de 'tecnico' poer lo cual no tiene metricas establecidas.");
        return;
      }


      const metricsQuery = query(
        collection(db, "playerStats"),
        where("playerId", "==", user.playerId)
      );

      const metricsSnapshot = await getDocs(metricsQuery);
      const metricsData = metricsSnapshot.docs.map((doc) => doc.data());

      if (metricsData.length > 0) {
        // Supongamos que queremos mostrar el último documento en la lista
        setMetrics(metricsData[metricsData.length - 1]);
      } else {
        setMetrics(null); // Si no hay métricas, lo dejamos vacío
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