// Datei: src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import VideoPage from "./pages/VideoPage";
import ProductPage from "./pages/ProductPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/videos" element={<VideoPage />} />
        <Route path="/produkte" element={<ProductPage />} />
      </Routes>
    </Router>
  );
}
