# STATUS · 07-royal-bed (YouTube Shorts)

- [x] สตอรี่บอร์ด (อนุมัติ; v2: Pip ดึงหางแทนพับกล่อง) · เสียงพูด 7 ประโยค 0 flagged · ปากขยับ + ซับ
- [x] ห้องนั่งเล่นของซีรีส์ + กล่องใหญ่ + เตียงหลวง + กล่องแครกเกอร์จิ๋ว (`src/props.js`), 7 ช็อต, ลูปตรงกับเฟรมแรก
- [x] SFX (`scripts/sfx.mjs`), เพลง (ซุกซน → แตรหรูล้อเลียน → เงียบ → กล่อมนอน → อิจฉา) 22 ห้อง = 50 s, มิกซ์ -14.7 LUFS
- [x] เรนเดอร์ `out/video.mp4` · ภาพปก `out/cover.png` · `YOUTUBE.md`

## สร้างใหม่ทั้งหมด (จาก stories/07-royal-bed)

```bash
node scripts/sfx.mjs && node scripts/music.mjs && node ../../engine/dialog.mjs && node ../../engine/audio/mix.mjs
NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --out=out/video.mp4 --audio=out/audio/mix.wav
```
