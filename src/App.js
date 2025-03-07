import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import { AuthProvider } from "./context/AuthContext"; // Importar AuthProvider


import Home from "./components/Home/Home";
import AddJugador from "./components/AddPlayer/AddPlayer";
import EditPlayer from "./components/EditPlayer/EditPlayer";
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
import RegisterSchool from "./components/RegisterSchool/RegisterSchool";
import IndividualMetrics from "./components/IndividualMetrics/IndividualMetrics";
import AddMultipleRecords from "./components/AddMultipleRecords/AddMultipleRecords";
import AddCategories from "./components/AddCategories/AddCategories"
import AddHeadquarters from "./components/AddHeadquarters/AddHeadquarters"
import WatchTv from "./components/WatchTv/WatchTv";
import Fichajes from "./components/Fichajes/Fichajes";
import SelectSchool from "./components/SelectSchool/SelectSchool"
import AttendanceRegister from "./components/AttendanceRegister/AttendanceRegister"



import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import UnauthorizedPage from './components/UnauthorizedPage/UnauthorizedPage';
import AddTechnicalDirectors from "./components/AddTechnicalDirectors/AddTechnicalDirectors"
import AddUser from "./components/AddUser/Adduser";
import BulkAddPlayers from "./components/BulkAddPlayers/BulkAddPlayers"

import HandlePlayer from "./components/PlayersCRUD/PlayersCRUD"

import ScheduleEvent from "./components/ScheduleEvent/ScheduleEvent"


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
          <Route path="/gestionar-jugador" element={<PrivateRoute allowedRoles={['admin','tecnico','administrativo']}><HandlePlayer /></PrivateRoute>}/>
          <Route path="/crear-item" element={<PrivateRoute><AddItem /></PrivateRoute>} />
          <Route path="/crear-registro" element={<PrivateRoute><AddRecord /></PrivateRoute>} />          
          <Route path="/confirmar-asistencia" element={<PrivateRoute><MatchAttendance /></PrivateRoute>} />  
          <Route path="/crear-registros-masivo" element={<PrivateRoute><AddMultipleRecords /></PrivateRoute>} />  
          

          <Route path="/ver-consolidado" element={<PrivateRoute><VerConsolidado /></PrivateRoute>} />
          
          <Route path="/crear-metrica" element={<PrivateRoute><AddMetrics /></PrivateRoute>}  />
          <Route path="/por-jugador" element={<PrivateRoute><MetricsPlayer /></PrivateRoute>} />
          <Route path="/individual" element={<PrivateRoute><IndividualMetrics /></PrivateRoute>} />
          
          <Route path="/crear-escuela" element={<PrivateRoute><RegisterSchool /></PrivateRoute>} />
          <Route path="/crear-categoria" element={<PrivateRoute><AddCategories /></PrivateRoute>} />
          <Route path="/crear-sede" element={<PrivateRoute><AddHeadquarters /></PrivateRoute>} />
          <Route path="/crear-tecnico" element={<PrivateRoute><AddTechnicalDirectors /></PrivateRoute>} />

          <Route path="/crear-agenda" element={<PrivateRoute><ScheduleEvent /></PrivateRoute>} />

          <Route path="/cargar-csv-players" element={<PrivateRoute><BulkAddPlayers /></PrivateRoute>} />
          <Route path="/players/edit/:id" element={<PrivateRoute><EditPlayer /></PrivateRoute>} />
                   
          <Route path="/select-school" element={<PrivateRoute><SelectSchool /></PrivateRoute>} />
          
          <Route path="/assistance-events" element={<PrivateRoute><AttendanceRegister /></PrivateRoute>} />
          

      

          <Route path="/auditoria" element={<PrivateRoute><Audit /></PrivateRoute>} />
          <Route path="/crear-usuario" element={<PrivateRoute><AddUser /></PrivateRoute>} />
          <Route path="/WatchTv" element={<WatchTv />} />
          <Route path="/Fichajes" element={<Fichajes />} />
          
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


