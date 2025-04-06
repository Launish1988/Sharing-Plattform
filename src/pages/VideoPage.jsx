const addVideo = () => {
  if (!input) return;
  const newVideo = {
    id: Date.now(),
    url: input,
  };
  setVideoColumns((prev) => ({
    ...prev,
    pool: [newVideo, ...prev.pool],
  }));
  setInput("");
};
