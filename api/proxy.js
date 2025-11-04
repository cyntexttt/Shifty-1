// api/proxy.js
export default async function handler(req, res) {
  const API_URL = "https://script.google.com/macros/s/AKfycbwipkV06uuQpzTbikM3Lmz9XOVUvYhIbM3XmADOT1al6VQzkcJJ9EfHJ7yPyBw1mVz5UA/exec";

  try {
    const targetUrl = req.method === "GET"
      ? `${API_URL}?${new URLSearchParams(req.query).toString()}`
      : API_URL;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: error.message || "Proxy failed" });
  }
}
