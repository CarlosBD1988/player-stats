// src/components/AddPlayer.js
import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc , serverTimestamp } from "firebase/firestore";
import Swal from 'sweetalert2';


import './Form.css'; // Asegúrate de que la ruta sea correcta
const AddPlayer = () => {
  const [name, setName] = useState("");

  const handleAddPlayer = async () => {

    try{
        if (name.trim()) 
        {
            console.log(name)
            await addDoc(collection(db, "players"), { name , timestamp: serverTimestamp() });
            setName("");
            Swal.fire({
                title: 'Guardado',
                text: 'Jugador creado exitosamente en la base de datos.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
        else
        {
            console.log("Nombre inválido");
            Swal.fire({
              title: 'Error',
              text: 'El nombre no puede estar vacío.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
        }

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

  return (
    <div>
      <h2>Agregar Jugador</h2>
      <input
        type="text"
        placeholder="Escribe el nombre del jugador aqui ..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="button" onClick={handleAddPlayer}>Crear jugador</button>
    </div>
  );
};

export default AddPlayer;
