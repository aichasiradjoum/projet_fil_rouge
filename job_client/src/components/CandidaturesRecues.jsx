// src/components/CandidaturesRecues.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import dayjs from "dayjs";

const CandidaturesRecues = ({ setSelectedCandidature }) => {
  const [offres, setOffres] = useState([]);
  const [candidatures, setCandidatures] = useState({});
  const [loading, setLoading] = useState(true);
  const [offresOuvertes, setOffresOuvertes] = useState({});
  const [activeTab, setActiveTab] = useState("toutes");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();
  

  // Fonction pour calculer les données des candidatures par mois
  const donneesCandidaturesParMois = () => {
    const stats = {};
  
    Object.values(candidatures).flat().forEach((c) => {
      if (!c.created_at) return;
      const mois = dayjs(c.created_at).format("YYYY-MM");
      
      if (!stats[mois]) {
        stats[mois] = { mois, total: 0, selectionne: 0, attente: 0 };
      }
      
      stats[mois].total += 1;
      
      if (c.statut === "selectionne") {
        stats[mois].selectionne += 1;
      } else {
        stats[mois].attente += 1;
      }
    });
  
    return Object.values(stats).sort((a, b) => new Date(a.mois) - new Date(b.mois));
  };

  // Stats pour le tableau de bord
  const getStats = () => {
    const allCandidatures = Object.values(candidatures).flat();
    const total = allCandidatures.length;
    const selectionnes = allCandidatures.filter(c => c.statut === "selectionne").length;
    const enAttente = total - selectionnes;
    
    return { total, selectionnes, enAttente };
  };

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/offres", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.data)) {
          setOffres(response.data.data);
          
          // Charger immédiatement les candidatures pour toutes les offres
          response.data.data.forEach(offre => {
            fetchCandidaturesForOffre(offre.id);
          });
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
  
  const fetchCandidaturesForOffre = async (offreId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/offres/${offreId}/candidatures`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCandidatures((prev) => ({
        ...prev,
        [offreId]: response.data || [],
      }));
    } catch (error) {
      console.error(`Erreur lors du chargement des candidatures pour l'offre ${offreId}:`, error);
      setCandidatures((prev) => ({
        ...prev,
        [offreId]: [],
      }));
    }
  };

  const toggleAffichage = (offreId) => {
    setOffresOuvertes((prev) => ({
      ...prev,
      [offreId]: !prev[offreId],
    }));
  };

  const selectionnerCandidature = async (id, offreId) => {
    if (!window.confirm("Confirmer la sélection de ce candidat ?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.put(`/candidatures/${id}/selection`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mise à jour locale
      setCandidatures((prev) => {
        const updated = { ...prev };
        if (updated[offreId]) {
          updated[offreId] = updated[offreId].map((c) =>
            c.id === id ? { ...c, statut: "selectionne" } : c
          );
        }
        return updated;
      });
    } catch (error) {
      console.error("Erreur lors de la sélection du candidat :", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredOffres = offres.filter(offre => 
    offre.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-3 text-lg text-gray-700">Chargement des candidatures...</p>
    </div>
  );

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Tableau de bord des candidatures</h2>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
              <h3 className="text-blue-800 text-lg font-medium mb-2">Total Candidatures</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
              <h3 className="text-green-800 text-lg font-medium mb-2">Candidats Sélectionnés</h3>
              <p className="text-3xl font-bold text-green-600">{stats.selectionnes}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 shadow-sm">
              <h3 className="text-amber-800 text-lg font-medium mb-2">En Attente</h3>
              <p className="text-3xl font-bold text-amber-600">{stats.enAttente}</p>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Évolution mensuelle</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={donneesCandidaturesParMois()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mois" stroke="#6b7280" />
                  <YAxis allowDecimals={false} stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    name="Total" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="selectionne" 
                    name="Sélectionnés" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="attente" 
                    name="En attente" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ stroke: '#f59e0b', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Répartition des candidatures</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[{ 
                  statut: "Statut", 
                  selectionne: stats.selectionnes, 
                  attente: stats.enAttente 
                }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="statut" stroke="#6b7280" />
                  <YAxis allowDecimals={false} stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} 
                  />
                  <Legend />
                  <Bar dataKey="selectionne" name="Sélectionnés" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attente" name="En attente" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Filtres et recherche */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Liste des offres</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une offre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
                <svg 
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="selectionne">Sélectionnés</option>
                <option value="attente">En attente</option>
              </select>
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex -mb-px space-x-8">
              <button
                onClick={() => setActiveTab("toutes")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "toutes"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Toutes les offres
              </button>
              <button
                onClick={() => setActiveTab("avec_candidatures")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "avec_candidatures"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Avec candidatures
              </button>
              <button
                onClick={() => setActiveTab("sans_candidature")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "sans_candidature"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Sans candidature
              </button>
            </nav>
          </div>

          {filteredOffres.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune offre trouvée</h3>
              <p className="mt-1 text-gray-500">Vous n'avez publié aucune offre correspondant à ces critères.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOffres
                .filter(offre => {
                  const candidaturesForOffre = candidatures[offre.id] || [];
                  if (activeTab === "toutes") return true;
                  if (activeTab === "avec_candidatures") return candidaturesForOffre.length > 0;
                  if (activeTab === "sans_candidature") return candidaturesForOffre.length === 0;
                  return true;
                })
                .map((offre) => {
                  const offreCandidatures = candidatures[offre.id] || [];
                  const filteredCandidatures = filterStatus === "all" 
                    ? offreCandidatures 
                    : offreCandidatures.filter(c => 
                        filterStatus === "selectionne" 
                          ? c.statut === "selectionne" 
                          : c.statut !== "selectionne"
                      );
                  
                  return (
                    <div key={offre.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                      <div 
                        className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleAffichage(offre.id)}
                      >
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{offre.titre}</h3>
                          <div className="flex items-center mt-2 text-sm text-gray-600">
                            <span className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {offreCandidatures.length} candidature{offreCandidatures.length !== 1 ? 's' : ''}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {offreCandidatures.filter(c => c.statut === "selectionne").length} sélectionné{offreCandidatures.filter(c => c.statut === "selectionne").length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${offreCandidatures.length ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {offreCandidatures.length ? `${offreCandidatures.length} candidature${offreCandidatures.length > 1 ? 's' : ''}` : 'Aucune candidature'}
                          </span>
                          <button
                            className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            <svg 
                              className={`h-5 w-5 transition-transform ${offresOuvertes[offre.id] ? 'rotate-180' : ''}`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {offresOuvertes[offre.id] && (
                        <div className="border-t border-gray-200 bg-gray-50 p-6">
                          {filteredCandidatures.length > 0 ? (
                            <ul className="space-y-4">
                              {filteredCandidatures.map((candidature) => (
                                <li
                                  key={candidature.id}
                                  className="bg-white p-5 rounded-lg border shadow-sm hover:shadow transition-shadow"
                                >
                                  <div className="flex flex-col sm:flex-row sm:justify-between">
                                    <div className="mb-4 sm:mb-0">
                                      <h4 className="font-semibold text-lg text-gray-900">
                                        {candidature.etudiant?.user?.name || "Non spécifié"}
                                      </h4>
                                      <p className="text-gray-600">
                                        {candidature.etudiant?.user?.email || "Email non spécifié"}
                                      </p>
                                      
                                      <div className="mt-3">
                                        <h5 className="font-medium text-gray-700 mb-1">Motivation :</h5>
                                        <p className="text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">
                                          {candidature.message || "Aucun message de motivation"}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-start sm:items-end">
                                      <div className={`
                                        px-3 py-1 rounded-full text-xs font-medium mb-4
                                        ${candidature.statut === "selectionne" 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-amber-100 text-amber-800'
                                        }
                                      `}>
                                        {candidature.statut === "selectionne" ? "✅ Sélectionné" : "⏳ En attente"}
                                      </div>
                                      
                                      <div className="text-sm text-gray-500 mb-2">
                                        Candidature reçue le {dayjs(candidature.created_at).format("DD/MM/YYYY")}
                                      </div>
                                      
                                      {candidature.statut !== "selectionne" && (
                                        <button
                                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-sm flex items-center"
                                          onClick={() => selectionnerCandidature(candidature.id, offre.id)}
                                        >
                                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                          Sélectionner
                                        </button>
                                      )}
                                      <button onClick={() => setSelectedCandidature(candidature)}>Ouvrir la messagerie</button>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-center py-8">
                              <svg 
                                className="mx-auto h-12 w-12 text-gray-400" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                              <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune candidature trouvée</h3>
                              <p className="mt-1 text-gray-500">
                                {filterStatus !== "all" 
                                  ? "Aucune candidature ne correspond au filtre sélectionné." 
                                  : "Vous n'avez pas encore reçu de candidature pour cette offre."}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidaturesRecues;