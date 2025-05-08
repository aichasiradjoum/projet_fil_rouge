# 🎓 CampusConnect - Plateforme pour petits boulots étudiants

CampusConnect est une application web et mobile qui met en relation des étudiants à la recherche de petits jobs et des offreurs de missions ponctuelles. Elle propose une interface simple, intuitive et adaptée à chacun des trois profils utilisateurs : étudiant, employeur, et administrateur.

## 🚀 Fonctionnalités principales

- ✅ Inscription et connexion sécurisées (par rôle)
- 📄 Consultation des offres disponibles
- 📨 Postulation rapide aux missions
- 🧑‍💼 Espace personnel pour les étudiants et les offreurs
- 🛠️ Gestion des offres et candidatures pour les offreurs
- 🧮 Tableau de bord administratif (suspension, statistiques)
- 📱 Interface responsive (adaptée web et mobile)

## 🛠️ Stack technique

- **Backend** : Laravel 12 (API RESTful)
- **Frontend** : React.js
- **Base de données** : MySQL / MariaDB
- **Communication** : Axios
- **Authentification** : Sanctum
- **Diagrammes & modélisation** : UML (class, use case, séquence)

## 📦 Installation

### Backend (Laravel)

```bash
git clone https://github.com/ton-depot/mini-jobs.git
cd Projet_fil_rouge/backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
Frontend (React)
bash
Copier
Modifier
cd ../frontend
npm install
npm run dev
⚠️ Assurez-vous que l’URL de l’API backend est bien configurée dans axios.js.

📁 Structure du projet
bash
Copier
Modifier
mini-jobs/
│
├── backend/       # Projet Laravel
│   ├── app/
│   └── routes/
│
├── frontend/      # Application React
│   ├── pages/
│   ├── components/
│   └── api/
🔐 Rôles utilisateurs
Rôle	Accès
Étudiant	Voir et postuler aux offres, gérer son profil
Offreur	Publier, modifier, supprimer des offres, voir les candidatures
Administrateur	Gérer les utilisateurs, voir les statistiques, modérer les offres

📊 Diagrammes disponibles
Diagramme de cas d’utilisation

Diagramme de classe

Diagramme de séquence

📈 Évolutions futures
Ajout d’une messagerie interne

Notifications en temps réel

Version mobile native (React Native)

Algorithme de suggestion d’offres

👨‍💻 Auteur
[Ton Nom]
Développeur Full-Stack
Contact : aichaousirajoum@gmail.com


