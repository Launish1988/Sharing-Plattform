import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase Konfiguration
const supabase = createClient(
  "https://kmbdieietszbfsbrldtx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttYmRpZWlldHN6YmZzYnJsZHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NTAyNjUsImV4cCI6MjA1OTUyNjI2NX0.6rE3pv0aA7Qp_UhJ-0QDzJp3E7Z_Bf_WJmoAMXXqLpo"
);

export default function VideoPage() {
  const [input, setInput] = useState("");
  const [columns, setColumns] = useState({
    pool: [],
    kai: [],
    steffen: [],
    archiv: [],
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase.from("videos").select();
    if (error) {
      console.error("❌ Fehler beim Laden der Videos:", error);
      return;
    }

    const cols = { pool: [], kai: [], steffen: [], archiv: [] };
    data.forEach((v) => {
      if (cols[v.category]) {
        cols[v.category].push(v);
      }
    });
    setColumns(cols);
  };

  const extractYouTubeId = (url) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtu.be")) {
        return parsed.pathname.slice(1);
      } else if (parsed.hostname.includes("youtube.com")) {
        return parsed.searchParams.get("v");
      }
    } catch (err) {
      console.error("❌ Fehler beim Parsen:", err);
      return null;
    }
  };

  const fetchTitle = async (url) => {
    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      return json.title || "YouTube Video";
    } catch {
      return "YouTube Video";
    }
  };

  const addVideo = async () => {
    const video
