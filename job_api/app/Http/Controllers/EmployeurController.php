<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employeur;

class EmployeurController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

    if (!$user->isEmployeur()) {
        return response()->json(['message' => 'Accès interdit.'], 403);
    }

    $employeur = $user->employeur; // relation définie dans User.php

    if (!$employeur) {
        return response()->json(['message' => 'Profil employeur introuvable.'], 404);
    }

    return response()->json($employeur->load('user'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'entreprise' => 'required|string',
            'secteur' => 'required|string',
            'description' => 'nullable|string',
            'site_web' => 'nullable|url',
        ]);
        $employeur = Employeur::create([
            'user_id' => $request->user()->id,
            'entreprise' => $request->entreprise,
            'secteur' => $request->secteur,
            'description' => $request->description,
            'site_web' => $request->site_web,
        ]);

        return response()->json(['message' => 'Profil employeur créé avec succès', 'profil' => $employeur]);
    }
    public function update(Request $request)
    {
        $request->validate([
            'entreprise' => 'string|nullable',
            'secteur' => 'string|nullable',
            'description' => 'nullable|string',
            'site_web' => 'nullable|url',
        ]);

        $employeur = $request->user()->employeur;

        if (!$employeur) {
            return response()->json(['message' => 'Profil non trouvé.'], 404);
        }

        $employeur->update($request->only(['entreprise', 'secteur', 'description', 'site_web']));

        return response()->json(['message' => 'Profil mis à jour', 'profil' => $employeur]);
    }
    public function notifications(Request $request)
    {
        $employeur = $request->user()->employeur;

        if (!$employeur) {
            return response()->json(['message' => 'Profil non trouvé.'], 404);
        }

        // Récupérer les notifications de l'employeur
        $notifications = $employeur->notifications;

        return response()->json($notifications);
    }
}
