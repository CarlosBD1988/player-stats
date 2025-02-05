import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Fichajes.css'; // Archivo de estilos

const Ficha = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const response = await axios.get(
          'https://api.futbol-transfers.com/players', // URL ficticia para la API de fichajes
          {
            headers: { 'X-Auth-Token': 'a3687d2e4c0649ee8beb0c0601030ea3' } // Sustituye con tu API Key real
          }
        );
        setTransfers(response.data); // Simulamos que response.data es un array con los fichajes
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los fichajes', error);
        setLoading(false);
      }
    };

    fetchTransfers();
  }, []);

  return (
    <div className="container">
      <h1>Fichajes de Fútbol a Nivel Mundial</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="transfers-list">
          {transfers.map((transfer, index) => (
            <div key={index} className="transfer-card">
              <div className="player-info">
                <img src={transfer.player.imageUrl} alt={transfer.player.name} className="player-image" />
                <div>
                  <h2 className="player-name">{transfer.player.name}</h2>
                  <p className="player-from">De: {transfer.fromClub}</p>
                  <p className="player-to">A: {transfer.toClub}</p>
                  <p className="player-price">Precio: {transfer.transferFee}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ficha;