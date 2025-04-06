import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kmbdieietszbfsbrldtx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
);

export default function VideoPage() {
  const [input, setInput] = useState("");
  const [columns, setColumns] = useState({
    pool: [],
    kai: [],
    steffen: [],
    archiv: [],
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase.from("videos").select();
    if (error) {
      console.error("❌ Fehler beim Laden der Videos:", error);
      return;
    }
    console.log("🎥 Videos geladen:", data);

    const cols = { pool: [], kai: [], steffen: [], archiv: [] };
    data.forEach((v) => {
      if (cols[v.category]) {
        cols[v.category].push(v);
      }
    });
    setColumns(cols);
  };

  const extractYouTubeId = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
    );
    return match ? match[1] : null;
  };

  const fetchTitle = async (url) => {
    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      return json.title || "YouTube Video";
    } catch {
      return "YouTube Video";
    }
  };

  const addVideo = async () => {
    const videoId = extractYouTubeId(input);
    console.log("📺 Video ID:", videoId);
    if (!videoId) return alert("❌ Ungültiger YouTube-Link");

    const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const { data: existing, error: checkError } = await supabase
      .from("videos")
      .select()
      .eq("url", cleanUrl);

    if (checkError) {
      console.error("❌ Fehler bei Existenzprüfung:", checkError);
      return;
    }

    if (existing?.length > 0) {
      alert("⚠️ Dieses Video ist bereits vorhanden.");
      return;
    }

    const title = await fetchTitle(cleanUrl);

    const { error: insertError } = await supabase
      .from("videos")
      .insert({ url: cleanUrl, title, category: "pool" });

    if (insertError) {
      console.error("❌ Fehler beim Speichern:", insertError);
      return;
    }

    console.log("✅ Video gespeichert:", cleanUrl);
    setInput("");
    fetchVideos();
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
              src={`https://www.youtube.com/embed/${extractYouTubeId(video.url)}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-48 mb-2 rounded"
            />
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
        <a href="/" className="text-white text-sm hover:underline bg-[#9146FF] px-3 py-1 rounded">
          Zurück zur Hauptseite
        </a>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="YouTube-Link einfügen"
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
