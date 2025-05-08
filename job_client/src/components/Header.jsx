import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import logo from "../public/logo.png";

export default function Header() {
  return (
    <header className="bg-[#EDF0FB] px-8 py-4 rounded-b-2xl shadow flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo}alt="Campus Connect" className="h-10" />
        <span className="text-xl font-bold text-[#1B2E59]">Campus<br />Connect</span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-8 font-semibold text-[#1B2E59]">
        <a href="#" className="hover:underline underline-offset-4">Accueil</a>
        <a href="#">Embauche</a>
        <div className="relative group">
          <button className="flex items-center gap-1">
            Categories <span>▾</span>
          </button>
          {/* Dropdown (optionnel pour l’instant, vide) */}
          <div className="absolute hidden group-hover:block bg-white shadow rounded mt-2 p-2">
            {/* À compléter */}
            <a href="#" className="block px-4 py-1 hover:bg-gray-100">Catégorie 1</a>
          </div>
        </div>
        <a href="#">Annonces</a>
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 border-2 border-[#1B2E59] text-[#1B2E59] px-4 py-2 rounded-full hover:bg-[#1B2E59] hover:text-white transition">
          <FaSignInAlt />
          Login
        </button>
        <button className="flex items-center gap-2 bg-[#1B2E59] text-white px-4 py-2 rounded-full hover:bg-[#142143] transition">
          <FaUserPlus />
          Register
        </button>
      </div>
    </header>
  );
}
