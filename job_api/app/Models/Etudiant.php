<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'ecole',
        'filiere',
        'niveau',
        'bio',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function candidatures()
    {
    return $this->hasMany(Candidature::class);
    }

}
