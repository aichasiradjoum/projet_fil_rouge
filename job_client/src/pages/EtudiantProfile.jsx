import React, { useState, useEffect } from "react";
import { Camera, School, BookOpen, GraduationCap, User, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const EtudiantProfile = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    ecole: "",
    filiere: "",
    niveau: "",
    bio: "",
    photo: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Animation d'entrée lors du chargement de la page
  useEffect(() => {
    setIsVisible(true);
    
    // Animation légère pour les éléments du formulaire
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await api.post(
        "/etudiant/profil",
        {
          ecole: formData.ecole,
          filiere: formData.filiere,
          niveau: formData.niveau,
          bio: formData.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setSuccessMessage("Profil étudiant créé avec succès !");
      
      // Animation de succès avant redirection
      setTimeout(() => navigate("/dashboard-etudiant"), 2000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Erreur lors de la création du profil étudiant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.ecole || !formData.filiere || !formData.niveau)) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Animation de transition entre les étapes
    setAnimate(false);
    setTimeout(() => {
      setErrorMessage("");
      setStep(2);
      setAnimate(true);
    }, 300);
  };

  const prevStep = () => {
    setAnimate(false);
    setTimeout(() => {
      setStep(1);
      setAnimate(true);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header avec animation d'apparition */}
      <header 
        className={`py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-700 ease-out transform ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        } bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50`}
      >
        <div className="flex items-center">
          {/* <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg mr-3">
            <span className="text-white font-bold text-xl">C</span>
          </div> */}
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            CampusConnect
          </div>
        </div>

        <nav className="hidden md:flex space-x-8">
          <a href="http://localhost:5173/#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">À propos</a>
          <a href="http://localhost:5173/#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Témoignages</a>
          <a href="http://localhost:5173/#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
        </nav>

        <button
          onClick={() => navigate("/login")}
          className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-5 py-2 rounded-lg font-medium transition-colors duration-300 shadow-sm hover:shadow flex items-center"
        >
          <User size={16} className="mr-2" />
          Mon compte
        </button>
      </header>

      {/* Main content with animation */}
      <div className="flex-grow flex items-center justify-center p-4 pt-24 pb-12">
        <div 
          className={`bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden transition-all duration-700 ease-out transform ${
            isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
          }`}
        >
          <div className="flex flex-col md:flex-row h-full">
            {/* Sidebar */}
            <div className="bg-gradient-to-b from-indigo-600 to-blue-700 text-white p-6 md:w-1/3 relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white"></div>
              </div>
              
              <h1 className="text-3xl font-bold mb-8 relative">Profil Étudiant</h1>
              
              {/* Stepper */}
              <div className="space-y-8 relative">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    step === 1 ? 'bg-white text-indigo-600 scale-110 shadow-lg' : 'bg-indigo-500/50 text-white'
                  }`}>
                    <School size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`transition-all duration-500 ${step === 1 ? 'text-white font-semibold' : 'text-indigo-200'}`}>
                      Étape 1
                    </span>
                    <span className={`text-sm transition-all duration-500 ${step === 1 ? 'text-white' : 'text-indigo-200/70'}`}>
                      Informations académiques
                    </span>
                  </div>
                </div>
                
                {/* Line connector */}
                <div className="w-0.5 h-6 bg-indigo-400/30 ml-5"></div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    step === 2 ? 'bg-white text-indigo-600 scale-110 shadow-lg' : 'bg-indigo-500/50 text-white'
                  }`}>
                    <User size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`transition-all duration-500 ${step === 2 ? 'text-white font-semibold' : 'text-indigo-200'}`}>
                      Étape 2
                    </span>
                    <span className={`text-sm transition-all duration-500 ${step === 2 ? 'text-white' : 'text-indigo-200/70'}`}>
                      Informations personnelles
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 text-white/80 text-sm border-t border-white/20 pt-6 relative">
                <p className="leading-relaxed">
                  Ces informations nous permettront de personnaliser votre expérience et de vous connecter 
                  avec d'autres étudiants de votre établissement.
                </p>
                
                <div className="mt-6 bg-white/10 rounded-lg p-4 border border-white/20">
                  <p className="text-white text-xs font-medium">Votre profil sera visible par:</p>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center text-xs">
                      <Check size={12} className="mr-2 text-green-300" />
                      Les étudiants de votre école
                    </li>
                    <li className="flex items-center text-xs">
                      <Check size={12} className="mr-2 text-green-300" />
                      Les associations étudiantes
                    </li>
                    <li className="flex items-center text-xs">
                      <Check size={12} className="mr-2 text-green-300" />
                      Les tuteurs et mentors
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form content with animation */}
            <div className="p-8 md:p-10 flex-1 relative">
              <div className={`transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  {step === 1 ? (
                    <>
                      <School size={24} className="mr-3 text-indigo-600" />
                      Vos informations académiques
                    </>
                  ) : (
                    <>
                      <User size={24} className="mr-3 text-indigo-600" />
                      Présentez-vous
                    </>
                  )}
                </h2>

                {successMessage && (
                  <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6 flex items-center border-l-4 border-green-500 animate-pulse">
                    <Check size={18} className="mr-2 text-green-600" />
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 border-l-4 border-red-500">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-6">
                  {step === 1 && (
                    <>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">École <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <School size={18} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                          </div>
                          <input
                            type="text"
                            name="ecole"
                            placeholder="Nom de votre établissement"
                            value={formData.ecole}
                            onChange={handleChange}
                            className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Filière <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BookOpen size={18} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                          </div>
                          <input
                            type="text"
                            name="filiere"
                            placeholder="Votre filière d'études"
                            value={formData.filiere}
                            onChange={handleChange}
                            className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Niveau d'étude <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <GraduationCap size={18} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                          </div>
                          <select
                            name="niveau"
                            value={formData.niveau}
                            onChange={handleChange}
                            className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 focus:bg-white appearance-none"
                            required
                          >
                            <option value="">Sélectionnez votre niveau</option>
                            <option value="L1">L1 - Première année</option>
                            <option value="L2">L2 - Deuxième année</option>
                            <option value="L3">L3 - Troisième année</option>
                            <option value="M1">M1 - Master 1</option>
                            <option value="M2">M2 - Master 2</option>
                            <option value="D">Doctorat</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ArrowDown size={16} className="text-gray-400" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Votre niveau actuel d'études</p>
                      </div>
                      
                      <div className="pt-6">
                        <button
                          type="button"
                          onClick={nextStep}
                          className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 px-4 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Continuer
                          <ArrowRight size={18} className="ml-2" />
                        </button>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="mb-8 flex flex-col items-center">
                        <div className="relative w-28 h-28 mb-4 group">
                          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-md transition-all duration-300 group-hover:shadow-lg">
                            {photoPreview ? (
                              <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                            ) : (
                              <Camera size={36} className="text-gray-400" />
                            )}
                          </div>
                          <label htmlFor="photo" className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-2.5 rounded-full cursor-pointer hover:shadow-md transition-all duration-300 transform hover:scale-110">
                            <Camera size={18} />
                          </label>
                          <input 
                            type="file" 
                            id="photo" 
                            name="photo" 
                            onChange={handlePhotoChange} 
                            className="hidden" 
                            accept="image/*"
                          />
                        </div>
                        <p className="text-sm text-gray-500">Ajoutez une photo de profil professionnelle</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Biographie</label>
                        <textarea
                          name="bio"
                          placeholder="Parlez-nous de vous, vos centres d'intérêt, vos objectifs académiques..."
                          value={formData.bio}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                        ></textarea>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">Maximum 200 caractères</p>
                          <p className="text-xs text-gray-500">{formData.bio.length}/200</p>
                        </div>
                      </div>
                      
                      <div className="pt-6 grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex items-center justify-center bg-gray-100 text-gray-800 py-3.5 px-4 rounded-lg hover:bg-gray-200 transition duration-300 font-medium border border-gray-300"
                        >
                          <ArrowLeft size={18} className="mr-2" />
                          Retour
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 px-4 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Création...
                            </>
                          ) : (
                            <>
                              Créer mon profil
                              <Check size={18} className="ml-2" />
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer avec copyright
      <footer className="bg-white/80 backdrop-blur-md py-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} CampusConnect. Tous droits réservés.</p>
      </footer> */}
    </div>
  );
};

// Ajout de l'icône flèche qui manquait
const ArrowDown = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
};

export default EtudiantProfile;