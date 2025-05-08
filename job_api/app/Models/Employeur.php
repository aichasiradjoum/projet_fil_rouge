<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Employeur extends Model
{
    use Notifiable;
    use HasFactory;
    protected $fillable = [
        'user_id',
        'entreprise',
        'secteur',
        'description',
        'site_web'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function offres()
    {
    return $this->hasMany(Offre::class);
    }
}
