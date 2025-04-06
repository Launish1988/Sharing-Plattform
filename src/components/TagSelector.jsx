

import React from "react";

export default function TagSelector({ selected, setSelected }) {
  const tags = ["Hammer Video", "Lustig", "Lerninhalt", "Highlight"];

  return (
    <select
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="px-4 py-2 rounded bg-gray-800 text-white"
    >
      {tags.map((tag) => (
        <option key={tag} value={tag}>
          {tag}
        </option>
      ))}
    </select>
  );
}
