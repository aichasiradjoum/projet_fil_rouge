import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import api from "../api/axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeField, setActiveField] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Animation de l'apparition du header après chargement de la page
    setIsVisible(true);
    
    // Détection du scroll pour potentiellement modifier l'apparence du header
    const handleScroll = () => {
      // Vous pouvez ajouter une logique ici pour modifier l'apparence du header au scroll
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFocus = (field) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
  
    try {
      const response = await api.post("/register", formData);
      localStorage.setItem("token", response.data.access_token);
      const userResponse = await api.get("/user", {
              headers: { Authorization: `Bearer ${response.data.access_token}` },
            });
            const userRole = userResponse.data.role;
      setSuccessMessage("Inscription réussie !");
      
      // Animation de succès
      setTimeout(() => {
        if (userRole === "etudiant") {
        if (response.data.user && !response.data.user.has_profil) {
          navigate("/profil-etudiant");
        } }else {
          navigate("/login");
        }
        if (userRole === "offreur") {
          if (response.data.user && !response.data.user.has_profil) {
            navigate("/employeur");
          } }else {
            navigate("/login");
          }
      }, 2000);
      
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputVariants = {
    focused: { scale: 1.02, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" },
    unfocused: { scale: 1, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }
  };
  
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header 
        className={`py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-700 ease-out transform ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        } bg-white/80 backdrop-blur-md shadow-sm z-10`}
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
          onClick={() => navigate("/login")}
          className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-5 py-2 rounded-lg font-medium transition-colors duration-300 shadow-sm hover:shadow"
        >
          Connexion
        </button>
      </header>

      
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
        {/* Formulaire d'inscription */}
        <motion.div 
          className="md:col-span-3 bg-white p-8 rounded-2xl shadow-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800">Créer un compte</h2>
            <p className="text-center text-gray-500 mt-2">Rejoignez notre communauté dès aujourd'hui</p>
          </motion.div>
          
          {/* Message de succès */}
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 text-green-800 p-4 rounded-md mb-6 border-l-4 border-green-500 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </motion.div>
          )}
        
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-5"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <motion.input
                type="text"
                name="name"
                placeholder="Nom complet"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
                required
                variants={inputVariants}
                animate={activeField === 'name' ? 'focused' : 'unfocused'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <motion.input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                required
                variants={inputVariants}
                animate={activeField === 'email' ? 'focused' : 'unfocused'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email[0]}
                </motion.p>
              )}
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              <motion.input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
                required
                variants={inputVariants}
                animate={activeField === 'password' ? 'focused' : 'unfocused'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              <motion.input
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                placeholder="Confirmer mot de passe"
                value={formData.password_confirmation}
                onChange={handleChange}
                onFocus={() => handleFocus('password_confirmation')}
                onBlur={handleBlur}
                required
                variants={inputVariants}
                animate={activeField === 'password_confirmation' ? 'focused' : 'unfocused'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </motion.div>
            </motion.div>

            {/* User Type */}
            <motion.div variants={itemVariants} className="flex items-center space-x-6 py-2">
              <p className="text-gray-600 font-medium">Je suis:</p>
              <motion.label 
                className="relative flex items-center cursor-pointer group"
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="radio"
                  name="role"
                  value="offreur"
                  onChange={handleChange}
                  className="hidden"
                />
                <span className={`w-4 h-4 rounded-full border inline-block mr-2 ${formData.role === 'offreur' ? 'border-indigo-600' : 'border-gray-400'}`}>
                  {formData.role === 'offreur' && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0.5 bg-indigo-600 rounded-full"
                    />
                  )}
                </span>
                <span className={`${formData.role === 'offreur' ? 'text-indigo-600 font-medium' : 'text-gray-600'} group-hover:text-indigo-500 transition-colors`}>
                  Offreur
                </span>
              </motion.label>
              
              <motion.label 
                className="relative flex items-center cursor-pointer group"
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="radio"
                  name="role"
                  value="etudiant"
                  onChange={handleChange}
                  className="hidden"
                />
                <span className={`w-4 h-4 rounded-full border inline-block mr-2 ${formData.role === 'etudiant' ? 'border-indigo-600' : 'border-gray-400'}`}>
                  {formData.role === 'etudiant' && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0.5 bg-indigo-600 rounded-full"
                    />
                  )}
                </span>
                <span className={`${formData.role === 'etudiant' ? 'text-indigo-600 font-medium' : 'text-gray-600'} group-hover:text-indigo-500 transition-colors`}>
                  Étudiant
                </span>
              </motion.label>
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </motion.button>

            {/* OR */}
            <motion.div variants={itemVariants} className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500">ou</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </motion.div>

            {/* Social login buttons */}
            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              <FcGoogle className="mr-3" size={20} />
              <span>S'inscrire avec Google</span>
            </motion.button>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              <FaFacebookF className="mr-3 text-blue-600" size={20} />
              <span>S'inscrire avec Facebook</span>
            </motion.button>
            
            <motion.div variants={itemVariants} className="text-center text-gray-500 text-sm mt-6">
              Vous avez déjà un compte? {" "}
              <motion.a 
                href="/login"
                className="text-indigo-600 font-medium hover:text-indigo-800"
                whileHover={{ scale: 1.05 }}
              >
                Se connecter
              </motion.a>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* Section d'illustration à droite */}
        <motion.div 
          className="md:col-span-2 space-y-8 hidden md:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-4">
              Rejoignez notre communauté en pleine expansion
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Échangez avec des entreprises et des étudiants via notre puissante plateforme pour développer votre réseau professionnel.
            </p>
            
            <div className="flex flex-wrap gap-3 mt-10">
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="ml-3">Sécurité renforcée</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="ml-3">Mise en relation rapide</span>
              </motion.div>

              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="ml-3">Communauté active</span>
              </motion.div>
            </div>
          </div>
          
          {/* Images stylisées */}
          <motion.div 
            className="grid grid-cols-4 gap-2 mt-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div 
                key={i}
                className={`rounded-t-full h-32 overflow-hidden bg-gradient-to-b ${
                  i === 0 ? 'from-blue-400 to-blue-600' :
                  i === 1 ? 'from-indigo-400 to-indigo-600' :
                  i === 2 ? 'from-violet-400 to-violet-600' :
                  'from-purple-400 to-purple-600'
                }`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className="h-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Trust signals */}
          <motion.div 
            className="flex flex-wrap gap-4 justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-600">
              +5000 utilisateurs
            </span>
            <span className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-600">
              100% sécurisé
            </span>
            <span className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-600">
              Support 24/7
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;