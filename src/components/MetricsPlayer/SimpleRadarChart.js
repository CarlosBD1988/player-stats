import React from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from "recharts";

const SimpleRadarChart = ({ metrics }) => {
  // Estructura de datos para el gráfico de radar
  const data = [
    { subject: 'Ritmo', A: metrics.ritmo, fullMark: 100 },
    { subject: 'Tiro', A: metrics.tiro, fullMark: 100 },
    { subject: 'Pase', A: metrics.pase, fullMark: 100 },
    { subject: 'Regate', A: metrics.regate, fullMark: 100 },
    { subject: 'Defensa', A: metrics.defensa, fullMark: 100 },
    { subject: 'Cabeza', A: metrics.cabeza, fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart outerRadius="100%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis />
        <Radar name="Player Metrics" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default SimpleRadarChart;
