import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DatePicker } from "@mui/lab";
import { TextField, Box } from "@mui/material";

const initialData = [
  { week: "Semana 1", programados: 5, asistidos: 4 },
  { week: "Semana 2", programados: 5, asistidos: 3 },
  { week: "Semana 3", programados: 5, asistidos: 5 },
  { week: "Semana 4", programados: 5, asistidos: 2 },
];

const AsistenciaChart = () => {
  const [data, setData] = useState(initialData);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Simulación de filtrado (se puede conectar a una API en el futuro)
  const handleFilter = () => {
    console.log("Filtrando desde", startDate, "hasta", endDate);
    // Aquí podrías modificar `setData` con datos filtrados según el rango de fechas
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, margin: "auto", textAlign: "center" }}>
      <h2>Asistencia por Semana</h2>
      <Box display="flex" justifyContent="center" gap={2} mb={2}>
        <DatePicker
          label="Fecha inicio"
          value={startDate}
          onChange={setStartDate}
          renderInput={(params) => <TextField {...params} />}
        />
        <DatePicker
          label="Fecha fin"
          value={endDate}
          onChange={setEndDate}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="programados" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="asistidos" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AsistenciaChart;
