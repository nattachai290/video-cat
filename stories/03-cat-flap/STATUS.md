# STATUS · 03-cat-flap (YouTube Shorts)

- [x] สตอรี่บอร์ด v1 (`STORYBOARD.md`) แนวตั้ง 1080×1920, 52 s, วนลูปได้
- [x] บทพูด `scripts/lines.json` (10 ช่วง พร้อมอารมณ์) + `scripts/cast.json`
- [x] เอนจินรองรับจอตั้ง (`PROJECT.w/h` ใน `src/config.js`)
- [ ] ผู้ใช้อนุมัติสตอรี่บอร์ด
- [ ] Haiku: งาน `voices 03-cat-flap` ใน RUNBOOK.md แล้วเช็กเวลา
- [x] ริก Pumpkin & Pip (`engine/cast/pumpkin_pip.js`) + model sheet (`engine/cast/sheet.js`), drycheck ผ่าน
- [x] เปลี่ยนเป็นสไตล์การ์ตูนแบน (`engine/flat/`) แขนทรงถั่ว (D) ตรวจ model sheet แล้ว (`out/check/cast.jpg`, `faces_*.jpg`) ~50–110 ms/เฟรม
- [x] ฉาก + พร็อพ (`src/props.js`) และ 12 ช็อต (`src/scenes/shots.js`) ตรวจ contact sheet + motion แล้ว, เรนเดอร์ทั้งคลิปได้ใน ~2 นาที (`engine/flat/render_pw.mjs`)
- [x] SFX (`scripts/sfx.mjs`), ดนตรีลูป 24 ห้อง = 52 s (`scripts/music.mjs`), มิกซ์ -14 LUFS (`engine/audio/mix.mjs`)
- [x] ซับไตเติลอังกฤษแบบคาราโอเกะ สีตามคนพูด (`src/subs.js`)
- [x] เรนเดอร์ตัวจริง `out/video.mp4` (1080×1920, 52 s, มีเสียง) ใช้เวลา ~46 วินาที

## สร้างใหม่ทั้งหมด (จาก stories/03-cat-flap)

```bash
node scripts/sfx.mjs
node scripts/music.mjs
node ../../engine/dialog.mjs
node ../../engine/audio/mix.mjs
NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --out=out/video.mp4 --audio=out/audio/mix.wav
```
