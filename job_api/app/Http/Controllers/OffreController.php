<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Offre;

class OffreController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $employeur = $user->employeur;

        // Vérifiez que l'utilisateur est un employeur
        if (!$user->isEmployeur() || !$employeur) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
   
        // Récupérez les offres de l'employeur connecté
        $offres = Offre::where('employeur_id', $employeur->id)->get();
        // dd($user->id, $user->employeur);
        return response()->json(['offres' => $offres]);
        
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string',
            'description' => 'required|string',
            'lieu' => 'required|string',
            'type' => 'required|string',
            'date_limite' => 'required|date',
            'remuneration' => 'nullable|numeric|min:0', 
        ]);
        $offre = $request->user()->employeur->offres()->create($request->all());

        return response()->json(['message' => 'Offre créée avec succès', 'offre' => $offre], 201);
    }
    public function update(Request $request, $id)
    {
        $offre = Offre::findOrFail($id);

        if ($offre->employeur_id !== $request->user()->employeur->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }
        $offre->update($request->only(['titre', 'description', 'lieu', 'type', 'date_limite']));

        return response()->json(['message' => 'Offre mise à jour', 'offre' => $offre]);
    }
    public function destroy(Request $request, $id)
    {
        $offre = Offre::findOrFail($id);

        if ($offre->employeur_id !== $request->user()->employeur->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $offre->delete();

        return response()->json(['message' => 'Offre supprimée']);
    }

    public function candidatures($id)
    {
        $offre = Offre::findOrFail($id);

        // Vérifiez que l'utilisateur connecté est l'employeur qui a publié l'offre
        if (auth()->id() !== $offre->employeur_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }

        // Récupérez les candidatures associées à l'offre
        $candidatures = $offre->candidatures()->get();

        // Inclure les informations de l'étudiant dans les candidatures
        $candidatures = $offre->candidatures()->with('etudiant')->get();
        

        return response()->json(['candidatures' => $candidatures]);
    }
}
