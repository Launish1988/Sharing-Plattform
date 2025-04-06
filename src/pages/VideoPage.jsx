import React, { useState } from "react";

export default function VideoPage() {
  const [input, setInput] = useState("");
  const [videoColumns, setVideoColumns] = useState({
    pool: [],
    kai: [],
    steffen: [],
    archiv: [],
  });

  const addVideo = () => {
    if (!input) return;
    const newVideo = {
      id: Date.now(),
      url: input,
    };
    setVideoColumns((prev) => ({
      ...prev,
      pool: [newVideo, ...prev.pool],
    }));
    setInput("");
  };

  const onDragStart = (e, fromColumn, videoId) => {
    e.dataTransfer.setData("fromColumn", fromColumn);
    e.dataTransfer.setData("videoId", videoId);
  };

  const onDrop = (e, toColumn) => {
    const fromColumn = e.dataTransfer.getData("fromColumn");
    const videoId = parseInt(e.dataTransfer.getData("videoId"));

    if (!fromColumn || !videoId || fromColumn === toColumn) return;

    setVideoColumns((prev) => {
      const videoToMove = prev[fromColumn].find((v) => v.id === videoId);
      if (!videoToMove) return prev;

      return {
        ...prev,
        [fromColumn]: prev[fromColumn].filter((v) => v.id !== videoId),
        [toColumn]: [videoToMove, ...prev[toColumn]],
      };
    });
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const renderColumn = (title, key) => (
    <div
      onDrop={(e) => onDrop(e, key)}
      onDragOver={allowDrop}
      className="bg-gray-900 rounded-lg p-4 flex-1 min-h-[300px]"
    >
      <h3 className="text-xl font-semibold text-[#9146FF] mb-2">{title}</h3>
      {videoColumns[key].map((video) => (
        <div
          key={video.id}
          draggable
          onDragStart={(e) => onDragStart(e, key, video.id)}
          className="mb-4 p-2 bg-gray-800 rounded shadow"
        >
          <iframe
            className="w-full h-48 rounded"
            src={video.url.replace("watch?v=", "embed/")}
            allowFullScreen
          ></iframe>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-6">
      <h2 className="text-3xl font-bold text-[#9146FF] mb-6">🎬 Video-Bereich</h2>

      <div className="flex gap-4 mb-8">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="YouTube-Link hier einfügen..."
          className="flex-1 px-4 py-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={addVideo}
          className="bg-[#9146FF] px-4 py-2 rounded hover:bg-[#772ce8]"
        >
          Hinzufügen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderColumn("Pool", "pool")}
        {renderColumn("Kai", "kai")}
        {renderColumn("Steffen", "steffen")}
        {renderColumn("Archiv", "archiv")}
      </div>
    </div>
  );
}
