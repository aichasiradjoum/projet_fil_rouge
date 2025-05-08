<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\EmployeurController;
use App\Http\Controllers\OffreController;
use App\Http\Controllers\PublicOffreController;
use App\Http\Controllers\CandidatureController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/messages/{candidature}', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware(['auth:sanctum', 'role:offreur'])->group(function () {
    Route::post('/jobs', [JobController::class, 'store']);
});


Route::middleware('auth:sanctum')->put('/profile', [AuthController::class, 'updateProfile']);

// Route réservée aux étudiants
Route::middleware(['auth:sanctum', 'isEtudiant'])->prefix('etudiant')->group(function () {
    // Candidatures
    Route::get('/candidatures', [CandidatureController::class, 'index']); // voir ses candidatures
    Route::post('/candidatures', [CandidatureController::class, 'store']); // postuler à une offre
    Route::delete('/candidatures/{id}', [CandidatureController::class, 'destroy']); // annuler une candidature
    // Profil
    Route::get('/profil', [EtudiantController::class, 'show']);
    Route::post('/profil', [EtudiantController::class, 'store']);
    Route::put('/profil', [EtudiantController::class, 'update']);
    Route::get('/etudiant', function (Request $request) {
    return response()->json($request->user()->etudiant->load('user'));
});
    // historique
    Route::get('/historique-missions', [CandidatureController::class, 'historique']);
    Route::get('/candidatures/mes-missions', [CandidatureController::class, 'mesMissions']);

});

Route::get('/etudiants/{id}', [EtudiantController::class, 'showPublic']);

// Route réservée aux employeurs
Route::middleware(['auth:sanctum', 'isEmployeur'])->group(function () {
    Route::middleware('auth:sanctum')->get('/employeur/profil', [EmployeurController::class, 'show']);
    Route::middleware('auth:sanctum')->put('/employeur', [EmployeurController::class, 'update']);
    Route::get('/offres', [OffreController::class, 'index']);
    Route::post('/offres', [OffreController::class, 'store']);
    Route::put('/offres/{id}', [OffreController::class, 'update']);
    Route::delete('/offres/{id}', [OffreController::class, 'destroy']);
    Route::get('/profil', [EmployeurController::class, 'show']);
    Route::post('/profil', [EmployeurController::class, 'store']);
    Route::put('/profil', [EmployeurController::class, 'update']);
    Route::get('/offres/{offre}/candidatures', [CandidatureController::class, 'parOffre']);
    Route::put('/candidatures/{id}/selection', [CandidatureController::class, 'selectionner']);
    Route::get('/offres/{id}/candidatures', [CandidatureController::class, 'index']);
    Route::middleware('auth:sanctum')->get('/employeur/notifications', [EmployeurController::class, 'notifications']);

    // Route::get('/offres/candidatures/nouvelles', [CandidatureController::class, 'nouvellesCandidaturesCount']);
    // Route::get('/offres/{offre}/candidatures/nouvelles', [CandidatureController::class, 'parOffreNonVues']);


});

// Route réservée aux administrateurs
Route::middleware(['auth:sanctum', 'isAdmin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'index']);
    Route::get('/users/{id}', [AdminController::class, 'activer']);
    Route::put('/users/{id}', [AdminController::class, 'suspend']);
    Route::delete('/users/{id}', [AdminController::class, 'destroy']);
    Route::get('/etudiant/{id}/candidatures', [AdminController::class, 'candidaturesEtudiant']);
    Route::get('/offreur/{id}/offres', [AdminController::class, 'offresOffreur']);   
});

Route::prefix('offres')->group(function () {
    Route::get('/', [PublicOffreController::class, 'index']);    // Liste
    Route::get('/{id}', [PublicOffreController::class, 'show']); // Détail
});
