// script.js
const API_URL = "https://script.google.com/macros/s/AKfycbwipkV06uuQpzTbikM3Lmz9XOVUvYhIbM3XmADOT1al6VQzkcJJ9EfHJ7yPyBw1mVz5UA/exec";

async function postData(payload) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const text = await res.text();

    try {
      const json = JSON.parse(text);
      return json;
    } catch (err) {
      console.error("Response not JSON:", text.substring(0, 200));
      throw new Error("Server returned non-JSON response");
    }
  } catch (err) {
    throw err;
  }
}

async function getOpenRequests() {
  try {
    const res = await fetch(API_URL + "?action=getOpenRequests", { method: "GET" });
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      return json.data || [];
    } catch {
      console.error("Response not JSON:", text.substring(0, 200));
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
}

// لما المستخدم يملأ الفورم
document.getElementById("swapForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    action: "add",
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    department: form.department.value.trim(),
    current_shift: form.current_shift.value.trim(),
    wanted_shift: form.wanted_shift.value.trim()
  };
  try {
    const res = await postData(data);
    if (res && res.ok) {
      alert("✅ تم نشر الطلب بنجاح");
      form.reset();
      loadRequests();
    } else {
      alert("❌ فشل الحفظ: " + (res && res.error ? res.error : "unknown"));
    }
  } catch (err) {
    alert("⚠️ خطأ في الاتصال: " + err.message);
  }
});

// تحميل الطلبات الموجودة
async function loadRequests() {
  const list = document.getElementById("list");
  list.innerHTML = "جاري التحميل...";
  const rows = await getOpenRequests();
  if (!rows.length) {
    list.innerHTML = "<p>لا توجد طلبات حالياً</p>";
    return;
  }
  list.innerHTML = rows.map(r => `
    <div class="card">
      <div><strong>${r.name}</strong> — ${r.current_shift} → ${r.wanted_shift}</div>
      <div>واتساب: 
        <a target="_blank" href="https://wa.me/${r.phone.replace(/\D/g,'')}?text=${encodeURIComponent('مرحبًا، رأيت طلبك على موقع تبديل الشيفت وأرغب بالمبادلة')}" style="color:#007bff">${r.phone}</a>
      </div>
      <div><button class="confirm" data-id="${r.id}" style="background:#4caf50;color:white;border:none;padding:6px 10px;border-radius:6px;">تم التبديل</button></div>
    </div>
  `).join("");

  document.querySelectorAll(".confirm").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("هل أنت متأكد من تأكيد التبديل؟")) return;
      try {
        const res = await postData({ action: "complete", id });
        if (res && res.ok) {
          alert("✅ تم تأكيد التبديل");
          loadRequests();
        } else {
          alert("❌ فشل التأكيد");
        }
      } catch (err) {
        alert("⚠️ خطأ في الاتصال: " + err.message);
      }
    });
  });
}

loadRequests();
