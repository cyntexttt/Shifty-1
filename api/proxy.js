export default async function handler(req, res) {
  try {
    // 🔗 رابط Google Apps Script الخاص بالـ Sheet
    const scriptUrl = "https://script.google.com/macros/s/AKfycbwipkV06uuQpzTbikM3Lmz9XOVUvYhIbM3XmADOT1al6VQzkcJJ9EfHJ7yPyBw1mVz5UA/exec";

    // ✅ لو الطلب من نوع POST
    if (req.method === "POST") {
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });

      // 🧠 قراءة رد Google Script
      const text = await response.text();
      res.status(200).send(text);
    } 
    // ❌ لو حد استخدم طريقة غير POST
    else {
      res.status(405).json({ error: "Method Not Allowed" });
    }

  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({
      error: "Proxy request failed",
      details: error.message
    });
  }
}
