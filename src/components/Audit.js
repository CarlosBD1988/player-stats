import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Asegúrate de importar tu instancia de Firestore correctamente.

const Audit = () => {
  const [auditRecords, setAuditRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditRecords = async () => {
      try {
        const auditCollection = await getDocs(collection(db, "audit"));
        const playerCollection = collection(db, "players");
        const itemCollection = collection(db, "items");

        const auditData = await Promise.all(
          auditCollection.docs.map(async (auditDoc) => {
            const audit = auditDoc.data();

            // Consultar el nombre del jugador
            const playerDoc = await getDoc(doc(playerCollection, audit.playerId));
            const playerName = playerDoc.exists() ? playerDoc.data().name : "Desconocido";

            // Consultar el nombre del ítem
            const itemDoc = await getDoc(doc(itemCollection, audit.itemId));
            const itemName = itemDoc.exists() ? itemDoc.data().name : "Desconocido";

            return {
              id: auditDoc.id,
              ...audit,
              playerName,
              itemName,
            };
          })
        );

        setAuditRecords(auditData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching audit records:", error);
        setLoading(false);
      }
    };

    fetchAuditRecords();
  }, []);

  if (loading) {
    return <p>Cargando registros de auditoría...</p>;
  }

  return (
    <div className="audit-container">
      <h2>Registros de auditoria</h2>
      <p>Aqui encontraras la trazabilidad de cada record de estadistica  nuevo ingresado a la base de datos y el responsable de la realizacion.</p>
      <table className="audit-table">
        <thead>
          <tr>
            <th>Usuario Responsable</th>
            <th>Acción</th>
            <th>Jugador</th>
            <th>Ítem</th>
            <th>Valor</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {auditRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.user}</td>
              <td>{record.action}</td>
              <td>{record.playerName}</td>
              <td>{record.itemName}</td>
              <td>{record.value}</td>
              <td>{new Date(record.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Audit;
