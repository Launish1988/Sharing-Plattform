

import React from "react";

export default function DraggableCard({ video, onArchive, children }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", video.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="cursor-move border border-gray-700 rounded-lg overflow-hidden shadow-lg"
    >
      {children}
      <div className="flex justify-end p-2">
        <button
          onClick={onArchive}
          className="text-sm text-red-400 hover:underline"
        >
          Archivieren
        </button>
      </div>
    </div>
  );
}
