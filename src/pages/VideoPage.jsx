// Datei: src/pages/VideoPage.jsx
import React, { useState } from "react";
import RatingStars from "../components/RatingStars";
import TagSelector from "../components/TagSelector";
import CategorySelect from "../components/CategorySelect";
import DraggableCard from "../components/DraggableCard";

export default function VideoPage() {
  const [videos, setVideos] = useState([]);
  const [input, setInput] = useState("");
  const [selectedTag, setSelectedTag] = useState("Hammer Video");
  const [category, setCategory] = useState("Gaming");
  const [targetUser, setTargetUser] = useState("Lukas");

  const addVideo = () => {
    if (!input) return;
    const newVideo = {
      id: Date.now(),
      url: input,
      tag: selectedTag,
      category,
      targetUser,
      rating: 0,
      archived: false
    };
    setVideos([newVideo, ...videos]);
    setInput("");
  };

  const updateRating = (id, rating) => {
    setVideos(
      videos.map((v) => (v.id === id ? { ...v, rating } : v))
    );
  };

  const archiveVideo = (id) => {
    setVideos(
      videos.map((v) => (v.id === id ? { ...v, archived: true } : v))
    );
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-6">
      <h2 className="text-3xl font-bold text-[#9146FF] mb-4">📺 Video-Bereich</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="YouTube-Link hier einfügen..."
          className="w-full md:w-1/2 px-4 py-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={addVideo}
          className="bg-[#9146FF] px-4 py-2 rounded hover:bg-[#772ce8]"
        >
          Hinzufügen
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <CategorySelect category={category} setCategory={setCategory} />
        <TagSelector selected={selectedTag} setSelected={setSelectedTag} />
        <input
          value={targetUser}
          onChange={(e) => setTargetUser(e.target.value)}
          placeholder="Für wen ist das Video?"
          className="px-4 py-2 rounded bg-gray-800 text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          !video.archived && (
            <DraggableCard
              key={video.id}
              video={video}
              onArchive={() => archiveVideo(video.id)}
            >
              <div className="p-4 bg-gray-900 rounded-lg">
                <iframe
                  className="w-full h-48 rounded"
                  src={video.url.replace("watch?v=", "embed/")}
                  allowFullScreen
                ></iframe>
                <div className="mt-2 text-sm text-gray-300">
                  🎯 Für: {video.targetUser} | 📁 {video.category} | 🏷️ {video.tag}
                </div>
                <RatingStars
                  value={video.rating}
                  onChange={(val) => updateRating(video.id, val)}
                />
              </div>
            </DraggableCard>
          )
        ))}
      </div>
    </div>
  );
}
