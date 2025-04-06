import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-[#9146FF] mb-4 flex items-center gap-2">
        🎮 Sharing Plattform – Twitch Style
      </h1>
      <p className="mb-6 text-center text-lg">
        Willkommen! Hier kannst du mit Freunden Inhalte teilen, bewerten und kommentieren.
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/videos")}
          className="bg-[#9146FF] hover:bg-[#772ce8] text-white font-semibold py-3 px-6 rounded-lg shadow-md flex items-center gap-2"
        >
          🎬 Video-Bereich
        </button>
        <button
          onClick={() => navigate("/produkte")}
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md flex items-center gap-2"
        >
          🛒 Produkt-Empfehlungen
        </button>
      </div>
    </div>
  );
}
