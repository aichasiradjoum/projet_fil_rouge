import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Users, Calendar, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import studentImg from "../public/student.jpg";
import HeroSection from "c:/Users/hp/Desktop/projet_fil_rouge/job_client/src/components/HeroSection";
import Temoignage from "c:/Users/hp/Desktop/projet_fil_rouge/job_client/src/components/Temoignage";
import Footer from "c:/Users/hp/Desktop/projet_fil_rouge/job_client/src/Components/Footer";

const LandingPage = () => {
  // Simulation de navigate pour l'environnement de test
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // État pour gérer l'animation d'entrée
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Animation pour les chiffres qui montent
  const [stats, setStats] = useState({ students: 0, companies: 0, matches: 0 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        students: prev.students < 5000 ? prev.students + 250 : 5000,
        companies: prev.companies < 300 ? prev.companies + 15 : 300,
        matches: prev.matches < 2500 ? prev.matches + 125 : 2500,
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 overflow-hidden">
      {/* Header avec animation d'entrée */}
      {/* Header */}
      <header 
        className={`py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-700 ease-out transform ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        } bg-white/90 backdrop-blur-md shadow-sm fixed w-full top-0 z-50`}
      >
        <div className="flex items-center">
          {/* <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">C</span>
          </div> */}
          <div className="text-2xl font-bold text-blue-800">
            CampusConnect
          </div>
        </div>
        {/* Menu Mobile Burger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-blue-800 text-2xl focus:outline-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="http://localhost:5173/#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">À propos</a>
          <a href="http://localhost:5173/#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Témoignages</a>
          <a href="http://localhost:5173/#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
        </nav>

        <button
          onClick={() => navigate("/login")}
          className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-5 py-2 rounded-lg font-medium transition-colors duration-300 shadow-sm hover:shadow"
        >
          Connexion
        </button>
      </header>
      {/* Menu Mobile (responsive) */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-md absolute top-16 w-full left-0 flex flex-col items-center py-4 space-y-2 z-40">
          <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">À propos</a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium">Témoignages</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
          {/* <button
            onClick={() => {
              navigate("/login");
              setMenuOpen(false);
            }}
            className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-5 py-2 rounded-lg font-medium transition-colors duration-300 shadow-sm hover:shadow"
          >
            Connexion
          </button> */}
        </nav>
      )}
      {/* Hero Section avec animations */}
      <main className="container mx-auto px-4 py-10 md:py-16 flex flex-col md:flex-row items-center">
        {/* Texte à gauche avec animation */}
        <div className={`md:w-1/2 space-y-6 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            Trouve le Job de 
            <span className="text-blue-800 block">Ton Emploi de Temps</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-xl">
            Découvrez des milliers d'étudiants et toutes les informations dont vous avez besoin.
            Trouvez des étudiants qualifiés et gérez tous vos candidats du début à la fin.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate("/register")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
            >
              Etudiant
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={20} />
            </button>
            
            <button className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200" onClick={() => navigate("/register")}>
              Offreur
            </button>
          </div>
          
          {/* Statistiques animées */}
          <div className="flex flex-wrap gap-6 pt-6 mt-4">
            <div className="flex items-center">
              <Users className="text-blue-500 mr-2" size={24} />
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.students.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Étudiants</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Briefcase className="text-blue-500 mr-2" size={24} />
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.companies.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Entreprises</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="text-blue-500 mr-2" size={24} />
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.matches.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Matchs réussis</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Image/Illustration à droite avec animation */}
        <div className={`md:w-1/2 mt-12 md:mt-0 transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-20 opacity-0 scale-95'}`}>
          <div className="relative">
            {/* Image principale */}
            <div className="bg-white p-2 rounded-2xl shadow-xl rotate-2 hover:rotate-0 transition-all duration-500">
              <div className="aspect-video bg-blue-100 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={studentImg} 
                    alt="Étudiants au travail" 
                    className="object-cover w-full h-full" 
                  />
                </div>
              </div>
            </div>
            
            {/* Éléments décoratifs flottants */}
            <div className="absolute -top-6 -left-6 bg-blue-500 text-white p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 animate-bounce">
              <Calendar size={24} />
            </div>
            
            <div className="absolute -bottom-8 -right-8 bg-green-500 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
              <CheckCircle size={20} />
            </div>
            
            <div className="absolute top-1/2 -right-12 bg-white p-3 rounded-lg shadow-lg animate-pulse">
              <div className="w-16 h-1 bg-blue-400 rounded mb-1"></div>
              <div className="w-12 h-1 bg-blue-300 rounded"></div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Fonctionnalités avec animation au scroll */}
      <section className={`bg-white py-16 mt-16 rounded-t-3xl transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça fonctionne ?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Créez votre profil</h3>
              <p className="text-gray-600">Remplissez votre profil avec vos compétences, disponibilités et préférences pour trouver le job idéal.</p>
            </div>
            
            {/* Carte 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recevez des offres</h3>
              <p className="text-gray-600">Les entreprises consultent votre profil et vous contactent directement avec des propositions adaptées.</p>
            </div>
            
            {/* Carte 3 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Commencez à travailler</h3>
              <p className="text-gray-600">Acceptez les offres qui vous conviennent et commencez votre nouvelle mission en toute simplicité.</p>
            </div>
          </div>
        </div>
      </section>
      <HeroSection />
      <Temoignage />
      {/* Footer avec animation d'entrée */}
      <Footer />
    </div>
    
  );
};

export default LandingPage;