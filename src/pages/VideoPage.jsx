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

  const fetchVideos = async () => {
    const { data } = await supabase.from("videos").select();
    if (!data) return;
    const cols = { pool: [], kai: [], steffen: [], archiv: [] };
    data.forEach((v) => {
      cols[v.category].push(v);
    });
    setColumns(cols);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const addVideo = async () => {
    if (!input.includes("youtube")) return alert("Nur YouTube-Links erlaubt.");
    const videoId = input.split("v=")[1]?.split("&")[0];
    if (!videoId) return alert("Ungültiger Link");

    const title = await fetch(`https://noembed.com/embed?url=${input}`)
      .then(res => res.json())
      .then(data => data.title || "Video");

    const newVideo = {
      url: input,
      videoId,
      title,
      category: "pool",
    };

    await supabase.from("videos").insert(newVideo);
    fetchVideos();
    setInput("");
  };

  const moveVideo = async (video, toCategory) => {
    if (video.category === toCategory) return;
    await supabase.from("videos").update({ category: toCategory }).eq("url", video.url);
    fetchVideos();
  };

  const renderColumn = (title, key) => (
    <div className="bg-[#1f1f23] p-4 rounded-lg min-h-[300px]">
      <h3 className="text-lg text-[#9146FF] font-semibold mb-2">{title}</h3>
      <div className="space-y-4">
        {columns[key].map((video) => (
          <div key={video.url} className="bg-gray-900 p-3 rounded-lg">
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded mb-2"
            ></iframe>
            <p className="text-sm text-white mb-2">{video.title}</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(columns).map(
                (cat) =>
                  cat !== key && (
                    <button
                      key={cat}
                      onClick={() => moveVideo(video, cat)}
                      className="bg-[#9146FF] px-2 py-1 rounded text-sm"
                    >
                      Zu {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#9146FF]">🎥 Video-Bereich</h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderColumn("Pool", "pool")}
        {renderColumn("Kai", "kai")}
        {renderColumn("Steffen", "steffen")}
        {renderColumn("Archiv", "archiv")}
      </div>
    </div>
  );
}
