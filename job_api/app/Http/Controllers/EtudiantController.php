<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Etudiant;

class EtudiantController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non authentifié.'], 401);
        }

        $etudiant = $user->etudiant; // relation définie dans le modèle User

        if (!$etudiant) {
            return response()->json(['message' => 'Profil étudiant introuvable.'], 404);
        }

        return response()->json($etudiant->load('user'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'ecole' => 'required|string',
            'filiere' => 'required|string',
            'niveau' => 'required|string',
            'bio' => 'nullable|string',
        ]);

        // Vérifie si un profil existe déjà pour éviter les doublons
        if ($request->user()->etudiant) {
            return response()->json(['message' => 'Un profil existe déjà pour cet utilisateur.'], 409);
        }

        $etudiant = Etudiant::create([
            'user_id' => $request->user()->id,
            'ecole' => $request->ecole,
            'filiere' => $request->filiere,
            'niveau' => $request->niveau,
            'bio' => $request->bio,
        ]);

        return response()->json(['message' => 'Profil créé avec succès', 'profil' => $etudiant], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'ecole' => 'string|nullable',
            'filiere' => 'string|nullable',
            'niveau' => 'string|nullable',
            'bio' => 'nullable|string',
        ]);

        $etudiant = $request->user()->etudiant;

        if (!$etudiant) {
            return response()->json(['message' => 'Profil non trouvé.'], 404);
        }

        $etudiant->update($request->only(['ecole', 'filiere', 'niveau', 'bio']));

        return response()->json(['message' => 'Profil mis à jour', 'profil' => $etudiant]);
    }

    public function showPublic($id)
    {
        $etudiant = Etudiant::with('user')->find($id);

        if (!$etudiant) {
            return response()->json(['message' => 'Profil étudiant public introuvable.'], 404);
        }

        return response()->json($etudiant);
    }
}
