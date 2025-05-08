import React, { useState } from "react";
import api from "../api/axios";

const PublierOffre = () => {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    lieu: "",
    type: "",
    date_limite: "",
    remuneration: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const token = localStorage.getItem("token");

    try {
      const response = await api.post("/offres", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(true);
      setMessage("Offre publiée avec succès !");
      setFormData({
        titre: "",
        description: "",
        lieu: "",
        type: "",
        date_limite: "",
        remuneration: "",
      });
    } catch (error) {
      setSuccess(false);
      setMessage("Erreur lors de la publication.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    "Temps plein",
    "Temps partiel",
    "Stage",
    "Freelance",
    "CDD",
    "CDI",
    "Alternance"
  ];
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Publier une nouvelle offre</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="titre" className="block text-sm font-medium text-gray-700">Titre de l'offre *</label>
          <input
            type="text"
            id="titre"
            name="titre"
            placeholder="Ex: Développeur Web Frontend React"
            value={formData.titre}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description détaillée *</label>
          <textarea
            id="description"
            name="description"
            placeholder="Détaillez les responsabilités, compétences requises, et autres informations importantes"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="lieu" className="block text-sm font-medium text-gray-700">Lieu *</label>
            <input
              type="text"
              id="lieu"
              name="lieu"
              placeholder="Ex: Dakar, Sénégal"
              value={formData.lieu}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type de contrat *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            >
              <option value="">Sélectionnez un type</option>
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="date_limite" className="block text-sm font-medium text-gray-700">Date limite de candidature *</label>
            <input
              type="date"
              id="date_limite"
              name="date_limite"
              value={formData.date_limite}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="remuneration" className="block text-sm font-medium text-gray-700">Rémunération (FCFA)</label>
            <input
              type="number"
              id="remuneration"
              name="remuneration"
              placeholder="Ex: 500000"
              value={formData.remuneration}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto flex justify-center items-center gap-2 px-6 py-3 rounded-md font-medium ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white transition-colors shadow-md`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement...
              </>
            ) : (
              "Publier l'offre"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublierOffre;