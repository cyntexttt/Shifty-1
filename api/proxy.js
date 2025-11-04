export default async function handler(req, res) {
  const targetURL = "https://script.google.com/macros/s/AKfycbwipkV06uuQpzTbikM3Lmz9XOVUvYhIbM3XmADOT1al6VQzkcJJ9EfHJ7yPyBw1mVz5UA/exec";

  try {
    const response = await fetch(targetURL, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined
    });

    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    try {
      const json = JSON.parse(text);
      res.status(200).json(json);
    } catch {
      res.status(200).send(text);
    }

  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
}
