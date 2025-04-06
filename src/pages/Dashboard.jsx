// Datei: src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-[#9146FF] mb-10">
        Brudi Sharing Plattform
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link
          to="/videos"
          className="bg-[#9146FF] hover:bg-[#772ce8] text-white text-center py-10 rounded-xl text-2xl font-semibold shadow-lg transition-all"
        >
          🎥 Video-Bereich
        </Link>

        <Link
          to="/produkte"
          className="bg-[#9146FF] hover:bg-[#772ce8] text-white text-center py-10 rounded-xl text-2xl font-semibold shadow-lg transition-all"
        >
          🛍️ Produkt-Empfehlungen
        </Link>
      </div>
    </div>
  );
}
