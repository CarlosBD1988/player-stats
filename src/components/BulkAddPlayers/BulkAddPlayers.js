import { useState } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { generateRandomPassword } from "../../Utils/generateRandomPassword";
import Swal from "sweetalert2";
import Papa from "papaparse"; // Librería para leer CSV

const BulkAddPlayers = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);

  // Manejo de carga de archivos
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Procesar el archivo CSV
  const handleUpload = async () => {
    if (!file) {
      Swal.fire("Error", "Selecciona un archivo CSV", "error");
      return;
    }

    Papa.parse(file, {
      complete: async (result) => {
        const playersData = result.data;
        let successCount = 0;
        let errorCount = 0;

        for (const row of playersData) {
          const [idType, documentNumber, name, lastName, birthDate, weight, height, country, position, fanTeam, mail] = row;
          
          if (!documentNumber || !name) {
            errorCount++;
            continue;
          }

          try {
            const playersCollection = collection(db, "players");

            // Verificar si el jugador ya existe
            const queryById = query(playersCollection, where("documentNumber", "==", documentNumber));
            const existingById = await getDocs(queryById);
            if (!existingById.empty) {
              errorCount++;
              continue;
            }

            // Crear jugador en la base de datos
            const playerRef = await addDoc(playersCollection, {
              idType,
              documentNumber,
              name,
              lastName,
              birthDate,
              weight,
              height,
              country,
              position,
              fanTeam,
              email: mail,
              schoolId: user.schoolId,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });

            // Crear usuario asociado con rol de técnico
            const password = generateRandomPassword();
            await addDoc(collection(db, "Users"), {
              email: mail,
              name,
              lastname: lastName,
              role: "jugador",
              password,
              schoolId: user.schoolId,
              playerId: playerRef.id,
              createdAt: serverTimestamp(),
            });

            successCount++;
          } catch (error) {
            console.error("Error al guardar jugador:", error);
            errorCount++;
          }
        }

        Swal.fire("Proceso Finalizado", `Jugadores creados: ${successCount}\nErrores: ${errorCount}`, "info");
      },
      header: true,
      skipEmptyLines: true,
      delimiter: ";",
    });
  };

  return (
    <div>
      <h2>Importar Jugadores desde CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir y Procesar</button>
    </div>
  );
};

export default BulkAddPlayers;
