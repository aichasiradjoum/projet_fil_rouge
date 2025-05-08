import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import hero1 from "../public/hero1.jpg";
import hero2 from "../public/hero2.jpg";
import hero3 from "../public/hero3.jpg";
import hero4 from "../public/hero4.jpg";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  
  // Images placeholder pour la démo
  const heroImages = [
    "/api/placeholder/600/600", // simulant hero1
    "/api/placeholder/600/600", // simulant hero2
    "/api/placeholder/600/600", // simulant hero3
    "/api/placeholder/600/600"  // simulant hero4
  ];
  
  // Animation d'entrée
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Rotation automatique des images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Tags avec leurs couleurs correspondantes
  const tags = [
    { name: "hotesse", color: "bg-blue-50 text-blue-600" },
    { name: "coursier", color: "bg-green-50 text-green-600" },
    { name: "cuisiniere", color: "bg-purple-50 text-purple-600" },
    { name: "repetiteur", color: "bg-amber-50 text-amber-600" },
    { name: "vendeur", color: "bg-rose-50 text-rose-600" }
  ];

  return (
    <section id="about" className="bg-gradient-to-br from-blue-50 to-indigo-50 px-6 md:px-10 py-16 my-12 rounded-3xl overflow-hidden relative">
      {/* Cercles décoratifs en arrière-plan */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full opacity-40 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className={`max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        {/* Partie texte (gauche) */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className={`transform transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
              <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              <p className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Growth | Impact
              </p>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mt-2 leading-tight">
              <span className="relative">
                À propos de
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-200/50 -rotate-1 -z-10"></span>
              </span>
              <span className="text-blue-600 block mt-1">nous</span>
            </h1>
            
            <p className="mt-6 text-lg text-gray-700 leading-relaxed max-w-xl">
              Découvrez l'emploi de vos rêves et accédez à un monde d'opportunités
              grâce à notre portail d'emplois dédié aux étudiants. Commencez dès
              aujourd'hui votre parcours vers un avenir prospère !
            </p>
            
            {/* Bouton d'action */}
            <button className="mt-8 inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg hover:shadow-blue-200 hover:bg-blue-700 transition-all duration-300 group">
              Découvrir nos offres
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
  
          {/* Tags */}
          <div className={`flex flex-wrap gap-3 mt-8 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {tags.map((tag, i) => (
              <span
                key={i}
                className={`${tag.color} font-medium px-4 py-2 rounded-lg text-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
  
        {/* Images à droite avec effet de grille dynamique */}
        <div className={`w-full lg:w-1/2 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
          <div className="relative w-full aspect-square max-w-md mx-auto">
            {/* Grille d'images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative transform transition-all duration-500 hover:scale-105" style={{zIndex: activeImage === 0 ? 10 : 1}}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl"></div>
                <img
                  src={hero1}
                  alt="Serveuse"
                  className={`rounded-3xl w-full h-auto object-cover shadow-lg transition-all duration-500 ${activeImage === 0 ? 'ring-4 ring-blue-300 scale-105' : 'filter brightness-90'}`}
                />
              </div>
              
              <div className="relative transform transition-all duration-500 hover:scale-105" style={{zIndex: activeImage === 1 ? 10 : 1}}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl"></div>
                <img
                  src={hero2}
                  alt="Groupe 1"
                  className={`rounded-xl w-full h-auto object-cover shadow-lg transition-all duration-500 ${activeImage === 1 ? 'ring-4 ring-blue-300 scale-105' : 'filter brightness-90'}`}
                />
              </div>
              
              <div className="relative transform transition-all duration-500 hover:scale-105" style={{zIndex: activeImage === 2 ? 10 : 1}}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-red-500/20 rounded-[30%]"></div>
                <img
                  src={hero3}
                  alt="Étudiants"
                  className={`rounded-[30%] w-full h-auto object-cover shadow-lg transition-all duration-500 ${activeImage === 2 ? 'ring-4 ring-blue-300 scale-105' : 'filter brightness-90'}`}
                />
              </div>
              
              <div className="relative transform transition-all duration-500 hover:scale-105" style={{zIndex: activeImage === 3 ? 10 : 1}}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl"></div>
                <img
                  src={hero4}
                  alt="Étudiante"
                  className={`rounded-xl w-full h-auto object-cover shadow-lg transition-all duration-500 ${activeImage === 3 ? 'ring-4 ring-blue-300 scale-105' : 'filter brightness-90'}`}
                />
              </div>
            </div>
            
            {/* Points de navigation pour les images */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {[0, 1, 2, 3].map((idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${activeImage === idx ? 'bg-blue-600 w-6' : 'bg-gray-300'}`}
                  aria-label={`Voir image ${idx + 1}`}
                />
              ))}
            </div>
            
            {/* Éléments décoratifs */}
            <span className="absolute -top-6 -right-6 w-12 h-12 bg-blue-100 rounded-full opacity-80"></span>
            <span className="absolute -bottom-4 left-1/4 w-8 h-8 bg-indigo-200 rounded-full"></span>
            <span className="absolute top-1/3 -left-4 w-6 h-6 bg-blue-300 rounded-full animate-pulse"></span>
          </div>
        </div>
      </div>
    </section>
  );
}