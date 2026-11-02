# video-cat

แอนิเมชันสั้นวาดด้วยโค้ด (p5.brush สไตล์สีน้ำ/กวอช เรนเดอร์ด้วย Chrome แบบ headless) ทุกเฟรม ทุกเสียง และดนตรีสร้างจากโค้ด
ใช้วิธีเดียวกับ [Kreycin/ton-sea](https://github.com/Kreycin/ton-sea) บนฐาน [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)

## โครงสร้าง

แต่ละเรื่องอยู่ในโฟลเดอร์ของตัวเองใต้ `stories/` ส่วนเอนจินที่ใช้ร่วมกันจะอยู่ที่ `engine/` (ยังไม่ได้ติดตั้ง)

```
video-cat/
├── engine/                  # เอนจินร่วม: core.js, timeline.js, render.mjs ฯลฯ (มาจาก ClaudeAnimationBase)
└── stories/
    └── 01-moji-letter/      # เรื่องที่ 1: "จดหมายถึงคนที่ให้ข้าวแมวเทา"
        ├── STORYBOARD.md
        ├── STATUS.md
        ├── studio.html      # (ภายหลัง) เปิดดู/สครับวิดีโอของเรื่องนี้
        ├── src/             # (ภายหลัง) ตัวละคร ฉาก บทพูด
        ├── scripts/         # (ภายหลัง) เสียงพูด SFX ดนตรี มิกซ์
        └── out/             # (ภายหลัง) เฟรม เสียง วิดีโอ (ไม่ commit ไฟล์ใหญ่)
```

เพิ่มเรื่องใหม่: สร้าง `stories/NN-ชื่อเรื่อง/` แล้วเริ่มจาก `STORYBOARD.md`

## เรื่องทั้งหมด

| # | เรื่อง | ความยาว | สถานะ |
|---|---|---|---|
| 01 | [จดหมายถึงคนที่ให้ข้าวแมวเทา · The Letter for Moji](stories/01-moji-letter/STORYBOARD.md) | ~3:25 | สตอรี่บอร์ด v1 รออนุมัติ |
