import { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs,  } from "firebase/firestore";
import Swal from "sweetalert2";
import { generateRandomPassword } from "../../Utils/generateRandomPassword";


const AddUser = () => {
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("admin");
  const [schoolId, setSchoolId] = useState("");
  const [schools, setSchools] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSchools = async () => {
      const schoolCollection = collection(db, "Schools");
      const schoolSnapshot = await getDocs(schoolCollection);
      const schoolList = schoolSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSchools(schoolList);
    };
    fetchSchools();
  }, []);

  const handleAddUser = async () => {

    if (!email.trim() || !lastname.trim() || !name.trim() || !schoolId) {
      Swal.fire("Error", "Todos los campos son obligatorios.", "error");
      return;
    }

    try {
      const password = generateRandomPassword();
      const response = await fetch(`${API_URL}/auth/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name,lastname,role, password, schoolId}),
      });

      const data = await response.json();
             
      if (response.ok) 
      {
        Swal.fire(
          "Éxito", 
          `Usuario creado correctamente.\n\nContraseña generada: ${password}`, 
          "success"
        );
      }
      else{
              Swal.fire("Error", data.error, "error");
      }

      setEmail("");
      setLastname("");
      setName("");
      setRole("admin");
      setSchoolId("");

     
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema al crear el usuario.", "error");
    }
  };

  return (
    <div>
      <h2>Agregar Nuevo Usuario</h2>
      <input type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Nombres" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Apellidos" value={lastname} onChange={(e) => setLastname(e.target.value)} />
      
      <select value={role} onChange={(e) => setRole(e.target.value.toLowerCase())}>
        <option value="admin">Admin</option>
        <option value="administrativo">Administrativo</option>
        <option value="tecnico">Tecnico</option>
        <option value="jugador">Jugador</option>
      </select>

      <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)}>
        <option value="">Selecciona una escuela</option>
        {schools.map((school) => (
          <option key={school.id} value={school.id}>
            {school.nameSchool}
          </option>
        ))}
      </select>

      <button type="button" onClick={handleAddUser}>Crear Usuario</button>
    </div>
  );
};

export default AddUser;
