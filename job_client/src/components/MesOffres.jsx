// src/components/MesOffres.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

const MesOffres = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    lieu: "",
    type: "",
    date_limite: "",
  });
  const [filterType, setFilterType] = useState("tous");
  const [searchQuery, setSearchQuery] = useState("");

  const offresParMois = () => {
    const stats = {};
  
    offres.forEach((offre) => {
      const mois = dayjs(offre.created_at).format("YYYY-MM");
      stats[mois] = (stats[mois] || 0) + 1;
    });
  
    return Object.entries(stats)
      .map(([mois, total]) => ({ mois, total }))
      .sort((a, b) => new Date(a.mois) - new Date(b.mois));
  };
  
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/offres", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data && Array.isArray(response.data.data)) {
          setOffres(response.data.data);
        } else {
          setOffres([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des offres :", error);
        setOffres([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOffres();
  }, []);
  
  const supprimerOffre = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette offre ?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.destroy(`/offres/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOffres((prev) => prev.filter((offre) => offre.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'offre :", error);
    }
  };

  const commencerEdition = (offre) => {
    setEditingId(offre.id);
    setFormData({
      titre: offre.titre,
      description: offre.description,
      lieu: offre.lieu,
      type: offre.type,
      date_limite: offre.date_limite.split("T")[0],
    });
  };

  const annulerEdition = () => {
    setEditingId(null);
    setFormData({
      titre: "",
      description: "",
      lieu: "",
      type: "",
      date_limite: "",
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const soumettreModification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/offres/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOffres(prev =>
        prev.map(offre => (offre.id === id ? { ...offre, ...formData } : offre))
      );
      annulerEdition();
    } catch (error) {
      console.error("Erreur lors de la modification de l'offre :", error);
    }
  };

  // Obtenir tous les types uniques des offres pour le filtre
  const typesOffres = ["tous", ...new Set(offres.map(offre => offre.type))];

  // Filtrer les offres en fonction des critères
  const offresFiltered = offres.filter(offre => {
    const matchType = filterType === "tous" || offre.type === filterType;
    const matchSearch = offre.titre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        offre.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        offre.lieu.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Mes Offres</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-2 pl-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
          >
            {typesOffres.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Graphique */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Évolution des offres publiées</h3>
        {offresParMois().length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={offresParMois()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="mois" 
                tick={{fill: '#6b7280'}}
                tickFormatter={(val) => {
                  const date = new Date(val);
                  return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
                }}
              />
              <YAxis tick={{fill: '#6b7280'}} />
              <Tooltip 
                contentStyle={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}
                formatter={(value) => [`${value} offres`, 'Total']}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{r: 4, strokeWidth: 2}}
                activeDot={{r: 6, strokeWidth: 0, fill: '#2563eb'}}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            Pas assez de données pour afficher un graphique
          </div>
        )}
      </div>

      {/* Liste des offres */}
      {offresFiltered.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="mt-4 text-gray-600">Aucune offre ne correspond à vos critères de recherche.</p>
          <button 
            onClick={() => {setFilterType("tous"); setSearchQuery("");}}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {offresFiltered.map((offre) => (
            <div 
              key={offre.id} 
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {editingId === offre.id ? (
                // Mode édition
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Titre de l'offre</div>
                  <input
                    type="text"
                    name="titre"
                    value={formData.titre}
                    onChange={handleChange}
                    placeholder="Titre"
                    className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Lieu</div>
                      <input
                        type="text"
                        name="lieu"
                        value={formData.lieu}
                        onChange={handleChange}
                        placeholder="Lieu"
                        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Type de contrat</div>
                      <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        placeholder="Type de contrat"
                        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Date limite</div>
                    <input
                      type="date"
                      name="date_limite"
                      value={formData.date_limite}
                      onChange={handleChange}
                      className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Description</div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Description"
                      rows="4"
                      className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                      onClick={annulerEdition}
                    >
                      Annuler
                    </button>
                    <button
                      className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                      onClick={() => soumettreModification(offre.id)}
                    >
                      Sauvegarder
                    </button>
                  </div>
                </div>
              ) : (
                // Mode affichage
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-2">
                        {offre.type}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{offre.titre}</h3>
                      <div className="flex items-center text-gray-600 mb-4">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {offre.lieu}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm text-gray-500 flex items-center mb-1">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Date limite: {new Date(offre.date_limite).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-gray-700 max-h-40 overflow-y-auto pr-2 mb-4">
                    {offre.description}
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
                      onClick={() => commencerEdition(offre)}
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Modifier
                    </button>
                    <button
                      className="flex items-center px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
                      onClick={() => supprimerOffre(offre.id)}
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesOffres;