<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offre extends Model
{
    use HasFactory;
    protected $fillable = [
        'employeur_id',
        'titre',
        'description',
        'lieu',
        'type',
        'date_limite',
        'remuneration', // Ajoutez ce champ ici
    ];
    public function employeur()
    {
        return $this->belongsTo(Employeur::class);
    }
    public function candidatures()
    {
        return $this->hasMany(Candidature::class);
    }
}
