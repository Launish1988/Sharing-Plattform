// Datei: src/pages/VideoPage.jsx
import React, { useState, useEffect } from "react";

export default function VideoPage() {
  const [input, setInput] = useState("");
  const [videoColumns, setVideoColumns] = useState({
    pool: [],
    kai: [],
    steffen: [],
    archiv: [],
  });

  useEffect(() => {
    const stored = localStorage.getItem("videos");
    if (stored) setVideoColumns(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("videos", JSON.stringify(videoColumns));
  }, [videoColumns]);

  const addVideo = async () => {
    if (!input) return;
    const videoId = input.split("v=")[1]?.split("&")[0];
    if (!videoId) return alert("❌ Ungültiger YouTube-Link!");

    const title = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`)
      .then((res) => res.json())
      .then((data) => data.title || "YouTube Video")
      .catch(() => "YouTube Video");

    const newVideo = {
      id: Date.now(),
      url: `https://www.youtube.com/embed/${videoId}`,
      title,
    };

    setVideoColumns((prev) => ({
      ...prev,
      pool: [newVideo, ...prev.pool],
    }));
    setInput("");
  };

  const moveVideo = (id, from, to) => {
    const item = videoColumns[from].find((v) => v.id === id);
    if (!item) return;
    setVideoColumns((prev) => ({
      ...prev,
      [from]: prev[from].filter((v) => v.id !== id),
      [to]: [item, ...prev[to]],
    }));
  };

  const renderColumn = (title, key) => (
    <div className="flex-1 bg-[#1f1f23] p-4 rounded-lg min-h-[300px]">
      <h3 className="text-lg text-[#9146FF] font-semibold mb-2">{title}</h3>
      <div className="space-y-4">
        {videoColumns[key].map((video) => (
          <div key={video.id} className="bg-gray-900 p-3 rounded-lg">
            <iframe
              className="w-full h-48 rounded mb-2"
              src={video.url}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="text-sm mb-2">{video.title}</div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(videoColumns).map(
                (col) =>
                  col !== key && (
                    <button
                      key={col}
                      onClick={() => moveVideo(video.id, key, col)}
                      className="text-xs text-white bg-[#9146FF] hover:bg-[#772ce8] px-2 py-1 rounded"
                    >
                      Zu {col.charAt(0).toUpperCase() + col.slice(1)}
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
        <h2 className="text-3xl font-bold text-[#9146FF]">🎬 Video-Bereich</h2>
        <a
          href="/"
          className="text-white text-sm hover:underline bg-[#9146FF] px-3 py-1 rounded"
        >
          Zurück zur Hauptseite
        </a>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="YouTube-Link hier einfügen…"
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
