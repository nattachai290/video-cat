# STATUS · long/07-couch-kingdom (16:9, ~15 นาที = 5 บท × 3 นาที)

- [x] เรื่องย่อ + โครงบท v1
- [x] v2: ตัดช่วงยืด (มอนทาจทบทวน, เดินทาง, ติดหนอง, ฉากซึ้งยาว) + เขียนบทพูดหลักทุกบทให้คุยกันสนุก · **รอผู้ใช้อนุมัติ**
- [x] สตอรี่ v2 · ผู้ใช้สั่งทำ model sheet ต่อ
- [x] model sheet v1: `src/cast.js` (Sir Lint, Queen Button, Oracle Cookie, Sock Troll, Dust Bunny, ผ้าคลุมถุงเท้า, Excalifork, เป้ Pip) + มงกุฎฝาขวดใน rig (`crown`, `slip`) · ชีต `out/check/lineup|sheetA|sheetB|sheetC|kitViews.png` · **รอผู้ใช้อนุมัติ**
- [ ] บทที่ 1–5: ตารางช็อต → เสียง → ภาพนิ่ง → เรนเดอร์ (ทีละบท)
- [ ] ต่อเป็นเรื่องเต็ม 15 นาที + End Screen + ปก + YOUTUBE.md
- [x] รูปแบบ: คลิปละบท (อินโทร 5 วิ `introTitles` + บท 3 นาที + End Screen 20 วิ `chapterEnd` ที่ชี้ไปบทถัดไป) · ผู้ใช้เลือก
- [x] บทที่ 1: ฉาก (โซฟา, ใต้โซฟา, สไลเดอร์, เมือง, หน้าวัง, ท้องพระโรง, ประตูเมือง) + 11 ช็อต + มุกเสริมช่วงยืด · ภาพนิ่ง/สตอรี่บอร์ดส่งผู้ใช้แล้ว
- [x] บทที่ 1: เสียงพูด 33 ประโยค ("Who comes?" เปลี่ยนเป็น "Wait... who comes?" เพราะทุกเทคพูดเพี้ยน) + SFX + เพลง · มิกซ์ -14.6 LUFS · `out/ch1.mp4` 1920x1080 3:25 + `YOUTUBE_CH1.md`
- [x] บทที่ 2 v4.2 (ผู้ใช้ OK): ส้อมอยู่ตลอด, เผยหน้าถุงเท้าตอนคืนผ้าคลุม, close-up ท้อง, ช่องว่างก่อนกระโดด, ฟองเล็กหลังป๊อป · v4.1 (ผู้ใช้ OK storyboard): ch2/STORYBOARD.md, ch2/src/scenes/shots.js เขียนใหม่ทั้งหมด (เวลาในไฟล์ = เวลาคลิป), บทพูด 47 ประโยค, SFX/เพลงจัดเวลาใหม่, ท่าเดินข้าง 2 ขา, ผ้าคลุมแบบเสื้อคลุม, เท้าเป็นชิ้นเดียว, หู Pip ด้านข้างใหม่. ยังไม่ได้อัดเสียง/เรนเดอร์: ผู้ใช้รันเองด้วย windows\2-make-chapter.bat (บท 2 โหมด 1). ch2/YOUTUBE_CH2.md
- [x] บทที่ 3 model sheet v1: `ch3/src/cast3.js` (Moth, royalSeal/royalScroll, โล่แหว่ง, หอก+เชือกผม, ถุงแครกเกอร์, ไฟ LED, สะพานเยลลี่, ฟองซ่า, ไฟแดงไกล, คราบโซดา Pumpkin) + `ch3/src/sheets3.js` · ชีต `ch3/out/check/ch3_sheetMoth|sheetHeroes|sheetPropsA|sheetPropsB|lineup3.png` · เรนเดอร์ใหม่: `cd long/07-couch-kingdom/ch3` แล้ว `NODE_PATH=$(npm root -g) node ../../../engine/flat/render_pw.mjs --loop=<ชื่อ> --still=0.4 --out=out/check/ch3_<ชื่อ>.png` · **รอผู้ใช้อนุมัติ**
- [ ] บทที่ 3: The Fizzy Swamp (ผู้ใช้อยากลองรันเองบนเครื่อง Windows NVIDIA: `windows/*.bat`)
- [x] บทที่ 3–5 storyboard v3.3 (v3.0 ของผู้ใช้ + รีวิวหลายรอบ + ตราราชสำนักใน STORYBOARD.md): `ch3/STORYBOARD.md` 3:10 · `ch4/STORYBOARD.md` 3:20 · `ch5/STORYBOARD.md` 3:55 (ผู้ใช้อนุญาตให้ยาวเกิน 3 นาที) · **รอผู้ใช้อนุมัติ** · ตัวใหม่: Moth · ยังไม่มีโค้ด/เสียง
