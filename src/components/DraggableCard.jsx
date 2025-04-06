// Datei: src/components/DraggableCard.jsx
import React from "react";

export default function DraggableCard({ children }) {
  return (
    <div className="cursor-move">
      {children}
    </div>
  );
}
