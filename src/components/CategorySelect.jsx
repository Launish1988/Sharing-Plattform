

import React from "react";

export default function CategorySelect({ category, setCategory }) {
  const categories = ["Gaming", "Sport", "News", "Musik", "Wissen"];

  return (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="px-4 py-2 rounded bg-gray-800 text-white"
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
