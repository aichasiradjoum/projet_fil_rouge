import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Messagerie = ({ candidatureId, user }) => {
  const [messages, setMessages] = useState([]);
  const [contenu, setContenu] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      if (!candidatureId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/messages/${candidatureId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des messages :", err);
      }
    };

    fetchMessages();
  }, [candidatureId]);

  const envoyerMessage = async (e) => {
    e.preventDefault();
    if (!contenu.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/messages",
        {
          candidature_id: candidatureId,
          message: contenu,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prev) => [...prev, res.data]);
      setContenu("");
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md w-full max-w-xl">
      <h2 className="text-lg font-bold mb-4">Messagerie</h2>

      <div className="h-64 overflow-y-auto border rounded p-2 space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-500">Aucun message pour cette candidature.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded max-w-[75%] ${
                msg.sender_id === user.id
                  ? "bg-blue-100 ml-auto text-right"
                  : "bg-gray-100"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={envoyerMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          className="flex-grow border px-2 py-1 rounded"
          placeholder="Écrivez un message..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default Messagerie;
