import React from "react";

export default function Dashboard() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", color: "#9146FF" }}>🎮 Sharing Plattform – Twitch Style</h1>
      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
        Willkommen! Hier kannst du mit Freunden Inhalte teilen, bewerten und kommentieren.
      </p>

      <div style={{ marginTop: "3rem" }}>
        <button style={{
          backgroundColor: "#9146FF",
          color: "white",
          padding: "1rem 2rem",
          fontSize: "1rem",
          border: "none",
          borderRadius: "1rem",
          cursor: "pointer",
          margin: "0.5rem"
        }}>
          📺 Video-Bereich
        </button>

        <button style={{
          backgroundColor: "#2c2f33",
          color: "white",
          padding: "1rem 2rem",
          fontSize: "1rem",
          border: "none",
          borderRadius: "1rem",
          cursor: "pointer",
          margin: "0.5rem"
        }}>
          🛒 Produkt-Empfehlungen
        </button>
      </div>
    </div>
  );
}
