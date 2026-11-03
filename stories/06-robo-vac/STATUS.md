# STATUS · 06-robo-vac (YouTube Shorts)

- [x] สตอรี่บอร์ด (อนุมัติ) · เสียงพูด 7 ประโยค 0 flagged · ปากขยับ + ซับ
- [x] ห้องนั่งเล่น (จากตอน 04) + ผ้าม่าน + แท่นชาร์จ + หุ่นยนต์ดูดฝุ่น (`src/props.js`), 8 ช็อต, ลูปตรงกับเฟรมแรก
- [x] SFX (`scripts/sfx.mjs`), เพลง (หลับ → ย่อง → ไล่ → สปา) 22 ห้อง = 50 s, มิกซ์ -14.2 LUFS
- [x] เรนเดอร์ `out/video.mp4` · ภาพปก `out/cover.png` · `YOUTUBE.md`

## สร้างใหม่ทั้งหมด (จาก stories/06-robo-vac)

```bash
node scripts/sfx.mjs && node scripts/music.mjs && node ../../engine/dialog.mjs && node ../../engine/audio/mix.mjs
NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --out=out/video.mp4 --audio=out/audio/mix.wav
```
