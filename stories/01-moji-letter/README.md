# 01 · จดหมายถึงคนที่ให้ข้าวแมวเทา (The Letter for Moji)

สตอรี่บอร์ด: [STORYBOARD.md](STORYBOARD.md) · ความคืบหน้า: [STATUS.md](STATUS.md)

รันทุกคำสั่งจากโฟลเดอร์นี้ (ต้อง `npm install` ที่ root ก่อน)

## ดูวิดีโอ

เปิด `studio.html` ใน Chrome แล้วลากแถบเวลาเพื่อสครับ

## เสียงพูด (Piper TTS ทำงานในเครื่อง ไม่ต้องมีบัญชีคลาวด์)

```bash
pip install piper-tts
python3 scripts/voice.py              # 18 ประโยค -> out/voice/raw/*.wav
python3 scripts/voice.py d09          # ทำใหม่เฉพาะบางประโยค
```

บทพูดอยู่ใน `scripts/lines.json` ส่วนเสียงของแต่ละตัวละครตั้งไว้ใน `CAST` ของ `scripts/voice.py`

## ภาพตรวจงาน

```bash
node ../../engine/render.mjs --sheet=1,5,9 --cols=3 --w=480 --out=out/check/test.jpg
```

ส่งไฟล์ใน `out/check/` กลับมาให้ Claude ดูได้ (commit เข้า branch หรือแนบในแชท)
