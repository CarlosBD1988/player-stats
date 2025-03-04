import React, { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
//import { useAuth } from "../../context/AuthContext"; // Importar el contexto de autenticación

//import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;


const SelectSchool = () => {

const [shools, setSchools] = useState([]);

const fetchSchools = useCallback(async () => {
    try {
        const response = await fetch(`${API_URL}/schools/list-schools`,{
            method: "POST",
        });
        const data = await response.json();  
        setSchools(data);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  }, []); 

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

    return(
    <div>
            <h2>Seleccionar escuela.</h2>

            <table>
        <thead>
          <tr>
            <th>Nombre escuela</th>
            <th>NIT</th>
            <th>representante legal</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {shools.map((school) => (
            <tr key={school.id}>
              <td>{school.nameSchool}</td>
              <td>{school.nit}</td>
              <td>{school.nameRepresentative} {school.lastname} </td>
              <td>
                <button>
                  Seleccionar
                </button>                
              </td>
            </tr>
          ))}
        </tbody>
      </table>




    </div>

    )       
};

export default SelectSchool;