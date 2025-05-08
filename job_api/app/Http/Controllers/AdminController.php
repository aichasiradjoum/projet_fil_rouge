<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    public function index()
    {
        $users = User::with([
            'offres',                // pour les employeurs
            'candidatures.offre'     // pour les étudiants avec leurs offres liées
        ])->get();
    
        return response()->json($users);
    }

    public function suspend($id)
    {
        $user = User::findOrFail($id);
        $user->statut = 'suspendu';
        $user->save();

        return response()->json(['message' => 'Utilisateur suspendu']);
    }

    public function activer($id)
    {
        $user = User::findOrFail($id);
        $user->statut = 'actif';
        $user->save();

        return response()->json(['message' => 'Utilisateur activé']);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé']);
    }
    public function candidaturesEtudiant($id)
{
    $user = User::findOrFail($id);
    $etudiant = $user->etudiant;

    if (!$etudiant) {
        return response()->json(['message' => 'Pas un étudiant.'], 404);
    }

    $candidatures = $etudiant->candidatures()->with('offre')->get();

    return response()->json($candidatures);
}

    
public function offresOffreur($id)
{
    $offreur = \App\Models\User::findOrFail($id);
    if ($offreur->role !== 'offreur') {
        return response()->json(['message' => 'Pas un employeur'], 403);
    }

    return $offreur->offres; // ou selon ta relation
}
}
