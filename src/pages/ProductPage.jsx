// Datei: src/pages/ProductPage.jsx
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kmbdieietszbfsbrldtx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttYmRpZWlldHN6YmZzYnJsZHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NTAyNjUsImV4cCI6MjA1"
);

export default function ProductPage() {
  const [input, setInput] = useState("");
  const [products, setProducts] = useState({
    pool: [],
    kai: [],
    steffen: [],
    archiv: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select();
      if (!data) return;
      const grouped = { pool: [], kai: [], steffen: [], archiv: [] };
      data.forEach((p) => {
        grouped[p.category].push(p);
      });
      setProducts(grouped);
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
        "Unbenannter Artikel";

      const image =
        doc.querySelector("meta[property='og:image']")?.content ||
        "";

      const newProduct = {
        url: input,
        title,
        image,
        category: "pool",
        rating: 0,
      };

      await supabase.from("products").insert(newProduct);
      setProducts((prev) => ({
        ...prev,
        pool: [newProduct, ...prev.pool],
      }));
      setInput("");
    } catch (err) {
      alert("❌ Artikel konnte nicht geladen werden");
    }
  };

  const moveProduct = async (product, toCategory) => {
    await supabase
      .from("products")
      .update({ category: toCategory })
      .eq("url", product.url);
    setProducts((prev) => {
      const updated = { ...prev };
      updated[product.category] = updated[product.category].filter(
        (p) => p.url !== product.url
      );
      updated[toCategory] = [product, ...updated[toCategory]];
      return updated;
    });
  };

  const rateProduct = async (product, rating) => {
    await supabase
      .from("products")
      .update({ rating })
      .eq("url", product.url);
    setProducts((prev) => {
      const updated = { ...prev };
      updated[product.category] = updated[product.category].map((p) =>
        p.url === product.url ? { ...p, rating } : p
      );
      return updated;
    });
  };

  const renderColumn = (title, key) => (
    <div className="bg-[#1f1f23] p-4 rounded-lg min-h-[300px]">
      <h3 className="text-lg text-[#9146FF] font-semibold mb-2">{title}</h3>
      <div className="space-y-4">
        {products[key].map((product, idx) => (
          <div key={idx} className="bg-gray-900 p-3 rounded-lg">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain rounded"
              />
            )}
            <p className="text-sm text-white mt-2">{product.title}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.keys(products).map((cat) =>
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
            <div className="flex gap-1 mt-2">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => rateProduct(product, i + 1)}
                  className={`text-xs px-2 py-1 rounded ${
                    product.rating === i + 1
                      ? "bg-[#9146FF]"
                      : "bg-gray-700 hover:bg-gray-600"
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
          placeholder="Produkt-Link hier einfügen..."
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
