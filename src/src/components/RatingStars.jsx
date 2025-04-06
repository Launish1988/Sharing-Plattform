
// Datei: src/components/RatingStars.jsx
import React from "react";

export default function RatingStars({ value, onChange }) {
  return (
    <div className="flex space-x-1 mt-2">
      {[...Array(10)].map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-sm
            ${i < value ? "bg-yellow-400 text-black" : "bg-gray-800 text-white"}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
