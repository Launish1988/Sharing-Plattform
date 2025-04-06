import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kmbdieietszbfsbrldtx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
);

export default function ProductPage() {
  const [input, setInput] = useState("");
  const [columns, setColumns] = useState({
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
      setColumns(cols);
    };
    fetchProducts();
  }, []);

  const addProduct = async () => {
    if (!input) return;

    const res = await fetch(`https://jsonlink.io/api/extract?url=${input}`);
    const meta = await res.json();
    if (!meta || !meta.images?.[0]) return alert("Kein Vorschaubild gefunden");

    const newProduct = {
      url: input,
      title: meta.title,
      image: meta.images[0],
      category: "pool",
      rating: null,
    };

    await supabase.from("products").insert(newProduct);
    setColumns((prev) => ({ ...prev, pool: [newProduct, ...prev.pool] }));
    setInput("");
  };

  const moveProduct = async (product, toCategory) => {
    await supabase
      .from("products")
      .update({ category: toCategory })
      .eq("url", product.url);
    setColumns((prev) => {
      const updated = { ...prev };
      updated[product.category] = updated[product.category].filter(
        (p) => p.url !== product.url
      );
      updated[toCategory] = [product, ...updated[toCategory]];
      return updated;
    });
  };

  const rateProduct = async (product, score) => {
    await supabase
      .from("products")
      .update({ rating: score })
      .eq("url", product.url);
    setColumns((prev) => {
      const updated = { ...prev };
      const list = updated[product.category].map((p) =>
        p.url === product.url ? { ...p, rating: score } : p
      );
      updated[product.category] = list;
      return updated;
    });
  };

  const renderColumn = (title, key) => (
    <div className="bg-[#1f1f23] p-4 rounded-lg min-h-[300px]">
      <h3 className="text-lg text-[#9146FF] font-semibold mb-2">{title}</h3>
      <div className="space-y-4">
        {columns[key].map((product, idx) => (
          <div key={idx} className="bg-gray-900 p-3 rounded-lg">
            <a href={product.url} target="_blank" rel="noopener noreferrer">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-cover rounded"
              />
              <p className="text-sm text-white mt-2">{product.title}</p>
            </a>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.keys(columns).map((cat) =>
                cat !== key ? (
                  <button
                    key={cat}
                    onClick={() => moveProduct(product, cat)}
                    className="bg-[#9146FF] px-2 py-1 rounded text-sm"
                  >
                    Zu {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ) : null
              )}
            </div>
            <div className="mt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => rateProduct(product, n)}
                  className={`px-2 py-1 m-0.5 text-sm rounded ${
                    product.rating === n
                      ? "bg-green-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {n}
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
          placeholder="Produkt-Link (z. B. Amazon) hier einfügen..."
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
