import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from 'sweetalert2';
import './AddItem.css'; 



const AddItem = () => {
  const [name, setName ]= useState("");
  const [isForGoalkeeper, setIsForGoalkeeper] = useState(false); // Estado del checkbox

  const { user } = useAuth();

  const handleAddItem = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try{
        if (name.trim()) 
        {           
            const type = isForGoalkeeper ? "portero" : "general"; // Definir el tipo de item

            
            const response = await fetch(`${API_URL}/items/create`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name,type,schoolId:user.schoolId}),
            });
            const data = await response.json();
            if(response.ok)
            {
                Swal.fire({
                  title: 'Guardado',
                  text: 'Item creado exitosamente en la base de datos.',
                  icon: 'success',
                  confirmButtonText: 'OK'
              });
              setIsForGoalkeeper(false);
              setName("");
            }
            else{            
                     Swal.fire("Error", "Error creando jugador: " + data.error, "error");
           }       

          
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

        <label>
        <input
          type="checkbox"
          checked={isForGoalkeeper}
          onChange={(e) => setIsForGoalkeeper(e.target.checked)}
        />
        ¿Es una métrica exclusiva para porteros?
      </label>

      <button type="button" onClick={handleAddItem}>Crear item</button>
    </div>
  );
};

export default AddItem;
