// Datei: src/pages/VideoPage.jsx
import React, { useState } from "react";
import DraggableCard from "../components/DraggableCard";

export default function VideoPage() {
  const [input, setInput] = useState("");
  const [videos, setVideos] = useState([]);

  const addVideo = () => {
    if (!input) return;
    const newVideo = {
      id: Date.now(),
      url: input,
      location: "pool",
    };
    setVideos([newVideo, ...videos]);
    setInput("");
  };

  const moveVideo = (id, newLocation) => {
    setVideos(
      videos.map((video) =>
        video.id === id ? { ...video, location: newLocation } : video
      )
    );
  };

  const getEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return null;
    }
  };

  const renderColumn = (label, location) => (
    <div className="w-full md:w-1/3 p-2 bg-[#1f1f23] rounded">
      <h3 className="text-xl font-bold mb-2 text-[#9146FF]">{label}</h3>
      {videos
        .filter((v) => v.location === location)
        .map((video) => {
          const embedUrl = getEmbedUrl(video.url);
          return (
            <DraggableCard
              key={video.id}
              video={video}
              onMove={moveVideo}
              locations={["pool", "kai", "steffen"]}
            >
              <div className="p-4 bg-gray-900 rounded-lg">
                {embedUrl ? (
                  <iframe
                    className="w-full h-48 rounded"
                    src={embedUrl}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <p className="text-red-400">❌ Ungültiger Link</p>
                )}
              </div>
            </DraggableCard>
          );
        })}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-6">
      <h2 className="text-3xl font-bold text-[#9146FF] mb-4">📺 Video-Bereich</h2>

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

      <div className="flex flex-col md:flex-row gap-4">
        {renderColumn("Pool", "pool")}
        {renderColumn("Kai", "kai")}
        {renderColumn("Steffen", "steffen")}
      </div>
    </div>
  );
}
