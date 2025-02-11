import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./WatchTv.css"

const VerTv = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          'https://api.football-data.org/v4/matches',
          {
            headers: { 'X-Auth-Token': process.env.REACT_APP_X_AUTH_TOKEN_API_FOOTBAL } // API Key football-data.org
          }
        );
        setMatches(response.data.matches || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(true);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="contain">
      <h1>Resultados de Partidos de Fútbol</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="matches-list">
          {matches.length > 0 ? (
            matches.map((match) => (
              <div key={match.id} className="match-card">
                <div className="teams">
                  <span className="team">{match.homeTeam?.name || "Equipo Local"}</span>
                  <span className="score">
                    {match.score?.fullTime?.homeTeam ?? "?"} - {match.score?.fullTime?.awayTeam ?? "?"}
                  </span>
                  <span className="team">{match.awayTeam?.name || "Equipo Visitante"}</span>
                </div>
                <p>{new Date(match.utcDate).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No hay partidos disponibles en este momento.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VerTv;