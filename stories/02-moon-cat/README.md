# 02 · The Cat Who Sold the Moon (แมวขายดวงจันทร์)

นิทานแต่งใหม่ ตัวละครพูดภาษาอังกฤษ ไม่มีคนเล่า

สตอรี่บอร์ด: [STORYBOARD.md](STORYBOARD.md) · ความคืบหน้า: [STATUS.md](STATUS.md)

รันทุกคำสั่งจากโฟลเดอร์นี้ (ต้อง `npm install` ที่ root ก่อน)

```bash
pip install piper-tts
python3 ../../engine/voice.py          # 26 ช่วงพูด -> out/voice/raw/*.wav
python3 ../../engine/voice.py d07 d20  # ทำใหม่เฉพาะบางประโยค
python3 ../../engine/timing.py         # เช็กว่าทุกประโยคพูดจบทันในช็อตของมัน
node ../../engine/render.mjs --sheet=1,5,9 --cols=3 --w=480 --out=out/check/test.jpg
```

เปิด `studio.html` ใน Chrome เพื่อสครับดูวิดีโอ
