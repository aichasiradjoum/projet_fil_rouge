<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index($id)
{
    $messages = Message::where('candidature_id', $id)->with('sender')->orderBy('created_at')->get();
    return response()->json($messages);
}

public function store(Request $request, $id)
{
    $request->validate(['message' => 'required|string']);

    $message = Message::create([
        'candidature_id' => $id,
        'sender_id' => $request->user()->id,
        'message' => $request->message,
    ]);

    return response()->json($message, 201);
}

}
