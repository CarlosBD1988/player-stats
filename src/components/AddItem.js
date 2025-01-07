// src/components/AddPlayer.js
import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc , serverTimestamp } from "firebase/firestore";
import Swal from 'sweetalert2';

const AddItem = () => {
  const [name, setName ]= useState("");

  const handleAddItem = async () => {

    try{
        if (name.trim()) 
        {
            console.log(name)
            await addDoc(collection(db, "items"), { name, timestamp: serverTimestamp() });
            setName("");
            Swal.fire({
                title: 'Guardado',
                text: 'Item creado exitosamente en la base de datos.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
        else
        {
            console.log("Itme inválido");
            Swal.fire({
              title: 'Error',
              text: 'El nombre del item no puede estar vacío.',
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
            text: 'Hubo un problema al guardar el item.',
            icon: 'error',
            confirmButtonText: 'OK'
          });

    }
 
  };

  return (
    <div>
      <h2>Agregar tipo de estadistica a medir:</h2>
      <input
        type="text"
        placeholder="Escribe el nombre del item  a evualuar aqui ..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="button" onClick={handleAddItem}>Crear item</button>
    </div>
  );
};

export default AddItem;
