// src/components/AddPlayer.js
import { useState,useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs,  } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import {generateRandomPassword} from "../../Utils/generateRandomPassword"

import { americanCountries , southAmericanTeams, playerPositions} from "../../Utils/auxiliaryDataForPlayers"
import Swal from 'sweetalert2';
//import './AddPlayer.css'; 

const AddPlayer = () => {
  
    const { user } = useAuth();
  const [idTypes, setIdTypes] = useState([]);// Para almacenar los tipos de documento desde la BD
  const [idType, setIdType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setMail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");   
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [fanTeam, setFanTeam] = useState("");

  const [loading, setLoading] = useState(false); 

  const handleAddPlayer = async () => {

    try
    {
      setLoading(true); 
      if ( !idType.trim() || !documentNumber.trim() || !name.trim() || !lastname.trim() || !birthDate.trim() || !weight.trim() || !height.trim() || !country.trim() || !fanTeam.trim() || !position.trim() || !email.trim()   ) {
        Swal.fire({
          title: 'Error',
          text: 'Todos los datos son obligatorios.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }

      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/players/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name,lastname,weight, height,birthDate,country,position,fanTeam,idType,documentNumber,email, schoolId:user.schoolId,}),
      });
      
      const data = await response.json();
      if(response.ok)
      {
        const password = generateRandomPassword();
        const role="jugador";
        const responseUser = await fetch(`${API_URL}/auth/create-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name,lastname,role, password, schoolId:user.schoolId}),
        });  
       

        const dataUser = await responseUser.json();
        if(responseUser.ok)
        {
           Swal.fire(
                    "Éxito", 
                    `Jugador y usuario creado correctamente.\n\nContraseña generada: ${password}`, 
                    "success"
                  );
        }
        else{
          Swal.fire("Error", "Jugador creado exitosamente, usuario del sistema pendiente error:"+ dataUser.error, "error");
        }

          
      }
      else{

         Swal.fire("Error", "Error creando jugador: " + data.error, "error");
      }   
      
      // Limpiar el formulario
      setName("");
      setWeight("");
      setHeight("");
      setBirthDate("");
      setCountry("");
      setPosition("");
      setFanTeam("");
      setIdType("");
      setDocumentNumber("");   
      setLastName("");
      setMail("");
    }
    catch(error)
    {
        console.log(error)
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al guardar el jugador.',
            icon: 'error',
            confirmButtonText: 'OK'
          });

    }
    finally {
      setLoading(false); // Finalizar el estado de carga
    }
 
  };


 // Obtener los tipos de documento desde Firestore
 useEffect(() => {
  const fetchIdTypes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "IdTypes"));
      const types = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
      setIdTypes(types);
    } catch (error) {
      console.error("Error al cargar los tipos de documento:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los tipos de documento.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };
  fetchIdTypes();
}, [user.schoolId]);

  
  return (
    
    <div className="formu-addplayer">
     
      <h2>Nuevo Jugador</h2>        
      <label htmlFor="playerIdType">Tipo de identificacion:</label>
      <select id="playerIdType" value={idType} onChange={(e) => setIdType(e.target.value)} required> 
        <option value="">Selecciona un tipo de documento</option>
        {idTypes.map((type) => (
          <option key={type.id} value={type.name}>{type.name}</option>
        ))}
      </select>

      <label htmlFor="playerId">Numero de identificacion:</label>
      <input id="playerId" type="number" placeholder="Número de documento" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} required/>

      <label htmlFor="playerName">Nombres:</label>
      <input id="playerName" type="text" placeholder="Escribe el nombre del jugador" value={name} onChange={(e) => setName(e.target.value)} required/>

      <label htmlFor="playerLastName">Apellidos:</label>
      <input id="playerLastName" type="text" placeholder="Escribe los apellidos del jugador" value={lastname} onChange={(e) => setLastName(e.target.value)} required/>
      
      <label htmlFor="playerBirthDate">Fecha de Nacimiento:</label>
      <input id="playerBirthDate" type="date" placeholder="Fecha de nacimiento" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="styled-date" required/>

      <label htmlFor="playerWeight">Peso (Kg):</label>
      <input id="playerWeight" type="number" placeholder="Peso (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required/>

      <label htmlFor="playerHeight">Estatura (Cm):</label>
      <input id="playerHeight" type="number" placeholder="Altura (cm)" value={height} onChange={(e) => setHeight(e.target.value)} required/>

      <label htmlFor="playerCountry">Pais:</label>
      <select id="playerCountry" value={country} onChange={(e) => setCountry(e.target.value)} required >
        <option value="">Selecciona un país</option>
        {americanCountries.map((country, index) => (
          <option key={index} value={country}>{country}</option>
        ))}
      </select>

      <label htmlFor="playerPosition">Posicion:</label>
      <select id="playerPosition" value={position} onChange={(e) => setPosition(e.target.value)} required>
        <option value="">Selecciona una posición</option>
        {playerPositions.map((pos, index) => (
          <option key={index} value={pos}>{pos}</option>
        ))}
      </select>

      <label htmlFor="playerFanTeam">Team:</label>
      <select id="playerFanTeam" value={fanTeam} onChange={(e) => setFanTeam(e.target.value)} required>
        <option value="">Equipo de fútbol favorito</option>
        {southAmericanTeams.map((team, index) => (
          <option key={index} value={team}>{team}</option>
        ))}
      </select>

      <label htmlFor="playerEmail">Email:</label>
      <input id="playerEmail" type="email" placeholder="Email para inicion de sesion" value={email} onChange={(e) => setMail(e.target.value)} required/>
      
      <button 
          type="button" 
          onClick={handleAddPlayer} 
          disabled={loading} 
          className={loading ? "loading-button" : ""}
        >
          {loading ? "Guardando datos..." : "Crear jugador"}
      </button>

    </div>
  );
};

export default AddPlayer;