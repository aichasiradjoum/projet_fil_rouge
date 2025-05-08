export default function CallToAction() {
    return (
      <section className="bg-gray-100 rounded-2xl p-10 text-center max-w-4xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Prêt à décrocher le job de vos rêves ?
        </h2>
        <p className="text-gray-600 mb-6">
          Rejoignez notre plateforme aujourd’hui et commencez à postuler à des offres adaptées à votre profil.
        </p>
        <a
          href="/register"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Rejoindre maintenant
        </a>
      </section>
    );
  }
  