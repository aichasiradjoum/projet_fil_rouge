import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Building2, Globe, FileText, Briefcase, CheckCircle, AlertCircle, User } from "lucide-react";

const EmployeurProfilePage = () => {
  const [formData, setFormData] = useState({
    entreprise: "",
    secteur: "",
    description: "",
    site_web: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/profil", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccessMessage("Profil employeur créé avec succès !");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrorMessage("Erreur de validation. Veuillez vérifier vos données.");
      } else {
        setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header avec animation raffinée */}
      <header 
        className={`py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-700 ease-out transform ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        } bg-white/90 backdrop-blur-md shadow-sm fixed w-full top-0 z-50`}
      >
        <div className="flex items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            CampusConnect
          </div>
        </div>

        <nav className="hidden md:flex space-x-8">
          <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Accueil</a>
          <a href="/#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">À propos</a>
          <a href="/#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Témoignages</a>
          <a href="/#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
        </nav>

        <button
          onClick={() => navigate("/register")}
          className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-5 py-2 rounded-lg font-medium transition-colors duration-300 shadow-sm hover:shadow flex items-center"
        >
          <User size={16} className="mr-2" />
          Mon compte
        </button>
      </header>

      {/* Page Content */}
      <div className="pt-24 pb-16 px-4 md:px-0 max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-800">
            Créez votre profil employeur
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            Présentez votre entreprise aux meilleurs talents du campus et développez votre présence auprès des étudiants.
          </p>
        </div>

        {/* Card Design */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <div className="w-full bg-blue-50 h-2">
            <div className="bg-blue-600 h-2 rounded-r-full" style={{ width: "33%" }}></div>
          </div>
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6 px-8">
            <h2 className="text-white text-2xl font-bold flex items-center">
              <Building2 className="mr-3" size={24} />
              Informations de l'entreprise
            </h2>
            <p className="text-blue-100 mt-1">
              Étape 1/3 : Présentez votre entreprise
            </p>
          </div>
          
          {/* Form Content */}
          <div className="p-8">
            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded flex items-start">
                <CheckCircle size={20} className="mr-3 mt-1 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded flex items-start">
                <AlertCircle size={20} className="mr-3 mt-1 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="entreprise">
                  Nom de l'entreprise
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Building2 size={18} className="text-gray-500" />
                  </div>
                  <input
                    id="entreprise"
                    type="text"
                    name="entreprise"
                    placeholder="Ex: Acme Corporation"
                    value={formData.entreprise}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="secteur">
                  Secteur d'activité
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Briefcase size={18} className="text-gray-500" />
                  </div>
                  <input
                    id="secteur"
                    type="text"
                    name="secteur"
                    placeholder="Ex: Technologie, Finance, Éducation"
                    value={formData.secteur}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                  Description de l'entreprise
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText size={18} className="text-gray-500" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Décrivez votre entreprise, sa mission, ses valeurs..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="site_web">
                  Site web <span className="text-gray-500 text-sm font-normal">(facultatif)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Globe size={18} className="text-gray-500" />
                  </div>
                  <input
                    id="site_web"
                    type="url"
                    name="site_web"
                    placeholder="https://www.entreprise.com"
                    value={formData.site_web}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 flex items-center justify-center ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Création en cours...
                    </>
                  ) : (
                    "Créer le profil"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Besoin d'aide ? <a href="/aide" className="text-blue-600 hover:underline">Consultez notre guide</a> ou <a href="/contact" className="text-blue-600 hover:underline">contactez-nous</a></p>
        </div>
      </div>
    </div>
  );
};

export default EmployeurProfilePage;