<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    use Notifiable;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'statut',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    public function etudiant()
    {
        return $this->hasOne(Etudiant::class);
    }
    public function employeur()
    {
        return $this->hasOne(Employeur::class);
    }
    public function candidatures()
    {
    return $this->hasMany(\App\Models\Candidature::class, 'etudiant_id');
    }

   public function offres()
   {
    return $this->hasMany(\App\Models\Offre::class, 'employeur_id');
   }
   public function isEmployeur()
   {
       return $this->employeur !== null;
   }

}
