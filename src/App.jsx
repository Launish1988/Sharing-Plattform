import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import VideoPage from "./pages/VideoPage";

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="flex gap-4 mb-4">
          <Link to="/" className="font-bold">Dashboard</Link>
          <Link to="/videos">Videos</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/videos" element={<VideoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
