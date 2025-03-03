import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./Home.css";
import { db } from "../../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

function Home() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [trainingPage, setTrainingPage] = useState(0);
  const [matchPage, setMatchPage] = useState(0);

  useEffect(() => {
    if (user?.schoolId) {
      const fetchTrainings = async () => {
        try {
          const q = query(collection(db, "trainings"), where("schoolId", "==", user.schoolId));
          const querySnapshot = await getDocs(q);
          const fetchedTrainings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTrainings(fetchedTrainings);
        } catch (error) {
          console.error("Error fetching trainings: ", error);
        }
      };

      const fetchMatches = async () => {
        try {
          const q = query(collection(db, "matches"), where("schoolId", "==", user.schoolId));
          const querySnapshot = await getDocs(q);
          const fetchedMatches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMatches(fetchedMatches);
        } catch (error) {
          console.error("Error fetching matches: ", error);
        }
      };

      fetchTrainings();
      fetchMatches();
    }
  }, [user?.schoolId]);

  // Funciones para paginación (1 evento por página)
  const nextTrainingPage = () => setTrainingPage(prev => (prev + 1 < trainings.length ? prev + 1 : prev));
  const prevTrainingPage = () => setTrainingPage(prev => (prev > 0 ? prev - 1 : prev));
  const nextMatchPage = () => setMatchPage(prev => (prev + 1 < matches.length ? prev + 1 : prev));
  const prevMatchPage = () => setMatchPage(prev => (prev > 0 ? prev - 1 : prev));

  return (
    <div className="home">
      <div className="content">
        
        <img src="logo.png" alt="Decorativo" className="home-logo" />
      </div>

      {/* Contenedor de eventos a la derecha */}
      <div className="events-container">
        {/* Entrenamientos */}
        <div className="event-section">
          <h3>Entrenamientos</h3>
          {trainings.length > 0 ? (
            <div className="event-box">
              <p><strong>Fecha:</strong> {trainings[trainingPage].date}</p>
              <p><strong>Hora:</strong> {trainings[trainingPage].time}</p>
              <p><strong>Categoría:</strong> {trainings[trainingPage].category}</p>
              <p><strong>Ubicación:</strong> {trainings[trainingPage].location}</p>
            </div>
          ) : <p>No hay entrenamientos</p>}
          <div className="pagination">
            <FaArrowLeft className="arrow" onClick={prevTrainingPage} />
            <FaArrowRight className="arrow" onClick={nextTrainingPage} />
          </div>
        </div>

        {/* Partidos */}
        <div className="event-section">
          <h3>Partidos</h3>
          {matches.length > 0 ? (
            <div className="event-box">
              <p><strong>Fecha:</strong> {matches[matchPage].date}</p>
              <p><strong>Hora:</strong> {matches[matchPage].time}</p>
              <p><strong>Categoría:</strong> {matches[matchPage].category}</p>
              <p><strong>Contrincante:</strong> {matches[matchPage].opponent}</p>
              <p><strong>Ubicación:</strong> {matches[matchPage].location}</p>
            </div>
          ) : <p>No hay partidos</p>}
          <div className="pagination">
            <FaArrowLeft className="arrow" onClick={prevMatchPage} />
            <FaArrowRight className="arrow" onClick={nextMatchPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
