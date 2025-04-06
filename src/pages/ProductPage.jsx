// Datei: src/pages/ProductPage.jsx
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kmbdieietszbfsbrldtx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttYmRpZWlldHN6YmZzYnJsZHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NTAyNjUsImV4cCI6MjA1"
);

export default function ProductPage() {
  const [input, setInput] = useState("");
  const [productColumns, setProductColumns] = useState({
    pool: [],
    kai: [],
    steffen: [],
    archiv: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select();
      if (!data) return;
      const cols = { pool: [], kai: [], steffen: [], archiv: [] };
      data.forEach((p) => {
        cols[p.category].push(p);
      });
      setProductColumns(cols);
    };
    fetchProducts();
  }, []);

  const addProduct = async () => {
    if (!input) return;
    try {
      const proxy = "https://api.allorigins.win/raw?url=";
      const url = encodeURIComponent(input);
      const response = await fetch(`${proxy}${url}`);
      const htmlText = await response.text();
      const doc = new DOMParser().parseFromString(htmlText, "text/html");

      const title =
        doc.querySelector("meta[property='og:title']")?.content ||
        doc.querySelector("title")?.innerText ||
        "Unbekanntes Produkt";
      const img =
        doc.querySelector("meta[property='og:image']")?.content || "";

      const newProduct = {
        url: input,
        title,
        image: img,
        rating: null,
        category: "pool",
        owner: "user",
      };

      await supabase.from("products").insert(newProduct);
      setProductColumns((prev) => ({ ...prev, pool: [newProduct, ...prev.pool] }));
      setInput("");
    } catch (e) {
      console.error(e);
      alert("❌ Produkt konnte nicht geladen werden.");
    }
  };

  const renderColumn = (title, key) => (
    <div className="bg-[#1f1f23] p-4 rounded-lg min-h-[300px]">
      <h3 className="text-lg text-[#9146FF] font-semibold mb-2">{title}</h3>
      <div className="space-y-4">
        {productColumns[key].map((product, idx) => (
          <div key={idx} className="bg-gray-900 p-3 rounded-lg">
            {product.image && (
              <img
                src={product.image}
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
            <div className="flex flex-wrap gap-1 mb-2">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i}
                  onClick={async () => {
                    await supabase
                      .from("products")
                      .update({ rating: i + 1 })
                      .eq("url", product.url);
                    setProductColumns((prev) => ({
                      ...prev,
                      [key]: prev[key].map((p) =>
                        p.url === product.url ? { ...p, rating: i + 1 } : p
                      ),
                    }));
                  }}
                  className={`px-1 py-0.5 rounded text-xs ${
                    product.rating === i + 1 ? "bg-[#9146FF] text-white" : "bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
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

      <div className="flex flex-col md:flex-row gap-4 mb-6">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderColumn("Pool", "pool")}
        {renderColumn("Kai", "kai")}
        {renderColumn("Steffen", "steffen")}
        {renderColumn("Archiv", "archiv")}
      </div>
    </div>
  );
}
