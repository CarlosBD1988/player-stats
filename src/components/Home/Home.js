import React, { useEffect, useState } from "react";
import "./Home.css";
import { db } from "../../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function Home() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      fetchTrainings();
    }
    
  }, [user?.schoolId]);

  const nextSlide = () => {
    if (currentIndex + 2 < trainings.length) {
      setCurrentIndex(currentIndex + 2);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 2);
    }
  };

  return (
    <div className="home">
      <h1>WELCOME TO STATISTICS FOOTBALL!</h1>
      <img src="logo.png" alt="Decorativo" className="home-gif" />

      {trainings.length > 0 && (
        <div className="trainings-section">
          <h2>Próximos Entrenamientos</h2>
          <div className="carousel">
            {currentIndex > 0 && <FaArrowLeft className="arrow left" onClick={prevSlide} />}
            <div className="trainings-container">
              {trainings.slice(currentIndex, currentIndex + 2).map(training => (
                <div key={training.id} className="training-card">
                  <p><strong>Fecha:</strong> {training.date}</p>
                  <p><strong>Hora:</strong> {training.time}</p>
                  <p><strong>Categoría:</strong> {training.category}</p>
                  <p><strong>Ubicación:</strong> {training.location}</p>
                </div>
              ))}
            </div>
            {currentIndex + 2 < trainings.length && <FaArrowRight className="arrow right" onClick={nextSlide} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
