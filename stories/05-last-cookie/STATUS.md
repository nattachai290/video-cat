# STATUS · 05-last-cookie (YouTube Shorts)

- [x] สตอรี่บอร์ด (อนุมัติ) · เสียงพูด 7 ประโยค (ปรับ d05 ให้พอดีช็อต) · ปากขยับ + ซับ
- [x] ครัว + โหลคุกกี้ + ของต่อหอ (`src/props.js`), 8 ช็อต (`src/scenes/shots.js`), ลูปตรงกับเฟรมแรก
- [x] SFX (`scripts/sfx.mjs`), เพลงสายลับย่อง ๆ 22 ห้อง = 50 s (`scripts/music.mjs`), มิกซ์ -14.3 LUFS
- [x] เรนเดอร์ `out/video.mp4` (1080×1920, 50 s) · ภาพปก `out/cover.png` · `YOUTUBE.md`

## สร้างใหม่ทั้งหมด (จาก stories/05-last-cookie)

```bash
node scripts/sfx.mjs && node scripts/music.mjs && node ../../engine/dialog.mjs && node ../../engine/audio/mix.mjs
NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --out=out/video.mp4 --audio=out/audio/mix.wav
```
