// src/components/StatistiquesGraph.js
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const StatistiquesGraph = ({ stats }) => {
  const barData = [
    { name: "Étudiants", value: stats.etudiants },
    { name: "Employeurs", value: stats.offreurs },
    { name: "Offres", value: stats.offres },
    { name: "Candidats sélectionnés", value: stats.selectionnes },
  ];

  const pieData = [
    { name: "Actifs", value: stats.actifs },
    { name: "Suspendus", value: stats.suspendus },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Répartition générale</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Utilisateurs par statut</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatistiquesGraph;
