// src/components/AddPlayer.js
import { useState,useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, addDoc,  getDocs,  query,   where,   updateDoc,   serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import {generateRandomPassword} from "../../Utils/generateRandomPassword"

import { americanCountries , southAmericanTeams, playerPositions} from "../../Utils/auxiliaryDataForPlayers"
import Swal from 'sweetalert2';
import './AddPlayer.css'; 

const AddPlayer = () => {
  
    const { user } = useAuth();
  const [idTypes, setIdTypes] = useState([]);// Para almacenar los tipos de documento desde la BD
  const [idType, setIdType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mail, setMail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");   
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [fanTeam, setFanTeam] = useState("");

  const handleAddPlayer = async () => {

    try
    {
      if (!name.trim() || !documentNumber.trim()) {
        Swal.fire({
          title: 'Error',
          text: 'El nombre y el número de documento son obligatorios.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }

      const playersCollection = collection(db, "players");
      // Verificar si el número de identificación ya existe
      const queryById = query(playersCollection, where("documentNumber", "==", documentNumber));
      const existingById = await getDocs(queryById);
      if (!existingById.empty) {
        Swal.fire({
          title: 'Error',
          text: 'El número de identificación ya existe en la base de datos.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;      
      }
        // Verificar si el nombre del jugador ya existe
        const queryByName = query(playersCollection, where("name", "==", name));
        const existingByName = await getDocs(queryByName);

        if (!existingByName.empty) {
          const playerDoc = existingByName.docs[0]; // Tomar el primer resultado
          await updateDoc(playerDoc.ref, {
            weight,
            height,
            birthDate,
            country,
            position,
            fanTeam,
            idType,
            documentNumber,
            schoolId:user.schoolId,
            updatedAt: serverTimestamp()
          });
          Swal.fire({
            title: 'Actualización Exitosa',
            text: 'Los datos del jugador han sido actualizados correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }else {
          // Si no existe ni por ID ni por nombre, creamos un nuevo jugador
          const playerRef =await addDoc(playersCollection, {
            name,
            lastName,
            weight,
            height,
            birthDate,
            country,
            position,
            fanTeam,
            idType,
            documentNumber,
            email:mail,
            schoolId:user.schoolId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

            const password = generateRandomPassword();
            await addDoc(collection(db, "Users"), {
                        email: mail,
                        name: name,                        
                        lastname: lastName,
                        role: "jugador",
                        password: password,
                        schoolId: user.schoolId,     
                        playerId: playerRef.id,
                        createdAt: serverTimestamp(),
            });

          Swal.fire({
            title: 'Guardado Exitoso',
            text: 'El jugador y usuario de acceso han sido creado exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
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
      <img src="logo.png" alt="Decorativo" className="log-players" />   
      <h2>Nuevo Jugador</h2>        
      <label htmlFor="playerIdType">Tipo de identificacion:</label>
      <select id="playerIdType" value={idType} onChange={(e) => setIdType(e.target.value)}>
        <option value="">Selecciona un tipo de documento</option>
        {idTypes.map((type) => (
          <option key={type.id} value={type.name}>{type.name}</option>
        ))}
      </select>

      <label htmlFor="playerId">Numero de identificacion:</label>
      <input id="playerId" type="number" placeholder="Número de documento" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)}/>

      <label htmlFor="playerName">Nombres:</label>
      <input id="playerName" type="text" placeholder="Escribe el nombre del jugador" value={name} onChange={(e) => setName(e.target.value)}/>

      <label htmlFor="playerLastName">Apellidos:</label>
      <input id="playerLastName" type="text" placeholder="Escribe los apellidos del jugador" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
      
      <label htmlFor="playerBirthDate">Fecha de Nacimiento:</label>
      <input id="playerBirthDate" type="date" placeholder="Fecha de nacimiento" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="styled-date"/>

      <label htmlFor="playerWeight">Peso (Kg):</label>
      <input id="playerWeight" type="number" placeholder="Peso (kg)" value={weight} onChange={(e) => setWeight(e.target.value)}/>

      <label htmlFor="playerHeight">Estatura (Cm):</label>
      <input id="playerHeight" type="number" placeholder="Altura (cm)" value={height} onChange={(e) => setHeight(e.target.value)}/>

      <label htmlFor="playerCountry">Pais:</label>
      <select id="playerCountry" value={country} onChange={(e) => setCountry(e.target.value)} >
        <option value="">Selecciona un país</option>
        {americanCountries.map((country, index) => (
          <option key={index} value={country}>{country}</option>
        ))}
      </select>

      <label htmlFor="playerPosition">Posicion:</label>
      <select id="playerPosition" value={position} onChange={(e) => setPosition(e.target.value)}>
        <option value="">Selecciona una posición</option>
        {playerPositions.map((pos, index) => (
          <option key={index} value={pos}>{pos}</option>
        ))}
      </select>

      <label htmlFor="playerFanTeam">Team:</label>
      <select id="playerFanTeam" value={fanTeam} onChange={(e) => setFanTeam(e.target.value)}>
        <option value="">Equipo de fútbol favorito</option>
        {southAmericanTeams.map((team, index) => (
          <option key={index} value={team}>{team}</option>
        ))}
      </select>

      <label htmlFor="playerEmail">Email:</label>
      <input id="playerEmail" type="email" placeholder="Email para inicion de sesion" value={mail} onChange={(e) => setMail(e.target.value)}/>
      <button className button type="button" onClick={handleAddPlayer}>Crear jugador</button>
    </div>
  );
};

export default AddPlayer;