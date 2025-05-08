import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage2 from "./pages/LandingPage2";
import LoginPage from "./pages/LoginPage";
import EmployeurProfilePage from "./pages/EmployeurProfilePage";
import DashboardEmployeur from "./pages/DashboardEmployeur"; // Créez cette page si elle n'existe pas
import EtudiantProfile from "./pages/EtudiantProfile";
import DashboardEtudiant from "./pages/DashboardEtudiant"; // Créez cette page si elle n'existe pas
import DashboardAdmin from "./pages/DashboardAdmin"; // attention ici c'est la PAGE
import PrivateRoute from "./components/PrivateRoute";

// autres imports...
import "./App.css"; // Assurez-vous que le fichier CSS est importé ici

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/inscription" element={<LandingPage2 />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/employeur" element={<EmployeurProfilePage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["offreur"]}>
              <DashboardEmployeur />
            </PrivateRoute>
          }
        />
        <Route path="/profil-etudiant" element={<EtudiantProfile />} />
        <Route
          path="/dashboard-etudiant"
          element={
            <PrivateRoute allowedRoles={["etudiant"]}>
              <DashboardEtudiant />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <DashboardAdmin />
            </PrivateRoute>
          }
        />
        {/* autres routes */}
      </Routes>
    </Router>
  );
}
export default App;