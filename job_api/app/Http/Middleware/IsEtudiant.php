<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsEtudiant
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();
    if (!$user) {
        return response()->json(['message' => 'Utilisateur non authentifié.'], 401);
    }

    if ($user->role !== 'etudiant') {
        return response()->json(['message' => "Accès réservé aux étudiants. Votre rôle est : {$user->role}"], 403);
    }

    return $next($request);
    }
}
