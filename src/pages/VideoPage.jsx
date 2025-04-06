import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kmbdieietszbfsbrldtx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
    console.log("🎥 Videos geladen:", data);

    const cols = { pool: [], kai: [], steffen: [], archiv: [] };
    data.forEach((v) => {
      if (cols[v.category]) {
        cols[v.category].push(v);
      }
    });
    setColumns(cols);
  };

  const extractYouTubeId = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v
