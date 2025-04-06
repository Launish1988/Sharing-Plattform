// Datei: src/pages/ProductPage.jsx
import React, { useState, useEffect } from "react";

export default function ProductPage() {
  const [input, setInput] = useState("");
  const [productColumns, setProductColumns] = useState({
    pool: [],
    kai: [],
    steffen: [],
    archiv: [],
  });

  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) setProductColumns(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(productColumns));
  }, [productColumns]);

  const addProduct = async () => {
    if (!input) return;
    try {
      const proxy = "https://api.allorigins.win/get?url=";
      const url = encodeURIComponent(input);
      const response = await fetch(`${proxy}${url}`);
      const data = await response.json();
      const doc = new DOMParser().parseFromString(data.contents, "text/html");

      const title = doc.querySelector("title")?.innerText || "Unbekanntes Produkt";
      const img = doc.querySelector("meta[property='og:image']")?.content || "";

      const newProduct = {
        id: Date.now(),
        url: input,
        title,
        img,
        rating: null,
      };

      setProductColumns((prev) => ({
        ...prev,
        pool: [newProduct, ...prev.pool],
      }));
      setInput("");
    } catch {
      alert("❌ Produkt konnte nicht geladen werden.");
    }
  };

  const moveProduct = (id, from, to) => {
    const item = productColumns[from].find((p) => p.id === id);
    if (!item) return;
    setProductColumns((prev) => ({
      ...prev,
      [from]: prev[from].filter((p) => p.id !== id),
      [to]: [item, ...prev[to]],
    }));
  };

  const updateRating = (id, column, value) => {
    setProductColumns((prev) => ({
      ...prev,
      [column]: prev[column].map((p) => (p.id === id ? { ...p, rating: value } : p)),
    }));
  };

  const renderColumn = (title, key) => (
    <div className="flex-1 bg-[#1f1f23] p-4 rounded-lg min-h-[300px]">
      <h3 className="text-lg text-[#9146FF] font-semibold mb-2">{title}</h3>
      <div className="space-y-4">
        {productColumns[key].map((product) => (
          <div key={product.id} className="bg-gray-900 p-3 rounded-lg">
            {product.img && (
              <img
                src={product.img}
                alt={product.title}
                className="w-full h-40 object-contain mb-2"
              />
            )}
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-[#9146FF] hover:underline mb-1"
            >
              {product.title}
            </a>
            <div className="flex gap-1 mb-2">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateRating(product.id, key, i + 1)}
                  className={`px-1 py-0.5 rounded text-xs ${
                    product.rating === i + 1 ? "bg-[#9146FF] text-white" : "bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {Object.keys(productColumns).map(
                (col) =>
                  col !== key && (
                    <button
                      key={col}
                      onClick={() => moveProduct(product.id, key, col)}
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
        <h2 className="text-3xl font-bold text-[#9146FF]">🛒 Produkt-Bereich</h2>
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
          placeholder="Produktlink einfügen (z. B. Amazon)"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={addProduct}
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
