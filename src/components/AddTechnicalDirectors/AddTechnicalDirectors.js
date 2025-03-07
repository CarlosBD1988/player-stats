import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import {generateRandomPassword} from "../../Utils/generateRandomPassword"

import Swal from "sweetalert2";

const AddTechnicalDirectors = () => {

  const API_URL = process.env.REACT_APP_API_URL;
  const { user } = useAuth();
  const [directors, setDirectors] = useState([
    { firstName: "", lastName: "", birthDate: "", idType: "", idNumber: "",email:"" }
  ]);
  const [idTypes, setIdTypes] = useState([]);

  useEffect(() => {
    const fetchIdTypes = async () => {
      const querySnapshot = await getDocs(collection(db, "IdTypes"));
      const types = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
      setIdTypes(types);
    };
    fetchIdTypes();
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newDirectors = [...directors];
    newDirectors[index][name] = value;
    setDirectors(newDirectors);
  };

  const addDirector = () => {
    setDirectors([...directors, { firstName: "", lastName: "", birthDate: "", idType: "", idNumber: "",email:"" }]);
  };

  const removeDirector = (index) => {
    setDirectors(directors.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.schoolId) return;
    
    const directorsWithPasswords = directors.map(director => ({
      ...director,
      password: generateRandomPassword()
  }));



    try{
      const response = await fetch(`${API_URL}/technical/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schoolId: user.schoolId,
          directors:directorsWithPasswords,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
              Swal.fire({ icon: "error", title: "Error",text: data.error});
              return;
      }
      Swal.fire({icon: "success",title: "Éxito", text: data.message, });

    }
    catch(error){
        Swal.fire({icon: "error",title: "Error",text: error.message});
    }
    setDirectors([{ firstName: "", lastName: "", birthDate: "", idType: "", idNumber: "" }]);

  };

  return (
    <div>
      <h2>Registrar Directores Técnicos</h2>
      <form onSubmit={handleSubmit}>
        {directors.map((director, index) => (
          <div key={index}>

<label htmlFor={`idType-${index}`}>Tipo de Documento:</label>
            <select
              id={`idType-${index}`}
              name="idType"
              value={director.idType}
              onChange={(e) => handleChange(index, e)}
              required
            >
              <option value="">Seleccione un tipo</option>
              {idTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>

            <label htmlFor={`idNumber-${index}`}>Número de Documento:</label>
            <input
              id={`idNumber-${index}`}
              type="text"
              name="idNumber"
              value={director.idNumber}
              onChange={(e) => handleChange(index, e)}
              placeholder="Número de documento"
              required
            />

            <label htmlFor={`firstName-${index}`}>Nombres:</label>
            <input
              id={`firstName-${index}`}
              type="text"
              name="firstName"
              value={director.firstName}
              onChange={(e) => handleChange(index, e)}
              placeholder="Nombres"
              required
            />

            <label htmlFor={`lastName-${index}`}>Apellidos:</label>
            <input
              id={`lastName-${index}`}
              type="text"
              name="lastName"
              value={director.lastName}
              onChange={(e) => handleChange(index, e)}
              placeholder="Apellidos"
              required
            />

            <label htmlFor={`birthDate-${index}`}>Fecha de Nacimiento:</label>
            <input
              id={`birthDate-${index}`}
              type="date"
              name="birthDate"
              value={director.birthDate}
              onChange={(e) => handleChange(index, e)}
              required
            />

            <label htmlFor={`email-${index}`}>Email:</label>
            <input
              id={`email-${index}`}
              type="email"
              name="email"
              value={director.email}
              onChange={(e) => handleChange(index, e)}
              required
            />

           

            {directors.length > 1 && (
              <button type="button" onClick={() => removeDirector(index)}>
                Eliminar
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addDirector}>Agregar otro director</button>
        <button type="submit">Guardar Directores Técnicos</button>
      </form>
    </div>
  );
};

export default AddTechnicalDirectors;
