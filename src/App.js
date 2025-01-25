import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import { AuthProvider } from "./context/AuthContext"; // Importar AuthProvider


import Home from "./components/Home/Home";
import AddJugador from "./components/AddPlayer/AddPlayer";
import AddItem from "./components/AddItem/AddItem";
import AddRecord from "./components/AddRecord/AddRecord";
import AddMetrics from "./components/AddMetrics/AddMetrics";
import VerConsolidado from "./components/ViewConsolidateStatics/ViewConsolidateStatics";
import MetricsPlayer from "./components/MetricsPlayer/MetricsPlayer";
import Audit from "./components/Audit/Audit";
import Footer from "./components/Footer/Footer";
import MatchAttendance from "./components/MatchAttendance/MatchAttendance";
import SignIn from "./components/SignIn/SignIn";
import LandingPage from "./components/LandingPage/LandingPage"; 
import Navbar from "./components/Navbar/Navbar";


import "./App.css";


function App() {
  return (
    <AuthProvider>

    
    <Router>
      <div>       
        <Navbar />
        <Footer />
        {/* Rutas */}
        <Routes>
        <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/crear-jugador" element={<AddJugador />} />
          <Route path="/crear-item" element={<AddItem />} />
          <Route path="/crear-registro" element={<AddRecord />} />
          <Route path="/crear-metrica" element={<AddMetrics />} />
          <Route path="//confirmar-asistencia" element={<MatchAttendance />} />  
          <Route path="/ver-consolidado" element={<VerConsolidado />} />
          <Route path="/por-jugador" element={< MetricsPlayer/>} />
          <Route path="/auditoria" element={<Audit />} />
          <Route path="/SignIn" element={<SignIn />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;

