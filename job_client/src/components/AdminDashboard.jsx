// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import StatistiquesGraph from "../components/StatistiquesGraph";
import { 
  BarChart3, 
  Users, 
  LogOut, 
  RefreshCcw, 
  Search, 
  Book, 
  Briefcase, 
  ShieldAlert, 
  CheckCircle, 
  AlertCircle,
  ChevronDown,
  UserPlus,
  BookOpen
} from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileDetails, setProfileDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState("users");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setStats(computeStats());
    }
  }, [users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      let url = `/admin/users/${id}`;
      let method = action === "delete" ? "delete" : "put";
      await api({
        method,
        url,
        headers: { Authorization: `Bearer ${token}` },
        data: action !== "delete" ? { statut: action } : {},
      });
      fetchUsers();
    } catch (error) {
      console.error("Erreur action admin :", error);
    }
  };

  const handleViewProfile = async (user) => {
    setSelectedUser(user);
    try {
      const token = localStorage.getItem("token");
      let response;

      if (user.role === "etudiant") {
        response = await api.get(`/admin/etudiant/${user.id}/candidatures`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await api.get(`/admin/offreur/${user.id}/offres`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setProfileDetails(response.data);
    } catch (error) {
      console.error("Erreur chargement profil :", error);
      setProfileDetails([]);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesFilter = filter === "all" ? true : u.role === filter;
    const matchesSearch = searchTerm === "" ? true : 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const computeStats = () => {
    const etudiants = users.filter((u) => u.role === "etudiant").length;
    const offreurs = users.filter((u) => u.role === "offreur").length;
    const actifs = users.filter((u) => u.statut === "actif").length;
    const suspendus = users.filter((u) => u.statut === "suspendu").length;
    const offres = users
      .filter((u) => u.role === "offreur" && u.offres)
      .reduce((total, u) => total + u.offres?.length || 0, 0);
    const selectionnes = users
      .filter((u) => u.role === "etudiant" && u.candidatures)
      .reduce(
        (total, u) =>
          total + (u.candidatures?.filter((c) => c.statut === "selectionne").length || 0),
        0
      );
    return { etudiants, offreurs, actifs, suspendus, offres, selectionnes };
  };

  const StatusBadge = ({ status }) => {
    let bgColor, textColor, icon;
    
    switch(status) {
      case "actif":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        icon = <CheckCircle size={14} className="text-green-600" />;
        break;
      case "suspendu":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        icon = <AlertCircle size={14} className="text-red-600" />;
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
        icon = null;
    }
    
    return (
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${bgColor} ${textColor} text-xs font-medium`}>
        {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const RoleBadge = ({ role }) => {
    let bgColor, textColor, icon;
    
    switch(role) {
      case "etudiant":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        icon = <Book size={14} className="text-blue-600" />;
        break;
      case "offreur":
        bgColor = "bg-purple-100";
        textColor = "text-purple-800";
        icon = <Briefcase size={14} className="text-purple-600" />;
        break;
      case "admin":
        bgColor = "bg-amber-100";
        textColor = "text-amber-800";
        icon = <ShieldAlert size={14} className="text-amber-600" />;
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
        icon = null;
    }
    
    return (
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${bgColor} ${textColor} text-xs font-medium`}>
        {icon} {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const StatCard = ({ icon, title, value, bgColor }) => (
    <div className={`${bgColor} rounded-lg shadow-md p-4 flex items-center justify-between`}>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="bg-white rounded-full p-3 shadow">
        {icon}
      </div>
    </div>
  );

  const MenuLink = ({ icon, text, active, onClick }) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
        active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg py-6 px-4 flex flex-col">
        <div className="flex items-center gap-2 px-4 mb-8">
          <div className="bg-blue-600 rounded-lg p-2">
            <ShieldAlert size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        
        <div className="space-y-1 mb-4">
          <h3 className="px-4 text-xs font-semibold uppercase text-gray-500 mb-2">Gestion</h3>
          <MenuLink 
            icon={<Users size={20} />} 
            text="Utilisateurs" 
            active={activePage === "users"} 
            onClick={() => setActivePage("users")}
          />
          <MenuLink 
            icon={<BarChart3 size={20} />} 
            text="Statistiques" 
            active={activePage === "stats"} 
            onClick={() => setActivePage("stats")}
          />
        </div>
        
        <div className="space-y-1 mb-4">
          <h3 className="px-4 text-xs font-semibold uppercase text-gray-500 mb-2">Filtres</h3>
          <MenuLink 
            icon={<Users size={20} />} 
            text="Tous les utilisateurs" 
            active={filter === "all"} 
            onClick={() => setFilter("all")}
          />
          <MenuLink 
            icon={<Book size={20} />} 
            text="Étudiants" 
            active={filter === "etudiant"} 
            onClick={() => setFilter("etudiant")}
          />
          <MenuLink 
            icon={<Briefcase size={20} />} 
            text="Employeurs" 
            active={filter === "offreur"} 
            onClick={() => setFilter("offreur")}
          />
        </div>
        
        <div className="mt-auto">
          <button 
            onClick={fetchUsers} 
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4 py-2 mb-4"
          >
            <RefreshCcw size={18} /> Actualiser les données
          </button>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-red-600 hover:text-red-800 px-4 py-2"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activePage === "users" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Gestion des utilisateurs</h1>
                <p className="text-gray-600 text-sm">
                  {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <button 
                  onClick={() => setSearchTerm("")} 
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Effacer
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard 
                  icon={<Users size={24} className="text-blue-600" />}
                  title="Utilisateurs"
                  value={users.length}
                  bgColor="bg-blue-50"
                />
                <StatCard 
                  icon={<Book size={24} className="text-green-600" />}
                  title="Étudiants"
                  value={stats.etudiants}
                  bgColor="bg-green-50"
                />
                <StatCard 
                  icon={<Briefcase size={24} className="text-purple-600" />}
                  title="Employeurs"
                  value={stats.offreurs}
                  bgColor="bg-purple-50"
                />
                <StatCard 
                  icon={<BookOpen size={24} className="text-amber-600" />}
                  title="Offres"
                  value={stats.offres}
                  bgColor="bg-amber-50"
                />
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          Chargement...
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-gray-700 font-medium">{user.name.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <RoleBadge role={user.role} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={user.statut} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleViewProfile(user)} 
                                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                              >
                                Détails
                              </button>
                              <button 
                                onClick={() => handleAction(user.id, user.statut === "actif" ? "suspendu" : "actif")} 
                                className={`px-3 py-1 rounded text-xs transition-colors ${
                                  user.statut === "actif" 
                                    ? "bg-amber-600 text-white hover:bg-amber-700" 
                                    : "bg-green-600 text-white hover:bg-green-700"
                                }`}
                              >
                                {user.statut === "actif" ? "Suspendre" : "Activer"}
                              </button>
                              <button 
                                onClick={() => handleAction(user.id, "delete")} 
                                className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activePage === "stats" && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1">Statistiques Générales</h1>
              <p className="text-gray-600 text-sm">Vue d'ensemble des activités sur la plateforme</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Users size={20} className="text-blue-600" /> 
                  Utilisateurs
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Étudiants</p>
                    <p className="text-2xl font-bold text-blue-600">{stats?.etudiants || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Employeurs</p>
                    <p className="text-2xl font-bold text-purple-600">{stats?.offreurs || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" /> 
                  Statuts
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Actifs</p>
                    <p className="text-2xl font-bold text-green-600">{stats?.actifs || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Suspendus</p>
                    <p className="text-2xl font-bold text-red-600">{stats?.suspendus || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Briefcase size={20} className="text-amber-600" /> 
                  Offres
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-amber-600">{stats?.offres || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Sélections</p>
                    <p className="text-2xl font-bold text-blue-600">{stats?.selectionnes || 0}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Graphiques */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-600" /> 
                Statistiques Détaillées
              </h2>
              {stats && <StatistiquesGraph stats={stats} />}
            </div>
          </>
        )}

        {/* Modal profil */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-xl relative">
              <button 
                onClick={() => { setSelectedUser(null); setProfileDetails(null); }} 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Fermer</span>
                ✖
              </button>
              
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold mr-4">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <RoleBadge role={selectedUser.role} />
                    <StatusBadge status={selectedUser.statut} />
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-lg mb-4">
                  {selectedUser.role === "etudiant" ? "Candidatures" : "Offres d'emploi"}
                </h3>
                
                {!profileDetails ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : profileDetails.length === 0 ? (
                  <div className="text-center py-6 text-gray-600">
                    Aucun détail disponible.
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {profileDetails.map((item, index) => (
                      <div key={index} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-blue-600">
                          {selectedUser.role === "etudiant"
                            ? `Candidature pour ${item.offre?.titre ?? "Offre inconnue"}`
                            : `${item.titre}`}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Statut:</span> {item.statut}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date(item.created_at).toLocaleDateString()}
                          </div>
                          {item.offre?.remuneration && (
                            <div>
                              <span className="font-medium">Rémunération:</span> {item.offre.remuneration} FCFA
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => { setSelectedUser(null); setProfileDetails(null); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button 
                  onClick={() => handleAction(selectedUser.id, selectedUser.statut === "actif" ? "suspendu" : "actif")}
                  className={`px-4 py-2 rounded-lg text-white ${
                    selectedUser.statut === "actif" 
                      ? "bg-amber-600 hover:bg-amber-700" 
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {selectedUser.statut === "actif" ? "Suspendre" : "Activer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;