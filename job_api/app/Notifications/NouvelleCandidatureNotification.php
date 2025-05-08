<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NouvelleCandidatureNotification extends Notification
{
    use Queueable;

    protected $offre;

    public function __construct($offre)
    {
        $this->offre = $offre;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => "Un étudiant a postulé à votre offre : " . ($this->offre->titre ?? 'Offre inconnue'),
            'offre_id' => $this->offre->id ?? null,
        ];
    }
}
