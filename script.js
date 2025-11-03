// -----------------------------------------------------------------
// Backend API URL (يستخدم الخادم المحلي كوسيط)
// -----------------------------------------------------------------
const API_URL = '/api/proxy'
// -----------------------------------------------------------------


const form = document.getElementById('swapForm');
const submitButton = document.getElementById('submitButton');
const listContainer = document.getElementById('requestsList');
const loadingMessage = document.getElementById('loadingMessage');

// ----- (1) دالة إرسال طلب جديد -----
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // نمنع الفورم من التحميل
  
  // بنقفل الزرار عشان محدش يدوس مرتين
  submitButton.disabled = true;
  submitButton.textContent = 'جاري النشر...';

  // بنلم البيانات من الفورم
  const formData = new FormData(form);
  const data = {
    id: crypto.randomUUID(), // بنعمل ID عشوائي
    name: formData.get('name').trim(),
    phone: formData.get('phone').trim(),
    department: formData.get('department').trim(),
    current_shift: formData.get('current_shift').trim(),
    wanted_shift: formData.get('wanted_shift').trim()
  };

  // بنبعت البيانات لـ Google Apps Script
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createNewRequest',
        data: data
      })
    });

    const json = await res.json();

    if (json.ok) {
      alert('تم نشر طلبك بنجاح!');
      form.reset(); // نفضي الفورم
      loadRequests(); // نعيد تحميل القائمة
    } else {
      throw new Error(json.error || 'حدث خطأ غير معروف');
    }

  } catch (err) {
    alert('فشل نشر الطلب: ' + err.message);
  } finally {
    // بنرجع الزرار لوضعه الطبيعي
    submitButton.disabled = false;
    submitButton.textContent = 'نشر الطلب';
  }
});

// ----- (2) دالة تحميل كل الطلبات المفتوحة -----
async function loadRequests() {
  listContainer.innerHTML = ''; // نفضي القائمة القديمة
  loadingMessage.style.display = 'block'; // نظهر رسالة "جاري التحميل"

  try {
    // بنكلم الـ API ونقوله عايزين الطلبات المفتوحة
    const res = await fetch(API_URL + '?action=getOpenRequests');
    const json = await res.json();

    if (!json.ok) throw new Error(json.error);

    const requests = json.data;

    if (requests.length === 0) {
      loadingMessage.textContent = 'لا توجد طلبات مفتوحة حالياً. كن أول واحد!';
      return;
    }

    // بنعرض الطلبات واحد واحد
    requests.forEach(req => {
      const card = document.createElement('div');
      card.className = 'request-card';
      
      // بنعمل كود الـ HTML لكل كارت
      card.innerHTML = `
        <h3>${req.name} (${req.department || 'قسم غير محدد'})</h3>
        <p><strong>عايز يبدل:</strong> ${req.current_shift}</p>
        <p><strong>مقابل:</strong> ${req.wanted_shift}</p>
        <div class="card-actions">
          <a href="https://wa.me/${req.phone}?text=${encodeURIComponent(`مرحباً ${req.name}، أنا شفت طلبك على SHIFTY وعايز أبدل معاك شيفت ${req.current_shift}`)}" 
             target="_blank" class="button whatsapp-button">
             تواصل واتساب
          </a>
          <button class="button confirm-button" data-id="${req.id}">
             تم التبديل (اضغط هنا للإنهاء)
          </button>
        </div>
      `;
      listContainer.appendChild(card);
    });

    loadingMessage.style.display = 'none'; // نخفي رسالة التحميل

  } catch (err) {
    loadingMessage.textContent = 'فشل تحميل الطلبات. حاول مرة أخرى. ' + err.message;
  }
}

// ----- (3) دالة تأكيد التبديل (لما حد يدوس "تم التبديل") -----
listContainer.addEventListener('click', async (e) => {
  // بنتأكد إن المستخدم داس على زرار "تم التبديل"
  if (e.target.classList.contains('confirm-button')) {
    
    if (!confirm('هل أنت متأكد أنك أتممت هذا التبديل؟ سيتم حذف الطلب.')) {
      return; // لو داس "Cancel"
    }

    const button = e.target;
    const requestId = button.dataset.id;
    button.disabled = true;
    button.textContent = 'جاري الحذف...';

    try {
      // بنبعت للـ API نقوله احذف الطلب ده
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'completeRequest',
          data: { id: requestId, matchedBy: 'user' }
        })
      });
      
      const json = await res.json();
      if (json.ok) {
        alert('تم التبديل بنجاح! سيتم حذف الطلب من القائمة.');
        loadRequests(); // نعيد تحميل القائمة (عشان الطلب يختفي)
      } else {
        throw new Error(json.error || 'لم يتم العثور على الطلب');
      }

    } catch (err) {
      alert('فشل تحديث الطلب: ' + err.message);
      button.disabled = false;
      button.textContent = 'تم التبديل (اضغط هنا للإنهاء)';
    }
  }
});


// ----- (4) أول ما الصفحة تفتح، حمّل الطلبات -----
loadRequests();

