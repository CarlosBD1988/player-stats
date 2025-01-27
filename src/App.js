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

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import UnauthorizedPage from './components/UnauthorizedPage/UnauthorizedPage';



import "./App.css";


function App() {
  return (
    <AuthProvider>    
    <Router>
      <div>       
       {/* Renderiza el Navbar y Footer solo si el usuario está autenticado */}
      <Navbar />
       
        {/* Rutas */}
        <Routes>
        <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/crear-jugador" element={<PrivateRoute allowedRoles={['admin','tecnico']}><AddJugador /></PrivateRoute>}/>
          <Route path="/crear-item" element={<PrivateRoute><AddItem /></PrivateRoute>} />
          <Route path="/crear-registro" element={<PrivateRoute><AddRecord /></PrivateRoute>} />
          <Route path="/crear-metrica" element={<PrivateRoute><AddMetrics /></PrivateRoute>}  />
          <Route path="//confirmar-asistencia" element={<PrivateRoute><MatchAttendance /></PrivateRoute>} />  
          <Route path="/ver-consolidado" element={<PrivateRoute><VerConsolidado /></PrivateRoute>} />
          <Route path="/por-jugador" element={<PrivateRoute><MetricsPlayer /></PrivateRoute>} />
          <Route path="/auditoria" element={<PrivateRoute><Audit /></PrivateRoute>} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/no-autorizado" element={<UnauthorizedPage />} />

        </Routes>
        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;

