<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Candidature;
use App\Models\Offre;
use App\Notifications\NouvelleCandidatureNotification;

class CandidatureController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'offre_id' => 'required|exists:offres,id',
        'message' => 'nullable|string'
    ]);

    $etudiant = $request->user()->etudiant;

    // Vérifier s'il a déjà candidaté
    if (Candidature::where('etudiant_id', $etudiant->id)
                   ->where('offre_id', $request->offre_id)->exists()) {
        return response()->json(['message' => 'Vous avez déjà postulé à cette offre.'], 409);
    }

    $candidature = Candidature::create([
        'etudiant_id' => $etudiant->id,
        'offre_id' => $request->offre_id,
        'message' => $request->message
    ]);

    // Notifier l'employeur
    $offre = Offre::with('employeur')->find($request->offre_id);

    if ($offre && $offre->employeur) {
        $offre->employeur->notify(new NouvelleCandidatureNotification($offre));
    }

    return response()->json([
        'message' => 'Candidature envoyée avec succès',
        'candidature' => $candidature
    ]);
}

    public function index(Request $request)
    {
        $etudiant = $request->user()->etudiant;

        $candidatures = $etudiant->candidatures()->with('offre')->latest()->get();

        return response()->json($candidatures);
    }

    public function parOffre(Request $request, $offreId)
    {
    $employeur = $request->user()->employeur;
    
    // On récupère l’offre de l’employeur connecté
    $offre = $employeur->offres()->where('id', $offreId)->firstOrFail();
    if (!$offre) {
        return response()->json(['message' => 'Offre introuvable ou non autorisée'], 403);
    }

    $candidatures = $offre->candidatures()->with('etudiant.user')->get();

    return response()->json($candidatures);
    }
//     public function parOffreNonVues(Request $request, $offreId)
// {
//     $employeur = $request->user()->employeur;

//     // Vérifie que l'offre appartient à l'employeur connecté
//     $offre = $employeur->offres()->where('id', $offreId)->firstOrFail();
//     if (!$offre) {
//         return response()->json(['message' => 'Offre introuvable ou non autorisée'], 403);
//     }

//     // On récupère uniquement les candidatures non vues
//     $candidatures = $offre->candidatures()
//         ->where('vu', false)
//         ->with('etudiant.user')
//         ->get();

//     return response()->json($candidatures);
// }


    public function selectionner(Request $request, $id)
   {
    $candidature = Candidature::with('offre')->findOrFail($id);
    $employeur = $request->user()->employeur;

    // Vérifie que l'offre liée appartient bien à l'employeur connecté
    if ($candidature->offre->employeur_id !== $employeur->id) {
        return response()->json(['message' => 'Accès non autorisé.'], 403);
    }

    $candidature->update(['statut' => 'selectionne']);

    return response()->json(['message' => 'Candidat sélectionné avec succès.']);
    }
    
    public function historique(Request $request)
    {
    $etudiant = $request->user()->etudiant;

    $historique = Candidature::with('offre')
        ->where('etudiant_id', $etudiant->id)
        ->where('statut', 'selectionne')
        ->whereHas('offre', function ($query) {
            $query->where('date_limite', '<', now());
        })
        ->orderByDesc('created_at')
        ->get();

    return response()->json($historique);
    }
    public function destroy(Request $request, $id)
    {
        $candidature = Candidature::findOrFail($id);
        $etudiant = $request->user()->etudiant;

        // Vérifier que la candidature appartient à l'étudiant connecté
        if ($candidature->etudiant_id !== $etudiant->id) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $candidature->delete();

        return response()->json(['message' => 'Candidature supprimée avec succès.']);
    }
    public function mesMissions(Request $request)
    {
    $etudiant = $request->user()->etudiant;

    $missions = Candidature::with('offre')
        ->where('etudiant_id', $etudiant->id)
        ->orderByDesc('created_at')
        ->get();

    return response()->json($missions);
    }
    public function nouvellesCandidaturesCount()
{
    $employeur = Auth::user()->employeur;

    if (!$employeur) {
        return response()->json(['error' => 'Employeur non trouvé'], 404);
    }

    // Récupérer toutes les offres de l'employeur
    $offresIds = $employeur->offres()->pluck('id');

    // Compter les candidatures non "vues" (par exemple avec un statut "en_attente")
    $count = \App\Models\Candidature::whereIn('offre_id', $offresIds)
        ->where('statut', 'en_attente')
        ->count();

    return response()->json(['count' => $count]);
}
}
