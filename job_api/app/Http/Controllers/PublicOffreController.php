<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Offre;

class PublicOffreController extends Controller
{
   // 🔍 Lister toutes les offres (avec pagination optionnelle)
   public function index(Request $request)
   {
    $query = Offre::with('employeur.user');

    if ($request->has('type')) {
        $query->where('type', $request->type);
    }

    if ($request->has('lieu')) {
        $query->where('lieu', 'like', '%' . $request->lieu . '%');
    }

    if ($request->has('q')) {
        $query->where('titre', 'like', '%' . $request->q . '%');
    }

    return response()->json($query->latest()->paginate(10));
   }
   // 👁️ Voir les détails d'une offre
   public function show($id)
   {
       $offre = Offre::with('employeur.user')->findOrFail($id);

       return response()->json($offre);
   }
}
