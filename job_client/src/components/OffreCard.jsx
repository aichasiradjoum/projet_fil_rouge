import React, { useState } from "react";
import api from "../api/axios";

const OffreCard = ({ offre }) => {
  const [afficherDetails, setAfficherDetails] = useState(false);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [aPostule, setAPostule] = useState(false);
  const handlePostuler = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/etudiant/candidatures",
        {
          offre_id: offre.id,
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFeedback("✅ Candidature envoyée !");
      setMessage("");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setFeedback("❌ " + error.response.data.message);
      } else {
        setFeedback("❌ Une erreur est survenue.");
      }
      console.error("Erreur lors de la postulation :", error);
    } finally {
      setLoading(false);
    }
    setAPostule(true);
  };
  

  return (
    <div className="border rounded-xl shadow p-4 bg-white mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{offre.titre}</h3>
          <p className="text-sm text-gray-500">📍 {offre.lieu}</p>
        </div>
        <button
          onClick={() => setAfficherDetails(!afficherDetails)}
          className="text-blue-600 hover:underline"
        >
          {afficherDetails ? "Masquer" : "Détails"}
        </button>
      </div>

      {afficherDetails && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">🗂️ Type : {offre.type}</p>
          <p className="text-sm text-gray-600 mb-1">💰 Rémunération : {offre.remuneration} €</p>
          <p className="text-sm text-gray-600 mb-1">📅 Date limite : {offre.date_limite}</p>
          <div className="mt-2 mb-2">
            <p className="font-semibold text-gray-700">📝 Description :</p>
            <p className="text-sm text-gray-600">{offre.description}</p>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full mt-3 p-2 border rounded"
            placeholder="Message pour l'employeur (facultatif)"
          />

<button
  onClick={handlePostuler}
  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
  disabled={loading || aPostule}
>
  {loading ? "Envoi..." : aPostule ? "Déjà postulé" : "Postuler"}
</button>

          {feedback && <p className="text-sm mt-2 text-green-700">{feedback}</p>}
        </div>
      )}
    </div>
  );
};

export default OffreCard;
