import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import VideoPage from "./pages/VideoPage";
import ProductPage from "./pages/ProductPage";

function App() {
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

export default App;
