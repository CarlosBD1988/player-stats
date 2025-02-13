import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const AddHeadquarters = () => {
  const { user } = useAuth();
  const [branches, setBranches] = useState([{ name: "", address: "", description: "" }]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newBranches = [...branches];
    newBranches[index][name] = value;
    setBranches(newBranches);
  };

  const addBranch = () => {
    setBranches([...branches, { name: "", address: "", description: "" }]);
  };

  const removeBranch = (index) => {
    setBranches(branches.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.schoolId) return;

    try {
      const response = await fetch("http://localhost:5000/api/headquarters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schoolId: user.schoolId,
          branches,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar las sedes");
      }

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Sedes guardadas exitosamente.",
      });
      setBranches([{ name: "", address: "", description: "" }]);
    }
    catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  

    
  };

  return (
    <div>
      <h2>Registrar Sedes</h2>
      <form onSubmit={handleSubmit}>
        {branches.map((branch, index) => (
          <div key={index}>
            <label htmlFor={`name-${index}`}>Nombre de la sede:</label>
            <input
              id={`name-${index}`}
              type="text"
              name="name"
              value={branch.name}
              onChange={(e) => handleChange(index, e)}
              placeholder="Nombre"
              required
            />

            <label htmlFor={`address-${index}`}>Dirección:</label>
            <input
              id={`address-${index}`}
              type="text"
              name="address"
              value={branch.address}
              onChange={(e) => handleChange(index, e)}
              placeholder="Dirección"
              required
            />

            <label htmlFor={`description-${index}`}>Descripción:</label>
            <input
              id={`description-${index}`}
              type="text"
              name="description"
              value={branch.description}
              onChange={(e) => handleChange(index, e)}
              placeholder="Descripción"
            />

            {branches.length > 1 && (
              <button type="button" onClick={() => removeBranch(index)}>
                Eliminar
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addBranch}>Agregar otra sede</button>
        <button type="submit">Guardar Sedes</button>
      </form>
    </div>
  );
};

export default AddHeadquarters;
