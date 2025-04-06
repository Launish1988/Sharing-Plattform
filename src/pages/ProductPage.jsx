// Datei: src/pages/ProductPage.jsx
import React, { useState } from "react";
import RatingStars from "../components/RatingStars";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [input, setInput] = useState("");
  const [note, setNote] = useState("");

  const addProduct = () => {
    if (!input) return;
    const newProduct = {
      id: Date.now(),
      url: input,
      note,
      rating: 0,
      archived: false
    };
    setProducts([newProduct, ...products]);
    setInput("");
    setNote("");
  };

  const updateRating = (id, rating) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, rating } : p))
    );
  };

  const archiveProduct = (id) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, archived: true } : p))
    );
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-6">
      <h2 className="text-3xl font-bold text-[#9146FF] mb-4">🛍️ Produkt-Bereich</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Produktlink einfügen..."
          className="w-full md:w-1/2 px-4 py-2 rounded bg-gray-800 text-white"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Kommentar / Anmerkung"
          className="w-full md:w-1/2 px-4 py-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={addProduct}
          className="bg-[#9146FF] px-4 py-2 rounded hover:bg-[#772ce8]"
        >
          Hinzufügen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          !product.archived && (
            <div
              key={product.id}
              className="p-4 bg-gray-900 rounded-lg shadow-lg"
            >
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-400 underline mb-2"
              >
                🔗 Zum Produkt
              </a>
              <div className="text-sm text-gray-300 mb-2">📝 {product.note}</div>
              <RatingStars
                value={product.rating}
                onChange={(val) => updateRating(product.id, val)}
              />
              <button
                onClick={() => archiveProduct(product.id)}
                className="mt-2 text-red-400 text-sm hover:underline"
              >
                Archivieren
              </button>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
