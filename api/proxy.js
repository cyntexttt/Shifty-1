export default async function handler(req, res) {
  const API_URL = "https://script.google.com/macros/s/AKfycbzmkA-jeQW6YbBzzKROWZrtnJ7XzhlpMn3HpUG7vBXp18WgNLwnNJUP18XZ17gKk2SNpQ/exec";

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  try {
    const targetRes = await fetch(API_URL, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
    });

    const text = await targetRes.text();
    try {
      const data = JSON.parse(text);
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).json(data);
    } catch {
      console.error("Response not JSON:", text.substring(0, 200));
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).json({ ok: false, error: "Invalid JSON from Google Script" });
    }
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ ok: false, error: err.message });
  }
}
