# STATUS · 01-midnight-fridge (YouTube แนวนอน 16:9, 200 วิ)

- [x] สตอรี่บอร์ด v1 (3 ส่วน × 60 วิ + End Screen 20 วิ) · **ผู้ใช้อนุมัติแล้ว** ("ให้ทำอันนี้")
- [x] step 1: เริ่มจาก `../_template` (studio.html, src, scripts) · title แก้แล้ว
- [x] step 2 (ส่วนบทพูด): `scripts/lines.json` 12 ประโยค จากตารางสตอรี่บอร์ด
- [ ] step 2 (เสียง): **ติดขัด** — `huggingface.co` ถูก proxy ปฏิเสธ (403/ไม่ตอบ) ทั้ง Piper voice ต้นแบบและน้ำหนัก Chatterbox ต้องโหลดจากที่นั่น ไม่มีเอนจิน TTS ในเครื่อง ยังไม่ได้รัน voice.py / timing.py / dialog.mjs
- [ ] ส่วนที่ 1 · [ ] ส่วนที่ 2 · [ ] ส่วนที่ 3 + End Screen (ยังไม่เริ่ม: ต้องรู้ความยาวเสียงก่อนจัดจังหวะ)
- [ ] steps 7-9: SFX + เพลง + มิกซ์ + เรนเดอร์จริง + ปก 1280x720 + YOUTUBE.md + ENDSCREEN.md

**ที่ต้องทำต่อ:** เปิดการเข้าถึง `huggingface.co` ให้ session นี้ หรือวางไฟล์ Piper voice (`en_GB-alan-medium`, `en_US-amy-medium`, `en_GB-northern_english_male-medium`) ไว้ที่ `out/voice-models/` และ Chatterbox ใน `.venv` แล้วสั่ง `steps 1-2 (voices)` ต่อ
