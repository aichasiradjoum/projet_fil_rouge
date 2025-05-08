import React, { useEffect, useState } from "react";
import api from "../api/axios";

const MesCandidatures = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [filterStatus, setFilterStatus] = useState("tous");

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const fetchCandidatures = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get("/etudiant/candidatures", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCandidatures(response.data);
      setError(null);
    } catch (error) {
      console.error("Erreur lors du chargement des candidatures :", error);
      setError("Impossible de charger vos candidatures. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const supprimerCandidature = async (id) => {
    try {
      setDeleteLoading(id);
      const token = localStorage.getItem("token");
      await api.delete(`/etudiant/candidatures/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCandidatures((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      setError("La suppression a échoué. Veuillez réessayer.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeleteLoading(null);
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir retirer cette candidature ?")) {
      supprimerCandidature(id);
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      "en_attente": {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        )
      },
      "acceptée": {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        )
      },
      "refusée": {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        )
      },
      "entretien": {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        )
      }
    };

    const defaultStatus = {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    };

    const statusInfo = statuses[status?.toLowerCase()] || defaultStatus;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
        {statusInfo.icon}
        {status || "En attente"}
      </span>
    );
  };

  const getDateFormatee = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return "Date inconnue";
    }
  };

  const filteredCandidatures = candidatures.filter(c => {
    if (filterStatus === "tous") return true;
    return (c.statut || "en attente").toLowerCase() === filterStatus.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header avec filtres */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Mes candidatures</h2>
          <p className="text-sm text-gray-500 mt-1">
            {candidatures.length} candidature{candidatures.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        
        <div className="mt-3 sm:mt-0">
          <div className="inline-flex items-center rounded-md shadow-sm">
            <button 
              onClick={() => setFilterStatus("tous")}
              className={`px-3 py-1.5 text-xs font-medium rounded-l-md border ${
                filterStatus === "tous" 
                  ? "bg-blue-50 text-blue-700 border-blue-300" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Tous
            </button>
            <button 
              onClick={() => setFilterStatus("en attente")}
              className={`px-3 py-1.5 text-xs font-medium border-t border-b ${
                filterStatus === "en attente" 
                  ? "bg-yellow-50 text-yellow-700 border-yellow-300" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              En attente
            </button>
            <button 
              onClick={() => setFilterStatus("entretien")}
              className={`px-3 py-1.5 text-xs font-medium border-t border-b ${
                filterStatus === "entretien" 
                  ? "bg-blue-50 text-blue-700 border-blue-300" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Entretien
            </button>
            <button 
              onClick={() => setFilterStatus("acceptée")}
              className={`px-3 py-1.5 text-xs font-medium border-t border-b ${
                filterStatus === "acceptée" 
                  ? "bg-green-50 text-green-700 border-green-300" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Acceptées
            </button>
            <button 
              onClick={() => setFilterStatus("refusée")}
              className={`px-3 py-1.5 text-xs font-medium rounded-r-md border ${
                filterStatus === "refusée" 
                  ? "bg-red-50 text-red-700 border-red-300" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Refusées
            </button>
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Liste des candidatures */}
      {filteredCandidatures.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-gray-200">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 text-gray-400 mb-4">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {candidatures.length === 0 
              ? "Vous n'avez pas encore postulé" 
              : "Aucune candidature ne correspond au filtre"
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {candidatures.length === 0 
              ? "Explorez les offres disponibles et postulez pour commencer votre parcours professionnel" 
              : "Changez le filtre ou revenez plus tard"
            }
          </p>
          {candidatures.length === 0 && (
            <button 
              onClick={() => window.location.href = "#offres"}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voir les offres
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCandidatures.map((candidature) => (
            <div
              key={candidature.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
            >
              <div className="px-6 py-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {candidature.offre.titre}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {candidature.offre.lieu}
                      <span className="mx-2">•</span>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      {candidature.offre.type}
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(candidature.statut)}
                  </div>
                </div>

                {candidature.message && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-md text-sm text-gray-700 border border-gray-100">
                    <div className="font-medium text-gray-900 mb-1">Votre message :</div>
                    {candidature.message}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Candidature envoyée le {candidature.date_candidature 
                      ? getDateFormatee(candidature.date_candidature) 
                      : getDateFormatee(new Date())}
                  </div>
                  <button
                    onClick={() => confirmDelete(candidature.id)}
                    disabled={deleteLoading === candidature.id}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    {deleteLoading === candidature.id ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    )}
                    Retirer
                  </button>
                </div>
              </div>
              
              {candidature.feedback && (
                <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
                  <div className="flex">
                    <svg className="h-5 w-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-700">Retour du recruteur :</p>
                      <p className="text-sm text-blue-600 mt-0.5">{candidature.feedback}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesCandidatures;