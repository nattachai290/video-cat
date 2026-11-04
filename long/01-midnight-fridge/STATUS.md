# STATUS · 01-midnight-fridge (YouTube แนวนอน 16:9, 200 วิ)

- [x] สตอรี่บอร์ด v1 (3 ส่วน × 60 วิ + End Screen 20 วิ) · **ผู้ใช้อนุมัติแล้ว** ("ให้ทำอันนี้")
- [x] step 1: เริ่มจาก `../_template` (studio.html, src, scripts) · title แก้แล้ว
- [x] step 2 (ส่วนบทพูด): `scripts/lines.json` 12 ประโยค จากตารางสตอรี่บอร์ด
- [x] step 2 (เสียง): 12 ประโยค Chatterbox · timing 0 flagged (แก้ `engine/timing.py` ให้อ่านเลขช็อตแบบ `1-2`, `E-1` ได้)
- [x] ส่วนที่ 1: props (ครัว ตู้เย็น เค้ก แผนสีเทียน ชุดสายลับ ไฟฉายหุ่นยนต์ โคม) + 6 ช็อต · drycheck 0 · ผู้ใช้ OK ภาพนิ่ง · จัดจังหวะฉากฝันให้ตรงเสียง "Step one... CAKE" · แก้ไฟฉายหุ่นยนต์ให้กวาดพื้น · เรนเดอร์ `out/part1.mp4` (60 วิ, ภาพ + เสียงพูด ยังไม่มี SFX/เพลง)
- [x] ส่วนที่ 2 v2 (เขียนใหม่ให้เร็ว): 10 ช็อต, เสียงพูดใหม่ 5 ประโยค (รวม 21, 0 flagged), SFX + เพลงส่วนที่ 2, มิกซ์ · ภาพนิ่ง `out/check/p2_stills.jpg` **รอผู้ใช้ OK ก่อนเรนเดอร์วิดีโอ**
- [ ] ส่วนที่ 3 + End Screen
- [ ] steps 7-9: SFX + เพลง + มิกซ์ + เรนเดอร์จริง + ปก 1280x720 + YOUTUBE.md + ENDSCREEN.md



- 2026-11-03 · ผู้ใช้ดู `out/part1.mp4` (v1) แล้วบอก **ยืด ดึงเวลา ไม่สนุก** → เขียนส่วนที่ 1 ใหม่เป็น v2 (มุกทุก 3–5 วิ, เพิ่ม 4 ประโยค) รอผู้ใช้อนุมัติ
- 2026-11-03 · ส่วนที่ 1 **v2** สร้างแล้ว: 9 ช็อต (มุกทุก 3–5 วิ), เสียงพูดใหม่ 4 ประโยค (รวม 16, 0 flagged), SFX + เพลงของส่วนที่ 1 (`scripts/sfx.mjs`, `scripts/music.mjs` 120 bpm), มิกซ์ · เรนเดอร์ `out/part1.mp4` ส่งผู้ใช้แล้ว
- 2026-11-03 · CLIMB ในฉากฝันเปลี่ยนเป็นยิงตะขอไต่เชือก (ผู้ใช้เลือก A) · ลองทำเวอร์ชัน Short แนวตั้ง + ตอนจบ 6 วิ แล้ว **ผู้ใช้ยกเลิก** (ไม่ทำ Short, ลบโค้ดออกแล้ว) · เรนเดอร์ `out/part1.mp4` ใหม่
- 2026-11-03 · ชุดสายลับแก้ (ผ้าคาดหัวนินจา + หนวด เป็นตัวเลือกใน rig ตามหน้าทุกมุม) · เรนเดอร์ใหม่ `out/part1.mp4` และ `out/part1_next.mp4` (มีป้าย NEXT: PART 2)

## 58-second version (user asked for 2 s shorter)
`out/part1_58.mp4` and `out/part1_next_58.mp4`: cut out 44.0-46.0 s (the start of shot 1-8, where the vacuum beam slowly sweeps
toward the plant; nothing new happens there). The cut is on a music bar line (120 bpm = 2 s per bar), with a 20 ms
audio crossfade, made with ffmpeg trim/concat from the 60 s files. Checked: 58.000 s, full decode with no errors, frames
around the cut and the ending. The NEXT: PART 2 badge now shows at 55.8-58.

## Vertical Short (1080x1920, 58 s): `out/short_58.mp4`
`short.html` + `src/vertical.js` draw the same 16:9 scenes through a moving crop window (zoom 1.35, 800 world px wide,
keyframes in `VKEYS`), with a night-sky title band on top ("THE MIDNIGHT FRIDGE" + PART 1), subtitles over the lower
picture (high up during the crayon fantasy), and the NEXT: PART 2 badge in the top band at the end. The long video is
untouched. Render: `render_pw.mjs --page=short.html --range=0:60 --audio=out/audio/mix.wav --out=out/short_v60.mp4`, then the
same 44-46 s ffmpeg cut as the 58 s 16:9 version. Sheets need `--crop=0,0,1080,1920`. Checked: 1080x1920, 58.000 s,
decodes with no errors, out/check/short_cuts.jpg.
