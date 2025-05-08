namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['candidature_id', 'sender_id', 'message', 'vu'];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function candidature()
    {
        return $this->belongsTo(Candidature::class);
    }
}
