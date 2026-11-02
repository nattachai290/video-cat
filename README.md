# video-cat

แอนิเมชันสั้นวาดด้วยโค้ด (p5.brush สไตล์สีน้ำ/กวอช เรนเดอร์ด้วย Chrome แบบ headless) ทุกเฟรม ทุกเสียง และดนตรีสร้างจากโค้ด
ใช้วิธีเดียวกับ [Kreycin/ton-sea](https://github.com/Kreycin/ton-sea) บนฐาน [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)

## โครงสร้าง

แต่ละเรื่องอยู่ในโฟลเดอร์ของตัวเองใต้ `stories/` ส่วนเอนจินที่ใช้ร่วมกันอยู่ที่ `engine/` (คัดลอกจาก ClaudeAnimationBase, MIT)

```
video-cat/
├── package.json             # p5, p5.brush, puppeteer-core (ติดตั้งครั้งเดียวที่ root)
├── engine/                  # เอนจินร่วม: core.js, timeline.js, render.mjs, voice.py, timing.py, ANIMATION_GUIDE.md
└── stories/
    ├── 03-cat-flap/         # เรื่องที่ 3: YouTube Shorts แนวตั้ง
    ├── 02-moon-cat/         # เรื่องที่ 2: "แมวขายดวงจันทร์" (นิทาน)
    └── 01-moji-letter/      # เรื่องที่ 1: "จดหมายถึงคนที่ให้ข้าวแมวเทา"
        ├── STORYBOARD.md
        ├── STATUS.md
        ├── studio.html      # เปิดใน Chrome เพื่อดู/สครับวิดีโอของเรื่องนี้
        ├── src/             # config.js, (ภายหลัง) ตัวละคร ฉาก
        ├── scripts/         # lines.json + cast.json (บทพูดและเสียงตัวละคร), (ภายหลัง) SFX ดนตรี มิกซ์
        └── out/             # (ภายหลัง) เฟรม เสียง วิดีโอ (ไม่ commit ไฟล์ใหญ่)
```

เพิ่มเรื่องใหม่: สร้าง `stories/NN-ชื่อเรื่อง/` แล้วเริ่มจาก `STORYBOARD.md`

## เรื่องทั้งหมด

| # | เรื่อง | ความยาว | สถานะ |
|---|---|---|---|
| 01 | [จดหมายถึงคนที่ให้ข้าวแมวเทา · The Letter for Moji](stories/01-moji-letter/STORYBOARD.md) | ~3:25 | พักไว้ (เนื้อเรื่องยังไม่โดน) |
| 02 | [แมวขายดวงจันทร์ · The Cat Who Sold the Moon](stories/02-moon-cat/STORYBOARD.md) | ~3:36 | พักไว้ (เสียงพูดเสร็จแล้ว) |
| 03 | [Pumpkin & Pip: The Cat Flap · พัมป์กินติดประตูแมว](stories/03-cat-flap/STORYBOARD.md) | 0:52 Shorts 9:16 | สตอรี่บอร์ด v1 รออนุมัติ |

## ติดตั้งและรัน (บนเครื่องของคุณ)

ขั้นตอนรันทุกงาน พร้อมพรอมต์ให้โมเดลเล็ก (Haiku) รันแทน อยู่ใน [RUNBOOK.md](RUNBOOK.md)


ต้องมี Node 20+, Google Chrome, ffmpeg และ Python 3

```bash
npm install                              # ที่ root ครั้งเดียว ทุกเรื่องใช้ร่วมกัน
```

ทุกคำสั่งด้านล่างรันจากโฟลเดอร์ของเรื่อง เช่น `cd stories/01-moji-letter`

```bash
node ../../engine/render.mjs --sheet=1,5,9 --cols=3 --w=480 --out=out/check/test.jpg   # ทดสอบว่าเรนเดอร์ได้
```

- ถ้าเป็น Linux ที่ไม่มี GPU ให้เติม `--soft-gl`
- ถ้าหา Chrome ไม่เจอ ให้เติม `--chrome=<path>`
- ตอนยังไม่มีฉาก ภาพทดสอบจะเป็นตัวละคร Clawd ของชุดเครื่องมือ ถ้าเห็นภาพนี้แปลว่าเอนจินใช้ได้
