<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidature extends Model
{
    use HasFactory;
    protected $fillable = ['etudiant_id', 'offre_id', 'message', 'statut'];

    public function offre()
    {
        return $this->belongsTo(Offre::class);
    }

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'etudiant_id'); // Assurez-vous que la clé étrangère est correcte
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
