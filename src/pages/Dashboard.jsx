import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-[#9146FF] mb-8">
        Brudi Sharing Plattform
      </h1>

      <button
        onClick={() => navigate("/videos")}
        className="bg-[#9146FF] hover:bg-[#772ce8] px-6 py-3 rounded-lg text-lg font-semibold w-64"
      >
        🎥 Video-Bereich
      </button>
    </div>
  );
}
