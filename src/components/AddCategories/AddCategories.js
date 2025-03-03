import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const AddCategories = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([{ name: "", description: "" }]);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newCategories = [...categories];
    newCategories[index][name] = value;
    setCategories(newCategories);
  };

  const addCategory = () => {
    setCategories([...categories, { name: "", description: "" }]);
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.schoolId) return;
    try {
           const response = await fetch(`${API_URL}/categories`, {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify({
               schoolId: user.schoolId,
               categories,
             }),
           });

           const data = await response.json();
     
           if (!response.ok) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: data.error,
              });
              return;
           }
     
           Swal.fire({
             icon: "success",
             title: "Éxito",
             text: data.message,
           });
           setCategories([{ name: "",description: "" }]);
         }
         catch (error) {
           Swal.fire({
             icon: "error",
             title: "Error",
             text: error.message,
           });
         }     


    setCategories([{ name: "", description: "" }]);
  };

  return (
    <div>
      <h2>Registrar Categorías</h2>
      <form onSubmit={handleSubmit}>
        {categories.map((category, index) => (
          <div key={index}>

            <label htmlFor="name">Nombre categoria:</label>
            <input id="name" type="text" name="name" 
            value={category.name} 
            onChange={(e) => handleChange(index, e)} 
            placeholder="Nombre" required />
            
            <label htmlFor="description">Descripcion:</label>
            <input id="description" type="text" name="description" 
            value={category.description} 
            onChange={(e) => handleChange(index, e)} 
            placeholder="Descripción" />

            {categories.length > 1 && <button type="button" onClick={() => removeCategory(index)}>Eliminar</button>}
          </div>
        ))}
        <button type="button" onClick={addCategory}>Agregar otra categoría</button>
        <button type="submit">Guardar Categorías</button>
      </form>
    </div>
  );
};

export default AddCategories;
