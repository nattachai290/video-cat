# STATUS · 03-cat-flap (YouTube Shorts)

- [x] สตอรี่บอร์ด v1 (`STORYBOARD.md`) แนวตั้ง 1080×1920, 52 s, วนลูปได้
- [x] บทพูด `scripts/lines.json` (10 ช่วง พร้อมอารมณ์) + `scripts/cast.json`
- [x] เอนจินรองรับจอตั้ง (`PROJECT.w/h` ใน `src/config.js`)
- [ ] ผู้ใช้อนุมัติสตอรี่บอร์ด
- [ ] Haiku: งาน `voices 03-cat-flap` ใน RUNBOOK.md แล้วเช็กเวลา
- [x] ริก Pumpkin & Pip (`engine/cast/pumpkin_pip.js`) + model sheet (`engine/cast/sheet.js`), drycheck ผ่าน
- [x] เปลี่ยนเป็นสไตล์การ์ตูนแบน (`engine/flat/`) แขนทรงถั่ว (D) ตรวจ model sheet แล้ว (`out/check/cast.jpg`, `faces_*.jpg`) ~50–110 ms/เฟรม
- [x] ฉาก + พร็อพ (`src/props.js`) และ 12 ช็อต (`src/scenes/shots.js`) ตรวจ contact sheet + motion แล้ว, เรนเดอร์ทั้งคลิปได้ใน ~2 นาที (`engine/flat/render_pw.mjs`)
- [ ] SFX + ดนตรีลูป + มิกซ์
- [ ] ซับไตเติลอังกฤษ (บนกลางจอ)
- [ ] เรนเดอร์ตัวจริง
