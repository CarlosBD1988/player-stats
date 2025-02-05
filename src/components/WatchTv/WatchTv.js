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
            headers: { 'X-Auth-Token': 'a3687d2e4c0649ee8beb0c0601030ea3' } // API Key football-data.org
          }
        );
        setMatches(response.data.matches);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
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
          {matches.map((match) => (
            <div key={match.id} className="match-card">
              <div className="teams">
                <span className="team">{match.homeTeam.name}</span>
                <span className="score">{match.score.fullTime.homeTeam} - {match.score.fullTime.awayTeam}</span>
                <span className="team">{match.awayTeam.name}</span>
              </div>
              <p>{new Date(match.utcDate).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerTv;