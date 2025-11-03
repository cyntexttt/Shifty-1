# SHIFTY - تطبيق تبديل الشيفتات

## نظرة عامة
تطبيق ويب بسيط يساعد الموظفين على تبديل شيفتات العمل مع بعضهم البعض. يتيح للمستخدمين نشر طلبات التبديل والتواصل عبر واتساب.

## البنية
- `index.html` - الصفحة الرئيسية للتطبيق
- `style.css` - ملف التنسيقات
- `script.js` - الكود البرمجي للتطبيق (JavaScript)
- `server.py` - خادم ويب بسيط باستخدام Python

## الحالة الحالية
- ✅ الكود لا يحتوي على أخطاء برمجية
- ✅ التطبيق جاهز للتشغيل
- ✅ مشكلة CORS تم حلها
- التطبيق متصل بـ Google Apps Script API عبر Backend Proxy

## التغييرات الأخيرة
- 2025-11-03: فحص الكود والتأكد من عدم وجود أخطاء
- 2025-11-03: إضافة خادم Flask كـ Backend Proxy لحل مشكلة CORS
- 2025-11-03: تحديث script.js للاتصال بالـ Backend بدلاً من Google Apps Script مباشرة

## المعلومات التقنية
- اللغة: HTML, CSS, JavaScript
- الخادم: Flask (Python)
- المنفذ: 5000
- Dependencies: flask, flask-cors, requests

## كيف يعمل
1. المتصفح يرسل الطلبات إلى `/api/proxy`
2. Flask Backend يعيد توجيه الطلبات إلى Google Apps Script
3. Google Apps Script يتواصل مع Google Sheets
4. النتيجة تعود عبر Flask إلى المتصفح
