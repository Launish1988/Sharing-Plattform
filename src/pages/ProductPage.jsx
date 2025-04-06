// Datei: src/pages/ProductPage.jsx
import React, { useState } from "react";
import RatingStars from "../components/RatingStars";
import TagSelector from "../components/TagSelector";
import CategorySelect from "../components/CategorySelect";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState("");
  const [rating, setRating] = useState(0);
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("");

  const addProduct = () => {
    if (!newProduct) return;

    const product = {
      id: Date.now(),
      name: newProduct,
      rating,
      tag,
      category,
    };

    setProducts([product, ...products]);
    setNewProduct("");
    setRating(0);
    setTag("");
    setCategory("");
  };

  const archiveProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-6">
      <h2 className="text-3xl font-bold text-[#9146FF] mb-6">🛍️ Produkt-Empfehlungen</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
          placeholder="Produktname"
          className="flex-1 px-4 py-2 rounded bg-gray-800 text-white"
        />
        <CategorySelect selected={category} setSelected={setCategory} />
        <TagSelector selected={tag} setSelected={setTag} />
        <RatingStars value={rating} onChange={setRating} />
        <button
          onClick={addProduct}
          className="bg-[#9146FF] px-4 py-2 rounded hover:bg-[#772ce8]"
        >
          Hinzufügen
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-900 p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <p className="text-xl font-semibold">{product.name}</p>
              <p className="text-sm text-gray-400">
                Kategorie: {product.category || "Keine"} | Tag: {product.tag || "Keiner"} | Bewertung: {product.rating}/10
              </p>
            </div>
            <button
              onClick={() => archiveProduct(product.id)}
              className="text-red-400 hover:underline text-sm"
            >
              Archivieren
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
