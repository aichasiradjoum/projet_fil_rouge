import React, { useState } from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter, FaYoutube, FaArrowRight, FaEnvelope, FaPaperPlane, FaClock, FaChevronUp } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Handle newsletter submission
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Newsletter logic would go here
    setEmail("");
    alert("Merci pour votre inscription à notre newsletter!");
  };

  // Handle scroll to top button
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="foot" className="relative bg-gradient-to-b from-gray-900 to-blue-900 text-white mt-20">
      {/* Top Wave Separator */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160" className="fill-blue-900">
          <path d="M0,128L60,112C120,96,240,64,360,69.3C480,75,600,117,720,128C840,139,960,117,1080,106.7C1200,96,1320,96,1380,96L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* Pre-Footer Newsletter Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-10 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white">Restez informé</h3>
            <p className="text-blue-100">Inscrivez-vous à notre newsletter pour recevoir nos actualités</p>
          </div>
          <div className="flex w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email" 
                className="px-6 py-3 w-full rounded-l-full text-white-800 focus:outline-none focus:ring-2 focus:ring-white-400"
              />
              <button
                onClick={handleNewsletterSubmit}
                className="bg-indigo-900 hover:bg-indigo-800 text-white font-medium px-6 py-3 rounded-r-full transition-all flex items-center"
              >
                <span className="mr-2">S'inscrire</span>
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Logo & About */}
          <div className="col-span-1 lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-blue-800 mb-1">Campus<span className="text-blue-800">Connect</span></h2>
              <div className="h-1 w-20 bg-blue-500 rounded-full mb-4"></div>
            </div>
            <p className="mb-6 text-blue-100 leading-relaxed">
              Nous connectons les talents aux opportunités. Notre plateforme révolutionne le recrutement en permettant aux étudiants et aux entreprises de se rencontrer plus efficacement.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-700 p-2 rounded-full">
                  <FaPhoneAlt className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-300">Assistance 24/7</p>
                  <p className="text-lg font-bold text-white">679495830</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-700 p-2 rounded-full">
                  <FaEnvelope className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-300">Email us</p>
                  <p className="text-white">contact@campusconnect.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-6 text-white relative">
              <span className="relative z-10">Liens Rapides</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-blue-500 z-0"></span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {["Accueil", "À propos", "Témoignages", "Carrières", "Actualités", "FAQ", "Contact"].map((link, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-blue-100 hover:text-blue-400 transition-colors flex items-center group py-1"
                >
                  <FaArrowRight className="mr-2 text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-6 text-white relative">
              <span className="relative z-10">Notre Localisation</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-blue-500 z-0"></span>
            </h3>
            <div className="bg-blue-800 bg-opacity-50 rounded-lg p-6 backdrop-filter backdrop-blur-sm border border-blue-700 border-opacity-50">
              <div className="flex items-start mb-4">
                <FaMapMarkerAlt className="text-blue-400 text-xl mt-1 mr-3 flex-shrink-0" />
                <p className="text-blue-100">
                  Akshay Tech Park, 4th Floor, Plot No 72&73, EPIP Zone, Whitefield, Bangalore, Karnataka 560066.
                </p>
              </div>
              <div className="flex items-start mb-4">
                <FaClock className="text-blue-400 text-xl mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white mb-1">Heures d'ouverture</p>
                  <p className="text-blue-100">Lun - Ven: 9h00 - 18h00</p>
                  <p className="text-blue-100">Weekend: Fermé</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-700">
                <p className="text-blue-200 mb-2">Réseaux sociaux</p>
                <div className="flex space-x-3">
                  {[
                    { icon: <FaLinkedinIn />, color: "bg-blue-700 hover:bg-blue-600" },
                    { icon: <FaFacebookF />, color: "bg-blue-700 hover:bg-blue-600" },
                    { icon: <FaInstagram />, color: "bg-blue-700 hover:bg-blue-600" },
                    { icon: <FaTwitter />, color: "bg-blue-700 hover:bg-blue-600" },
                  ].map((social, index) => (
                    <a 
                      key={index} 
                      href="#" 
                      className={`${social.color} w-9 h-9 rounded-full flex items-center justify-center transition-all transform hover:scale-110`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-6 text-white relative">
              <span className="relative z-10">Contactez-nous</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-blue-500 z-0"></span>
            </h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Nom" 
                className="bg-blue-800 bg-opacity-50 border border-blue-700 rounded-lg px-4 py-2 w-full text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-blue-800 bg-opacity-50 border border-blue-700 rounded-lg px-4 py-2 w-full text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea 
                placeholder="Message" 
                rows={3} 
                className="bg-blue-800 bg-opacity-50 border border-blue-700 rounded-lg px-4 py-2 w-full text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all flex items-center"
              >
                <span className="mr-2">Envoyer</span>
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 mb-8 border-t border-blue-800"></div>
        
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-blue-200 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Campus<span className="text-blue-400">Connect</span>. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Politique de confidentialité</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Conditions d'utilisation</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 animate-bounce"
        >
          <FaChevronUp />
        </button>
      )}

      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-blue-600 opacity-10"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-600 opacity-10"></div>
      </div>
    </footer>
  );
}