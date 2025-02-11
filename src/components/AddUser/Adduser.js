import { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, addDoc, getDocs, query, where,serverTimestamp  } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { generateRandomPassword } from "../../Utils/generateRandomPassword";


const AddUser = () => {
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("admin");
  const [schoolId, setSchoolId] = useState("");
  const [schools, setSchools] = useState([]);
  const { user } = useAuth();

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
      const usersRef = collection(db, "Users");
      const emailQuery = query(usersRef, where("email", "==", email));
      const existingUsers = await getDocs(emailQuery);
      
      if (!existingUsers.empty) {
        Swal.fire("Error", "El correo electrónico ya está registrado.", "error");
        return;
      }

      const password = generateRandomPassword();
      await addDoc(usersRef, { email, lastname, name, role, schoolId, password,  createdAt: serverTimestamp(),createBy:user.name });

      setEmail("");
      setLastname("");
      setName("");
      setRole("admin");
      setSchoolId("");

      Swal.fire(
        "Éxito", 
        `Usuario creado correctamente.\n\nContraseña generada: ${password}`, 
        "success"
      );
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema al guardar el usuario.", "error");
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
