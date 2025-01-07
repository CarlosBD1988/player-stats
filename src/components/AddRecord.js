// src/components/AddRecord.js
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs , query, where} from "firebase/firestore";
import Swal from 'sweetalert2';

const AddRecord = () => {
  const [players, setPlayers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const playerSnapshot = await getDocs(collection(db, "players"));
      const itemSnapshot = await getDocs(collection(db, "items"));
      setPlayers(playerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setItems(itemSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleAddRecord = async () => {
    if (selectedPlayer && selectedItem && value) {
      // Mostrar SweetAlert para pedir el PIN
      Swal.fire({
        title: "Ingrese el PIN",
        input: "password", // Oculta los caracteres para mayor seguridad
        inputPlaceholder: "Ingrese su PIN de 4 dígitos",
        inputAttributes: {
          maxlength: 4,
          autocapitalize: "off",
          autocorrect: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Validar",
        cancelButtonText: "Cancelar",
        customClass: {
            input: 'custom-input', 
            popup: "custom-swal-popup",
          },
        preConfirm: async (pin) => {
          if (!pin || pin.length !== 4) {
            Swal.showValidationMessage("Debe ingresar un PIN válido de 4 dígitos.");
          }
          return pin; // Retorna el PIN ingresado
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const pin = result.value;
            console.log(pin)
          // Validar el PIN en la colección Tokens
          const tokenResponsable = await validarToken(pin);
          console.log(tokenResponsable)
          if (tokenResponsable) {
            // Si el PIN es válido, realizar la acción original
            await addDoc(collection(db, "records"), {
              playerId: selectedPlayer,
              itemId: selectedItem,
              value: parseInt(value),
              date: new Date().toISOString(),
            });
  
            Swal.fire({
              title: "Guardado",
              text: "Estadística registrada correctamente.",
              icon: "success",
              confirmButtonText: "OK",
            });
            //Almacenar registro de auditoria
            await addDoc(collection(db, "audit"), {
              user: tokenResponsable,
              actionn:"new record",
              playerId: selectedPlayer,
              itemId: selectedItem,
              value: parseInt(value),
              date: new Date().toISOString(),
            });
  
            setValue("");
          } else {
            // Si el PIN no es válido
            Swal.fire({
              title: "Acceso Denegado",
              text: "El PIN ingresado no es válido o no tiene permisos.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } else {
          Swal.fire("Cancelado", "La acción ha sido cancelada.", "info");
        }
      });
    } else {
      Swal.fire("Error", "Por favor complete todos los campos antes de guardar.", "error");
    }
  };


  const validarToken = async (pin) => {
    try {
      // Buscar el token en la colección Tokens
      const tokenRef = collection(db, "Tokens");
      const q = query(tokenRef, where("tokenRef", "==", pin)); // Validar por el campo tokenRef
      const snapshot = await getDocs(q);
  
      if (!snapshot.empty) {
        const tokenDoc = snapshot.docs[0].data();
        return tokenDoc.user; // Retorna el nombre del usuario responsable
      } else {
        return null; // No existe el token
      }
    } catch (error) {
      console.error("Error al validar el token:", error);
      return null;
    }
  };


  return (
    <div>
      <h2>Agregar Registro</h2>
      <select onChange={(e) => setSelectedPlayer(e.target.value)}>
        <option value="">Seleccionar jugador</option>
        {players.map((player) => (
          <option key={player.id} value={player.id}>
            {player.name}
          </option>
        ))}
      </select>
      <select onChange={(e) => setSelectedItem(e.target.value)}>
        <option value="">Seleccionar item</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Valor"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleAddRecord}>Agregar</button>
    </div>
  );
};

export default AddRecord;
