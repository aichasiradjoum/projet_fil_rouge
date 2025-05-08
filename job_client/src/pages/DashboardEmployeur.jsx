import React, { useState, useEffect } from "react";
import { 
  User, 
  FilePlus, 
  FolderOpen, 
  Users, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  ChevronRight
} from "lucide-react";
import api from "../api/axios";
// Import des composants réels comme dans votre code original
import ProfilEmploye from "../components/ProfilEmploye";
import PublierOffre from "../components/PublierOffre";
import MesOffres from "../components/MesOffres";
import CandidaturesRecues from "../components/CandidaturesRecues";
import Messagerie from "../components/Messagerie";

// Utilisation de l'API existante (à importer depuis votre application)
// Supposons que "api" est déjà défini ailleurs dans votre code

const DashboardEmployeur = () => {
  const [ongletActif, setOngletActif] = useState("profil");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employeur, setEmployeur] = useState(null);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  
  useEffect(() => {
    const fetchEmployeur = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/employeur/profil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployeur(response.data); // Stocke les données dans un state
      } catch (error) {
        console.error("Erreur lors de la récupération du profil employeur :", error);
      }
    };
  
    fetchEmployeur();
  }, []);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/employeur/notifications");
        setNotifications(res.data);
      } catch (error) {
        console.error("Erreur de notifications :", error);
      }
    };
  
    fetchNotifications();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "http://localhost:5173/#about";
  };

  const menuItems = [
    { id: "profil", label: "Mon Profil", icon: <User size={20} /> },
    { id: "publier", label: "Publier Offre", icon: <FilePlus size={20} /> },
    { id: "mesoffres", label: "Mes Offres", icon: <FolderOpen size={20} /> },
    { id: "candidatures", label: "Candidatures", icon: <Users size={20} /> },
    { id: "messagerie", label: "Messagerie", icon: <Users size={20} /> }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-blue-800">CampusConnect</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif, i) => (
                        <div key={i} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                          <p className="text-sm">une nouvelle candidature</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        Aucune notification
                      </div>
                    )}
                  </div>
                  <div className="p-2 text-center border-t border-gray-100">
                    <button className="text-blue-600 text-sm hover:underline">
                      Tout marquer comme lu
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                E
              </div>
              <span className="hidden md:block text-sm font-medium">{employeur?.user?.name ?? "Entreprise"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-white shadow-md overflow-y-auto ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-xl font-bold text-blue-700">Espace Employeur</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="hidden lg:block mb-6">
              <h2 className="text-xl font-bold text-blue-700">Espace Employeur</h2>
            </div>
            
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setOngletActif(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition ${
                    ongletActif === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {ongletActif === item.id && <ChevronRight size={16} />}
                </button>
              ))}
            </nav>
            
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
            >
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {menuItems.find(item => item.id === ongletActif)?.label || "Dashboard"}
              </h1>
              <p className="text-gray-500">
                Gérez votre recrutement efficacement
              </p>
            </div>

            {/* Notification banner */}
            {notifications.length > 0 && (
              <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <Bell size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Notifications récentes</h3>
                    <div className="space-y-1">
                      {notifications.slice(0, 2).map((notif, i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                          <p className="text-sm text-gray-700">{notif.data.message}</p>
                        </div>
                      ))}
                      {notifications.length > 2 && (
                        <button 
                          className="text-blue-600 text-sm font-medium hover:underline mt-1"
                          onClick={() => setShowNotifications(true)}
                        >
                          Voir {notifications.length - 2} notification{notifications.length - 2 > 1 ? 's' : ''} supplémentaire{notifications.length - 2 > 1 ? 's' : ''}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {ongletActif === "profil" && <ProfilEmploye />}
              {ongletActif === "publier" && <PublierOffre />}
              {ongletActif === "mesoffres" && <MesOffres />}
              {ongletActif === "candidatures" && <CandidaturesRecues setSelectedCandidature={setSelectedCandidature}/>}
              {ongletActif === "messagerie" && selectedCandidature && (<Messagerie candidatureId={selectedCandidature.id} user={employeur} />)}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardEmployeur;