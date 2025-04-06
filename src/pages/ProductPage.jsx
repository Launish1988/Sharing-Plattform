// Datei: src/pages/ProductPage.jsx
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kmbdieietszbfsbrldtx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttYmRpZWlldHN6YmZzYnJsZHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NTAyNjUsImV4cCI6MjA1"
);

export default function ProductPage() {
  const [input, setInput] = useState("");
  const [columns, setColumns] = useState({
    pool: [],
    kai: [],
    steffen: [],
    archiv: [],
  });

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select();
    if (!data) return;
    const cols = { pool: [], kai: [], steffen: [], archiv: [] };
    data.forEach((p) => {
      cols[p.category].push(p);
    });
    setColumns(cols);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const sanitizeAmazonUrl = (url) => {
    const match = url.match(/\/dp\/([\w\d]+)/);
    return match ? `https://www.amazon.de/dp/${match[1]}` : url;
  };

  const addProduct = async () => {
    if (!input) return;

    try {
      const cleanUrl = sanitizeAmazonUrl(input);
      const proxy = "https://api.allorigins.win/raw?url=";
      const htmlText = await fetch(`${proxy}${encodeURIComponent(cleanUrl)}`).then((res) => res.text());

      const doc = new DOMParser().parseFromString(htmlText, "text/html");

      const title =
        doc.querySelector("meta[property='og:title']")?.content ||
        doc.querySelector("title")?.innerText ||
        "Amazon Produkt";

      const image =
        doc.querySelector("meta[property='og:image']")?.content ||
        doc.querySelector("img")?.src ||
        "";

      if (!image || !title || !cleanUrl.includes("amazon.")) {
        alert("❌ Produktdetails konnten nicht vollständig geladen werden.");
        return;
      }

      const newProduct = {
        url: cleanUrl,
        title,
        image,
        category: "pool",
      };

      await supabase.from("products").insert(newProduct);
      fetchProducts();
      setInput("");
    } catch (err) {
      console.error(err);
      alert("❌ Produkt konnte nicht geladen werden.");
    }
  };

  const moveProduct = async (product, toCategory) => {
    if (product.category === toCategory) return;
    const updatedProduct = { ...product, category: toCategory };
    await supabase.from("products").update({ category: toCategory }).eq("url", product.url);
    fetchProducts();
  };

  const renderColumn = (title, key) => (
    <div className="bg-[#1f1f23] p-4 rounded-lg min-h-[300px]">
      <h3 className="text-lg text-[#9146FF] font-semibold mb-2">{title}</h3>
      <div className="space-y-4">
        {columns[key].map((product) => (
          <div key={product.url} className="bg-gray-900 p-3 rounded-lg">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
            )}
            <p className="text-sm text-white mb-2">{product.title}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <span key={n} className="text-xs bg-gray-700 px-2 py-1 rounded">
                  {n}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(columns).map(
                (cat) =>
                  cat !== key && (
                    <button
                      key={cat}
                      onClick={() => moveProduct(product, cat)}
                      className="bg-[#9146FF] px-2 py-1 rounded text-sm"
                    >
                      Zu {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
