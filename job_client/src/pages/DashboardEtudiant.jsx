import React, { useEffect, useState } from "react";
import api from "../api/axios";
import OffreCard from "../components/OffreCard";
import MesCandidatures from "../components/MesCandidatures";
import HistoriqueMissions from "../components/HistoriqueMissions";
import ProfilEtudiant from "../components/ProfilEtudiant";
import Messagerie from "../components/Messagerie";


const DashboardEtudiant = () => {
  const [offres, setOffres] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("offres");
  const [etudiant, setEtudiant] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [stats, setStats] = useState({
  total: 0,
  enAttente: 0,
  selectionnees: 0,
  });

  useEffect(() => {
    const fetchCandidatures = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/etudiant/candidatures", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("CANDIDATURES REÇUES :", response.data); // <<--- ajoute ça
        const candidatures = response.data;
        setCandidatures(candidatures);
  
        const enAttente = candidatures.filter(c => c.statut === "en_attente").length;
        const selectionnees = candidatures.filter(c => c.statut === "selectionne").length;
  
        setStats({
          total: candidatures.length,
          enAttente,
          selectionnees,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des candidatures :", error);
      }
    };
  
    fetchCandidatures();
  }, []);
  

  useEffect(() => {
    const fetchEtudiant = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/etudiant/etudiant", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEtudiant(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'étudiant :", error);
      }
    };

    fetchEtudiant();
  }, []);

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/offres", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOffres(response.data.data);
        setFilteredOffres(response.data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des offres", error);
      }
    };

    fetchOffres();
  }, []);

  useEffect(() => {
    const results = offres.filter((offre) =>
      offre.titre.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOffres(results);
  }, [search, offres]);

  const postuler = async (offreId) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/etudiant/candidatures",
        { offre_id: offreId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Candidature envoyée !");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage("Vous avez déjà postulé à cette offre.");
      } else {
        setMessage("Une erreur est survenue.");
      }
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "offres":
        return (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une offre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            {message && (
              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md shadow-sm flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
                {message}
              </div>
            )}

            <div className="space-y-4">
              {filteredOffres.length > 0 ? (
                filteredOffres.map((offre) => (
                  <OffreCard key={offre.id} offre={offre} onPostuler={postuler} />
                ))
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-gray-500">Aucune offre ne correspond à votre recherche.</p>
                </div>
              )}
            </div>
          </div>
        );
      case "candidatures":
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <MesCandidatures />
          </div>
        );
      case "historique":
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <HistoriqueMissions />
          </div>
        );
        case "Messagerie":
          return (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Messagerie />
            </div>
          );
      case "profil":
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <ProfilEtudiant />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-800">CampusConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {/* Initiale de l'utilisateur */}
                    E
                  </div>
                  <span className="ml-2 font-medium hidden md:block">Étudiant (e)</span>
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-3 py-2 rounded-md text-sm border border-gray-300 transition flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Tableau de bord</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Étudiant</span>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    E
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{etudiant?.user?.name ?? "Chargement..."}</h3> 
                    <p className="text-sm text-gray-500">{etudiant?.user?.email ?? "Chargement..."}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("offres")}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    activeTab === "offres"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  } transition-colors`}
                >
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Offres de job
                </button>

                <button
                  onClick={() => setActiveTab("candidatures")}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    activeTab === "candidatures"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  } transition-colors`}
                >
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Mes candidatures
                </button>

                <button
                  onClick={() => setActiveTab("historique")}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    activeTab === "historique"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  } transition-colors`}
                >
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Historique des missions
                </button>

                <button
                  onClick={() => setActiveTab("profil")}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    activeTab === "profil"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  } transition-colors`}
                >
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Mon profil
                </button>
                <button
                  onClick={() => setActiveTab("Messagerie")}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    activeTab === "Messagerie"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  } transition-colors`}
                  
                >
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Messagerie
                </button>
              </nav>

              {/* Statistiques */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-6">
  <div className="bg-white shadow-md rounded-lg p-4 text-center">
    <h4 className="text-gray-700 font-semibold">Offres Reçues</h4>
    <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
  </div>
  <div className="bg-white shadow-md rounded-lg p-4 text-center">
    <h4 className="text-gray-700 font-semibold">En Attente</h4>
    <p className="text-2xl font-bold text-yellow-500">{stats.enAttente}</p>
  </div>
  <div className="bg-white shadow-md rounded-lg p-4 text-center">
    <h4 className="text-gray-700 font-semibold">Select</h4>
    <p className="text-2xl font-bold text-green-600">{stats.selectionnees}</p>
  </div>
</div>

            </div>
          </div>

          {/* Main content */}
          <div className="w-full lg:w-3/4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === "offres" && "Offres disponibles"}
                {activeTab === "candidatures" && "Mes candidatures"}
                {activeTab === "historique" && "Historique des missions"}
                {activeTab === "profil" && "Mon profil"}
                {activeTab === "Messagerie" && "Messagerie"}
              </h1>
              <p className="text-gray-500 mt-1">
                {activeTab === "offres" && "Découvrez les offres de job qui correspondent à votre profil"}
                {activeTab === "candidatures" && "Suivez l'état de vos candidatures"}
                {activeTab === "historique" && "Consultez l'historique de vos missions complétées"}
                {activeTab === "profil" && "Gérez vos informations personnelles "}

              </p>
            </div>

            {renderTabContent()}
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default DashboardEtudiant;