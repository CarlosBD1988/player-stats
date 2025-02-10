import { useState } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, addDoc , serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

import Swal from 'sweetalert2';
import './AddItem.css'; 



const AddItem = () => {
  const [name, setName ]= useState("");

  const { user } = useAuth();

  const handleAddItem = async () => {

    try{
        if (name.trim()) 
        {
            console.log(name)
            await addDoc(collection(db, "items"), { name, timestamp: serverTimestamp(), schoolId:user.schoolid });
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
            console.log("Item inválido");
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
