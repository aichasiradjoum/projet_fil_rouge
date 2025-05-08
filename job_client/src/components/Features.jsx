import React from "react";

const Features = () => {
  return (
    <section className="bg-[#EDF0FB] px-8 py-16 rounded-3xl my-16 w-full">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Pourquoi choisir CampusConnect ?
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Un portail pensé pour les étudiants, des opportunités à portée de clic.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Facilité d'accès</h3>
            <p className="text-gray-600">Trouvez rapidement les offres disponibles autour de vous.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Adapté aux étudiants</h3>
            <p className="text-gray-600">Des jobs flexibles compatibles avec votre emploi du temps.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Recruteurs fiables</h3>
            <p className="text-gray-600">Tous les employeurs sont vérifiés pour votre sécurité.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
