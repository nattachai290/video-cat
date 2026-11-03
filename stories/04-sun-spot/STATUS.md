# STATUS · 04-sun-spot (YouTube Shorts)

- [x] สตอรี่บอร์ด (ผู้ใช้อนุมัติ)
- [x] เสียงพูด 8 ประโยค (Chatterbox) timing 0 flagged, ปากขยับ + ซับ
- [x] ฉากห้องนั่งเล่น + จุดแดด (`src/props.js`), 8 ช็อต (`src/scenes/shots.js`), ลูปตรงกับเฟรมแรก
- [x] SFX (`scripts/sfx.mjs`), เพลงกล่อมนอน 22 ห้อง = 50 s (`scripts/music.mjs`), มิกซ์ -14.1 LUFS
- [x] เรนเดอร์ตัวจริง `out/video.mp4` (1080×1920, 50 s) · ภาพปก `out/cover.png` · `YOUTUBE.md`

## สร้างใหม่ทั้งหมด (จาก stories/04-sun-spot)

```bash
node scripts/sfx.mjs
node scripts/music.mjs
node ../../engine/dialog.mjs
node ../../engine/audio/mix.mjs
NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --out=out/video.mp4 --audio=out/audio/mix.wav
```
