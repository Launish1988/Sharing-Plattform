import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ✅ Supabase Client konfigurieren
const supabase = createClient(
  "https://kmbdieietszbfsbrldtx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttYmRpZWlldHN6YmZzYnJsZHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NTAyNjUsImV4cCI6MjA1OTUyNjI2NX0.6rE3pv0aA7Qp_UhJ-0QDzJp3E7Z_Bf_WJmoAMXXqLpo"
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
    console.log("🔍 Starte Supabase-Check ...");
    supabase
      .from("videos")
      .select()
      .then(({ data, error }) => {
        if (error) {
          console.error("❌ Supabase-Fehler:", error);
        } else {
          console.log("✅ Supabase-Daten geladen:", data);
        }
      });

    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase.from("videos").select();
    if (error) {
      console.error("❌ Fehler beim Laden der Videos:", error);
      return;
    }

    const cols = { pool: [], kai: [], steffen: [], archiv: [] };
    data.forEach((v) => {
      if (cols[v.category]) {
        cols[v.category].push(v);
      }
    });
    setColumns(cols);
  };

  const extractYouTubeId = (url) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtu.be")) {
        return parsed.pathname.slice(1);
      } else if (parsed.hostname.includes("youtube.com")) {
        return parsed.searchParams.get("v");
      }
    } catch (err) {
      console.error("❌ Fehler beim Parsen:", err);
      return null;
    }
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
    console.log("📺 Video ID extrahiert:", videoId);

    if (!videoId) {
      alert("❌ Ungültiger YouTube-Link");
      return;
    }

    const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log("🧼 Bereinigte URL:", cleanUrl);

    const { data: existing, error: checkError } = await supabase
      .from("videos")
      .select()
      .eq("url", cleanUrl);

    if (checkError) {
      console.error("❌ Fehler bei der Duplikatprüfung:", checkError);
      alert("❌ Fehler bei Duplikatprüfung. Siehe Konsole.");
      return;
    }

    if (existing?.length > 0) {
      alert("⚠️ Dieses Video ist bereits vorhanden.");
      return;
    }

    const title = await fetchTitle(cleanUrl);
    console.log("📄 Gefundener Titel:", title);

    const { error: insertError } = await supabase
      .from("videos")
      .insert({ url: cleanUrl, title, category: "pool" });

    if (insertError) {
      console.error("❌ Fehler beim Speichern in Supabase:", insertError);
      alert("❌ Fehler beim Speichern in Supabase. Siehe Konsole.");
      return;
    }

    console.log("✅ Video erfolgreich gespeichert!");
    alert("✅ Video wurde gespeichert!");
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
