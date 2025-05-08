import React, { useEffect, useState } from "react";
import { Save, Building, Briefcase, FileText, Globe, Loader2, CheckCircle } from "lucide-react";
import api from "../api/axios";

const ProfilEmploye = () => {
  const [profil, setProfil] = useState(null);
  const [form, setForm] = useState({
    entreprise: "",
    secteur: "",
    description: "",
    site_web: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/profil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfil(res.data);
        setForm(res.data); // pré-remplir le formulaire
        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement profil :", err);
        setLoading(false);
      }
    };

    fetchProfil();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.put("/profil", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfil(res.data.profil);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Erreur mise à jour :", err);
      setMessage("Erreur lors de la mise à jour du profil.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="animate-spin text-gray-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-blue-800">Mon profil employeur</h2>
        {showSuccess && (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full animate-pulse">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-sm">Profil mis à jour !</span>
          </div>
        )}
      </div>

      {message && (
        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
          {message}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium">
              <Building className="w-4 h-4 mr-2 text-gray-500" />
              Entreprise
            </label>
            <input
              type="text"
              name="entreprise"
              value={form.entreprise}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Nom de votre entreprise"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium">
              <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
              Secteur d'activité
            </label>
            <input
              type="text"
              name="secteur"
              value={form.secteur}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ex: Technologie, Santé, Finance..."
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-gray-700 font-medium">
            <FileText className="w-4 h-4 mr-2 text-gray-500" />
            Description de l'entreprise
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Décrivez votre entreprise, sa mission et ses valeurs..."
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-gray-700 font-medium">
            <Globe className="w-4 h-4 mr-2 text-gray-500" />
            Site Web
          </label>
          <input
            type="url"
            name="site_web"
            value={form.site_web || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="https://www.votreentreprise.com"
          />
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            onClick={handleUpdate}
            disabled={updating}
            className={`flex items-center bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors ${
              updating ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {updating ? (
              <>
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
                Mise à jour...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilEmploye;