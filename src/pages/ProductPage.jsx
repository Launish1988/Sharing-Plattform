const addProduct = async () => {
  if (!input) return;

  try {
    const cleanUrl = sanitizeAmazonUrl(input);
    const proxy = "https://api.allorigins.win/raw?url=";
    const encoded = encodeURIComponent(cleanUrl);
    const htmlText = await fetch(`${proxy}${encoded}`).then((res) => res.text());
    const doc = new DOMParser().parseFromString(htmlText, "text/html");

    const title =
      doc.querySelector("meta[property='og:title']")?.content ||
      doc.querySelector("title")?.innerText ||
      "Amazon Produkt";

    const image =
      doc.querySelector("meta[property='og:image']")?.content ||
      doc.querySelector("img")?.src ||
      "";

    // Prüfung verbessert:
    if (!image || !title || !cleanUrl.includes("amazon.")) {
      alert("❌ Produktdetails konnten nicht geladen werden.");
      return;
    }

    const newProduct = {
      url: cleanUrl,
      title,
      image,
      category: "pool",
    };

    await supabase.from("products").insert(newProduct);
    setColumns((prev) => ({ ...prev, pool: [newProduct, ...prev.pool] }));
    setInput("");
  } catch (err) {
    console.error(err);
    alert("❌ Produkt konnte nicht geladen werden.");
  }
};
