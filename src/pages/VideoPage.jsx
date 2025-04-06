// Datei: src/pages/VideoPage.jsx
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kmbdieietszbfsbrldtx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttYmRpZWlldHN6YmZzYnJsZHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NTAyNjUsImV4cCI6MjA1"
);

export default function VideoPage() {
  const [input, setInput] = useState("");
  const [columns, setColumns] = useState({ pool: [], kai: [], steffen: [], archiv: [] });

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase.from("videos").select();
      if (!data) return;
      const cols = { pool: [], kai: [], steffen: [], archiv: [] };
      data.forEach((v) => cols[v.category].push(v));
      setColumns(cols);
    };
    fetchVideos();
  }, []);

  const addVideo = async () => {
    if (!input.includes("youtube")) return alert("❌ Nur YouTube-Links erlaubt!");
    const id = input.split("v=")[1]?.substring(0, 11);
    if (!id) return alert("❌ Kein valider YouTube-Link!");

    const api = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`;
    const res = await fetch(api);
    const { title } = await res.json();

    const video = { id, title, category: "pool" };
    await supabase.from("videos").insert(video);
    setColumns((prev) => ({ ...prev, pool: [video, ...prev.pool] }));
    setInput("");
  };

  const moveVideo = async (video, to) => {
    await supabase.from("videos").update({ category: to }).eq("id", video.id);
    setColumns((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = next[key].filter((v) => v.id !== video.id);
      });
      next[to].unshift({ ...video, category: to });
      return next;
    });
  };

  const renderColumn = (label, key) => (
    <div className="flex-1 bg-[#1f1f23] p-4 rounded-lg min-h-[300px]">
      <h3 className="text-lg text-[#9146FF] font-semibold mb-2">{label}</h3>
      <div className="space-y-4">
        {columns[key].map((video) => (
          <div key={video.id} className="bg-gray-900 p-3 rounded-lg">
            <iframe
              className="w-full aspect-video rounded"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              allowFullScreen
            ></iframe>
            <div className="text-sm mt-1 text-white">{video.title}</div>
            <div className="flex gap-2 mt-2">
              {Object.keys(columns).filter((k) => k !== key).map((target) => (
                <button
                  key={target}
                  onClick={() => moveVideo(video, target)}
                  className="text-xs bg-[#9146FF] hover:bg-[#772ce8] text-white px-2 py-1 rounded"
                >
                  Zu {target.charAt(0).toUpperCase() + target.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#9146FF]">🎬 Video-Bereich</h2>
        <a
          href="/"
          className="text-white text-sm hover:underline bg-[#9146FF] px-3 py-1 rounded"
        >
          Zurück zur Hauptseite
        </a>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="YouTube-Link hier einfügen..."
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={addVideo}
          className="bg-[#9146FF] px-4 py-2 rounded hover:bg-[#772ce8]"
        >
          Hinzufügen
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {renderColumn("Pool", "pool")}
        {renderColumn("Kai", "kai")}
        {renderColumn("Steffen", "steffen")}
        {renderColumn("Archiv", "archiv")}
      </div>
    </div>
  );
}
