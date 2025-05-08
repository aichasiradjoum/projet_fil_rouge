import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    
    try {
      const response = await api.post("/login", formData);
      localStorage.setItem("token", response.data.access_token);
      const userResponse = await api.get("/user", {
        headers: { Authorization: `Bearer ${response.data.access_token}` },
      });
      const userRole = userResponse.data.role;
      let profilResponse;
      
      if (userRole === "etudiant") {
        try {
          profilResponse = await api.get("/etudiant/profil", {
            headers: { Authorization: `Bearer ${response.data.access_token}` },
          });
          navigate("/dashboard-etudiant");
        } catch (error) {
          if (error.response?.status === 404) {
            navigate("/profil-etudiant");
          } else {
            setErrorMessage("Erreur lors de la récupération du profil étudiant.");
          }
        }
      }
       else if (userRole === "offreur") {
        profilResponse = await api.get("/profil", {
          headers: { Authorization: `Bearer ${response.data.access_token}` },
        });

        if(profilResponse.data){
          navigate(profilResponse.data ? "/dashboard" : "/employeur");
        }else{
          navigate("dashboard")
        }
        
      } else if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else {
        setErrorMessage("Rôle utilisateur inconnu.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.status === 401
          ? "Identifiants invalides. Veuillez réessayer."
          : "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header 
        className={`py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-700 ease-out transform ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        } bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50`}
      >
        <div className="flex items-center">
          {/* <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">C</span>
          </div> */}
          <div className="text-2xl font-bold text-blue-800">
            CampusConnect
          </div>
        </div>

        <nav className="hidden md:flex space-x-8">
          <a href="http://localhost:5173/#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">À propos</a>
          <a href="http://localhost:5173/#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Témoignages</a>
          <a href="http://localhost:5173/#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
        </nav>

        <button
          onClick={() => navigate("/register")}
          className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-5 py-2 rounded-lg font-medium transition-colors duration-300 shadow-sm hover:shadow"
        >
          Inscription
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row items-center justify-center py-10 px-6">
        {/* Left Section - Image & Message */}
        <div 
          className={`hidden md:flex w-1/2 max-w-xl flex-col items-center text-center px-8 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
          }`}
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-75 blur"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Bienvenue sur CampusConnect
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Trouvez les meilleurs mini-jobs adaptés à votre vie étudiante ou recrutez les talents dont vous avez besoin.
              </p>
              <div className="h-64 w-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                <svg className="w-48 h-48 text-blue-500 opacity-75" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  <path d="M6 11h.01M6 15h.01M6 19h.01"></path>
                  <path d="M10 11h.01M10 15h.01M10 19h.01"></path>
                  <path d="M14 11h.01M14 15h.01M14 19h.01"></path>
                  <path d="M18 11h.01M18 15h.01M18 19h.01"></path>
                </svg>
              </div>
              <div className="flex justify-center space-x-3">
                <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                <span className="h-2 w-2 rounded-full bg-blue-300"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div 
          className={`w-full md:w-1/2 max-w-md transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
          }`}
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Connexion</h2>
              <p className="text-gray-500">Accédez à votre espace personnel</p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="votre@email.fr"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Mot de passe oublié?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 shadow-md ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="text-center text-gray-600 text-sm">
                Pas encore de compte ?{" "}
                <a href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Inscrivez-vous
                </a>
              </p>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500"> continuer avec nous</span>
                </div>
              </div>

              {/* <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <button
                    type="button"
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Footer
      <footer className="py-6 px-6 md:px-12 bg-white/80 backdrop-blur-md mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} CampusConnect. Tous droits réservés.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              Mentions légales
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              Aide
            </a>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default LoginPage;