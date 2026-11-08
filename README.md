# Rx Clinical AI Agent — Egyptian Prescription Reader (Lite — No DDI)

تطبيق ويب يساعد الصياديين على قراءة روشتات الأطباء المكتوبة بخط اليد، ومطابقة الأدوية
بقاعدة بيانات الأدوية المصرية — كل ذلك على الموبايل، بدون سيرفر.

A mobile-first web app that reads handwritten Egyptian prescriptions with AI vision,
matches drugs against the Egyptian Drug Database (27,617+ drugs), and **learns from
pharmacist corrections**.

> **نسخة Lite:** تم إزالة فحص التداخلات الدوائية (DDI) والمراجعة السريرية بالكامل (AI + ruleset)
> لجعل القراءة أسرع ما يمكن. الـ pipeline الآن خطوتان فقط: OCR ← مطابقة قاعدة الأدوية.
>
> **مطابقة بدون اختراع:** لو الـ OCR مش متأكد من اسم دواء، التطبيق لا يخمّن اسمًا غير موجود —
> بل يعرض **أقرب 3 أدوية** من قاعدة بيانات مصر بالتشابه الإملائي (عربي/إنجليزي/مادة فعالة)
> لتختار منها بضغطة واحدة، وكل اختيار يعلّم ذاكرة التطبيق.

---

## ⚠️ تنبيه مهني | Professional Disclaimer

هذا التطبيق **أداة مساعدة للصيدلي وليس بديلاً عن المراجعة المهنية**.
كل مخرجات الذكاء الاصطناعي (أسماء الأدوية، الجرعات) **يجب التأكد منها يدويًا**
قبل صرف أي دواء. This is decision support, not a dispensing authority.

## ✨ Features | المميزات

- **📷 Handwriting OCR** — صوّر الروشتة بالكاميرا ويقرأها Gemini Vision فورًا
- **💊 Egyptian Drug DB match** — مطابقة مع قاعدة eg-drugs (27,617 دواء، عربي/إنجليزي/مادة فعالة)
- **🎯 Top-3 spelling candidates** — عند عدم التأكد من مطابقة دواء، يُعرض أقرب 3 أدوية من القاعدة المصرية مع نسبة التشابه لتختار بضغطة (بدون أسماء ملفّقة)
- **✂️ Visual Few-Shot Crop Bank** — احفظ قصاصات بصرية من خط كل دكتور وترسل للـ AI كمرجع (يحسن الدقة مع الوقت)
- **✅ Verify Rx + SFT Export** — علّم على الروشتات الصحيحة وصدّرها Dataset (JSONL) بصيغة Gemini Supervised Fine-Tuning
- **🧠 Learning memory** — كل تصحيح يعلّم الأداة خطوط دكاترتك
- **🔒 PIN lock** — قفل تلقائي بعد 5 دقائق خمول (SHA-256 — لا يُخزَّن نصًا صريحًا أبدًا)
- **💾 Backup/Restore** — JSON backup كامل (نقترح تشفيره قبل حفظه على Drive)
- **📴 PWA** — يعمل كتطبيق مثبت + Offline عبر Service Worker
- **📊 History** — آخر 50 روشتة، بحث، قراءة جماعية للـ unread

## 🚀 التشغيل على الموبايل (GitHub Pages)

1. اعمل fork أو repo جديد وارفع الملفات: `index.html` + `sw.js`
2. **Settings → Pages → Branch: main → Save**
3. بعد دقيقة افتح: `https://YOUR-USERNAME.github.io/YOUR-REPO/`
4. من Chrome على الموبايل: ⋮ → **Add to Home screen** ✅
5. افتح التطبيق ← الصق **Gemini API key** (خطوة واحدة، يُخزن على جهازك فقط)

### الحصول على مفتاح Gemini مجانًا
- افتح [aistudio.google.com/apikey](https://aistudio.google.com/apikey) ← Create API key
- المفتاح يبدأ بـ `AIza...` (أو `AQ...` لـ Vertex Express) ولا يغادر متصفحك أبدًا

## ⚡ السرعة | Speed tips

- من قائمة **Reading engine**:
  - **Auto** — الأفضل غالبًا (يكتشف الموديلات المتاحة لمشروعك ويجربها بالترتيب)
  - **3.5 Flash-Lite** — الأسرع
  - **3.8 Flash** — أعلى جودة قراءة
- ⚠️ موديلات `2.5` قد تكون مقيدة للمشاريع الجديدة — لو ظهر خطأ 404 للموديل، اختر 3.8 Flash أو Flash-Lite

## 🔒 الخصوصية | Privacy

- كل البيانات (روشتات، تصحيحات، قصاصات، PIN) في **localStorage على جهازك فقط**
- المفتاح لا يُرفع لأي سيرفر
- ⚠️ **ملاحظة مهمة:** صورة الروشتة نفسها تُرسل إلى Google Gemini API للقراءة، واستعلامات البحث عن الأدوية تُرسل إلى eg-drugs API. مفتاح Gemini المجاني **لا يغطي** اتفاقيات HIPAA/BAA — لا ترفع بيانات مرضى حساسة، وامسح الـ history قبل مشاركة الجهاز
- Backup التصدير يحتوي صور روشتات (قد تظهر بيانات مرضى) — **امسحه/شفّره قبل المشاركة**
- PIN قفل عابر: أي شخص يقدر يتخطاه بمسح بيانات الموقع من إعدادات المتصفح

## 📁 Dataset / Fine-Tuning

زر **Dataset (JSONL)** في تبويب History يصدّر:
1. روشتات كاملة (صورة + JSON مصحح، بلا بيانات مراجعة سريرية) بصيغة Gemini SFT الرسمية
2. قصاصات الخطوط البصرية
3. تصحيحات النصوص

## 🙏 Credits

- Drug data: [Egyptian Drug Database (eg-drugs)](https://github.com/mahmoudfalous/eg-drugs) by Mahmoud Mohamed — **CC BY 4.0**
- AI: Google Gemini API

## 📄 License

MIT (code). Drug data remains CC BY 4.0 of its author.
