import React from "react";
import "./PlayerCard.css"; // Archivo CSS para estilos

const PlayerCard = ({ playerName, metrics }) => {
  return (
    <div className="player-card">
      <div className="player-header">
        <div className="rating">{metrics.overall || 90}</div>
        <div className="position">RW</div>
        <div className="country-flag">
          <img src="flag-colombia.png" alt="Colombia" /> {/* Cambia según el país */}
        </div>
        <div className="club-logo">
          <img src="nacional.png" alt="Club" /> {/* Cambia según el club */}
        </div>
      </div>

      <div className="player-image">
        <img src={`/perfiles/${playerName}.png`} alt={playerName} /> {/* Imagen del jugador */}
      </div>

      <div className="player-info">
        <h3 className="player-name">{playerName}</h3>
        <div className="metrics">
          <p>
            <strong>RIT: </strong> {metrics.ritmo || 80}
          </p>
          <p>
            <strong>SHO: </strong> {metrics.tiro || 85}
          </p>
          <p>
            <strong>PAS: </strong> {metrics.pase || 82}
          </p>
          <p>
            <strong>DRI: </strong> {metrics.regate || 87}
          </p>
          <p>
            <strong>DEF: </strong> {metrics.defensa || 70}
          </p>
          <p>
            <strong>PHY: </strong> {metrics.cabeza || 75}
          </p>
        </div>
      </div>
    </div>
  );
}  
export default PlayerCard;
