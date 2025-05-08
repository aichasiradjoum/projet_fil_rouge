import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";

const HistoriqueMissions = () => {
  const [missions, setMissions] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [isLoading, setIsLoading] = useState(true);

  const fetchMissions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/etudiant/candidatures/mes-missions");
      setMissions(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const filteredMissions = missions.filter((mission) => {
    if (filtreStatut === "tous") return true;
    return mission.statut === filtreStatut;
  });

  const getStatusIcon = (statut) => {
    switch (statut) {
      case "selectionne":
        return <CheckCircle className="text-green-500" size={18} />;
      case "en_attente":
        return <Clock className="text-amber-500" size={18} />;
      default:
        return <AlertCircle className="text-gray-500" size={18} />;
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case "selectionne":
        return "bg-green-100 text-green-800";
      case "en_attente":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifiée";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Historique des missions</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFiltreStatut("tous")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filtreStatut === "tous" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => setFiltreStatut("en_attente")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filtreStatut === "en_attente" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => setFiltreStatut("selectionne")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filtreStatut === "selectionne" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Sélectionné
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredMissions.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-gray-500 mb-2">Aucune mission trouvée pour ce filtre.</div>
          <p className="text-sm text-gray-400">Essayez un autre filtre ou revenez plus tard</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredMissions.map((mission, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{mission.offre?.titre || "Sans titre"}</h3>
              
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm">{mission.offre?.lieu || "Lieu non spécifié"}</span>
              </div>
              
              <div className="flex items-center mb-3">
                <Calendar size={16} className="mr-1 text-gray-600" />
                <span className="text-sm text-gray-600">Date limite: {formatDate(mission.offre?.date_limite)}</span>
              </div>
              
              <div className="flex items-center">
                <span className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.statut)}`}>
                  {getStatusIcon(mission.statut)}
                  <span className="ml-1">
                    {mission.statut === "selectionne" ? "Sélectionné" : 
                     mission.statut === "en_attente" ? "En attente" : 
                     mission.statut}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoriqueMissions;