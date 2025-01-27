import React, { useState } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";

import Swal from "sweetalert2";

const RegisterSchool = () => {

    const [formData, setFormData] = useState({
        schoolName: "",
        schoolNIT: "",
        schoolAddress: "",
        schoolPhone: "",
        schoolEmail: "",
        schoolWebsite: "",
        representativeName: "",
        representativeLastName: "",
        representativePhone: "",
        representativeEmail: "",
        department: "",
        city: "",
      });

      const departmentsAndCities = [
        { department: "Amazonas", cities: ["Leticia"] },
        { department: "Antioquia", cities: ["Medellín"] },
        { department: "Arauca", cities: ["Arauca"] },
        { department: "Atlántico", cities: ["Barranquilla"] },
        { department: "Bolívar", cities: ["Cartagena"] },
        { department: "Boyacá", cities: ["Tunja"] },
        { department: "Caldas", cities: ["Manizales"] },
        { department: "Caquetá", cities: ["Florencia"] },
        { department: "Casanare", cities: ["Yopal"] },
        { department: "Cauca", cities: ["Popayán"] },
        { department: "Cesar", cities: ["Valledupar"] },
        { department: "Chocó", cities: ["Quibdó"] },
        { department: "Córdoba", cities: ["Montería"] },
        { department: "Cundinamarca", cities: ["Bogotá"] },
        { department: "Guainía", cities: ["Inírida"] },
        { department: "Guaviare", cities: ["San José del Guaviare"] },
        { department: "Huila", cities: ["Neiva"] },
        { department: "La Guajira", cities: ["Riohacha"] },
        { department: "Magdalena", cities: ["Santa Marta"] },
        { department: "Meta", cities: ["Villavicencio"] },
        { department: "Nariño", cities: ["Pasto"] },
        { department: "Norte de Santander", cities: ["Cúcuta"] },
        { department: "Putumayo", cities: ["Mocoa"] },
        { department: "Quindío", cities: ["Armenia"] },
        { department: "Risaralda", cities: ["Pereira"] },
        { department: "San Andrés y Providencia", cities: ["San Andrés"] },
        { department: "Santander", cities: ["Bucaramanga","Floridablanca","Piedecuesta","Giron"] },    
        { department: "Sucre", cities: ["Sincelejo"] },
        { department: "Tolima", cities: ["Ibagué"] },
        { department: "Valle del Cauca", cities: ["Cali"] },
        { department: "Vaupés", cities: ["Mitú"] },
        { department: "Vichada", cities: ["Puerto Carreño"] },
      ];

      const handleDepartmentChange = (e) => {
        const department = e.target.value;
        setFormData({
          ...formData,
          department,
          city: "", // Reset city when department changes
        });
      };


    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
      };

      const generateRandomPassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < 8; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
      };

      const handleSubmit = async (e) => {
        e.preventDefault();

        try{
        const nitQuery = query(collection(db, "Schools"),where("nit", "==", formData.schoolNIT));
        const nitSnapshot = await getDocs(nitQuery);    
        if (!nitSnapshot.empty) {
            Swal.fire({
              icon: "error",
              title: "NIT ya registrado",
              text: "El NIT o identificación ingresado ya existe en la base de datos.",
            });
            return;
        }

        // Create the school document
        const schoolDocRef = await addDoc(collection(db, "Schools"), {
            nameSchool: formData.schoolName,
            nit: formData.schoolNIT,
            address: formData.schoolAddress,
            phone: formData.schoolPhone,
            email: formData.schoolEmail,
            website: formData.schoolWebsite,
            nameRepresentative: formData.representativeName,
            lastname: formData.representativeLastName,
            department: formData.department,
            city: formData.city,
            createdAt: serverTimestamp(),
          });

          const schoolId = schoolDocRef.id;
          const password = generateRandomPassword();
          await addDoc(collection(db, "Users"), {
            email: formData.representativeEmail,
            name: formData.representativeName,
            lastname: formData.representativeLastName,
            role: "tecnico",
            password: password,
            schoolId: schoolId,
            createdAt: serverTimestamp(),
          });

          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Escuela y usuario creados exitosamente.",
          });

          setFormData({
            schoolName: "",
            schoolNIT: "",
            schoolAddress: "",
            schoolPhone: "",
            schoolEmail: "",
            schoolWebsite: "",
            representativeName: "",
            representativeLastName: "",
            representativePhone: "",
            representativeEmail: "",
            department: "",
            city: "",
          });
        }catch (error) {
            console.error("Error al crear la escuela o el usuario: ", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Ocurrió un error, por favor intente nuevamente.",
            });
          }
      }

  return (
    <div>      
        <h1>Crear Nueva Escuela</h1>    
       <form onSubmit={handleSubmit}>
          <h2 >Información Básica</h2>
          <div >
            <div>
              <label htmlFor="schoolName">Nombre de la Escuela:</label>
              <input id="schoolName" type="text" placeholder="Ingrese el nombre de la empresa"  value={formData.schoolName}
            onChange={handleChange} required/>
            </div>
            <div>
              <label htmlFor="schoolNIT">NIT o Identificación:</label>
              <input id="schoolNIT" type="text" placeholder="Ingrese el NIT o identificación" value={formData.schoolNIT}
            onChange={handleChange} required/>
            </div>
          </div>     
      
        {/* Información de Contacto */}
         <h2 >Información de Contacto</h2>
          <div >
            <div>
              <label htmlFor="schoolAddress">Dirección:</label>
              <input id="schoolAddress" type="text" placeholder="Ingrese la dirección" value={formData.address}
            onChange={handleChange} required/>
            </div>

            <div>
            <label htmlFor="department">Departamento:</label>
            <select
              id="department"
              value={formData.department}
              onChange={handleDepartmentChange}
              required
            >
              <option value="">Seleccione un departamento</option>
              {departmentsAndCities.map((item) => (
                <option key={item.department} value={item.department}>
                  {item.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="city">Ciudad:</label>
            <select
              id="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={!formData.department}
            >
              <option value="">Seleccione una ciudad</option>
              {departmentsAndCities
                .find((item) => item.department === formData.department)?.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </div>
            <div>
              <label htmlFor="schoolPhone">Teléfono:</label>
              <input id="schoolPhone" type="text" placeholder="Ingrese el teléfono" value={formData.schoolPhone}
            onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="schoolEmail">Correo Electrónico:</label>
              <input id="schoolEmail" type="email" placeholder="Ingrese el correo electrónico" value={formData.schoolEmail}
            onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="schoolWebsite">Página Web:</label>
              <input id="schoolWebsite" type="url" placeholder="Ingrese la URL de la página web" value={formData.schoolWebsite}
            onChange={handleChange} />
            </div>
          </div>   

        {/* Representante o Contacto Principal */}
          <h2 >Representante o Contacto Principal</h2>
          <div >
            <div>
              <label htmlFor="representativeName">Nombres:</label>
              <input id="representativeName" type="text" placeholder="Ingrese el nombre del representante" value={formData.representativeName}
            onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="representativeName">Apellidos:</label>
              <input id="representativeLastName" type="text" placeholder="Ingrese el apellido del representante" value={formData.representativeLastName}
            onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="representativePhone">Teléfono:</label>
              <input id="representativePhone" type="text" placeholder="Ingrese el teléfono del representante" value={formData.representativePhone}
            onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="representativeEmail">Correo Electrónico:</label>
              <input id="representativeEmail" type="email" placeholder="Ingrese el correo electrónico del representante" value={formData.representativeEmail}
            onChange={handleChange} required/>
            </div>
          </div>  

        <button>Guardar Empresa</button>
        </form>
      </div>
      
 
  );
};

export default RegisterSchool;

