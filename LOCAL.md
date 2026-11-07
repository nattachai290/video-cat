# รันบนเครื่องตัวเอง (อัดเสียง · เลือกเทค · มิกซ์ · เรนเดอร์)

ทุกขั้นตอนใช้โปรแกรมฟรี ไม่ต้องใช้ Claude และไม่กิน token · ทดสอบแล้วบน Linux (เครื่อง cloud) ใช้กับ Mac / Windows (WSL) ได้

## ติดตั้งครั้งเดียว

ต้องมี: **Python 3.11+**, **Node.js 18+**, **ffmpeg**, **git** · พื้นที่ว่างประมาณ 5 GB (torch + โมเดลเสียง)

```bash
git clone https://github.com/nattachai290/video-cat.git
cd video-cat
git checkout ccr-34e6cfd1-0796w2          # หรือ main หลัง merge

python3 -m venv .venv
.venv/bin/pip install piper-tts chatterbox-tts faster-whisper librosa
#   Windows (WSL) / Linux ไม่มีการ์ดจอ: ติดตั้ง torch แบบ CPU ก่อนบรรทัดบน
#   .venv/bin/pip install torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cpu

npm install -g playwright
npx playwright install chromium
```

- **Mac (M1/M2/M3):** Chatterbox ใช้ GPU ของ Apple ให้อัตโนมัติ เร็วกว่าเครื่อง cloud ราว 5–10 เท่า
- **PC การ์ดจอ NVIDIA:** ติดตั้ง torch แบบ CUDA ตามเว็บ pytorch.org แล้วจะเร็วมาก
- **CPU อย่างเดียว:** ใช้ได้ แต่ช้า (ประมาณ 30 วินาทีต่อเทค)
- ครั้งแรกที่อัดเสียง ระบบจะโหลดโมเดล (~2–3 GB) อัตโนมัติ

ตรวจว่าติดตั้งครบ:

```bash
.venv/bin/python -c "import chatterbox, piper, faster_whisper; print('ok')"
ffmpeg -version | head -1
```

## ทำหนึ่งบท (ตัวอย่าง: เรื่องยาว 07 บทที่ 2)

เข้าโฟลเดอร์ของบทนั้นก่อน: บทที่ 1 อยู่ที่ `long/07-couch-kingdom`, บทที่ 2 ขึ้นไปอยู่ที่ `long/07-couch-kingdom/chN`

```bash
cd long/07-couch-kingdom/ch2
R=../../..                                  # ราก repo จากโฟลเดอร์บท (บทที่ 1 ใช้ R=../..)

# 1. อัดเสียง: ทุกประโยค 4 เทค (ใช้เวลานานที่สุด)
$R/.venv/bin/python $R/engine/voice.py --takes 4
#    อัดใหม่เฉพาะบางประโยค:  $R/.venv/bin/python $R/engine/voice.py --takes 4 d12 d18

# 2. เลือกเทค: วัดอารมณ์ + ถอดคำ ตัดเทคที่พูดผิด (ฟังเทียบได้ที่ out/voice/compare/)
$R/.venv/bin/python -I $R/engine/pick_takes.py
#    ถ้าขึ้น "!! no take of dXX": อัดประโยคนั้นใหม่ (ข้อ 1) แล้วรันข้อ 2 อีกรอบ
#    ไม่ชอบเทคที่เลือก: ก๊อปไฟล์ใน out/voice/takes/ ไปทับ out/voice/raw/<id>_<ตัวละคร>.wav

# 3. วางเสียงลงไทม์ไลน์ + ปากขยับ + ซับ
python3 $R/engine/timing.py                # บรรทัด OVER = ประโยคชนกัน (แจ้ง Claude ให้ขยับเวลา)
node $R/engine/dialog.mjs

# 4. เสียงประกอบ + เพลง + มิกซ์
node scripts/sfx.mjs
node scripts/music.mjs
node $R/engine/audio/mix.mjs               # ได้ out/audio/mix.wav (-14 LUFS)

# 5. เรนเดอร์วิดีโอ (ไม่กี่นาที)
NODE_PATH=$(npm root -g) node $R/engine/flat/render_pw.mjs --out=out/video.mp4 --audio=out/audio/mix.wav
```

ได้ไฟล์ `out/video.mp4` (1920x1080) พร้อมอัปโหลด · บทที่ 1 ใช้ชื่อ `out/ch1.mp4` ได้ตามสะดวก

## ดูภาพนิ่ง / เช็กก่อนเรนเดอร์

```bash
NODE_PATH=$(npm root -g) node $R/engine/flat/render_pw.mjs --sheet=10,30,60,90 --cols=4 --w=480 --out=out/check/sheet.jpg
node $R/engine/test/drycheck.mjs --times=10,30,60      # หา error ในโค้ดฉากโดยไม่ต้องเปิดเบราว์เซอร์
```

หรือเปิด `studio.html` ของบทนั้นในเบราว์เซอร์ แล้วลากแถบเวลาดูได้เลย (บางเบราว์เซอร์ต้องเปิดผ่าน local server เช่น `npx serve` จากราก repo)

## แบ่งงานกับ Claude

- **Claude:** คิดเรื่อง เขียนบท ออกแบบฉากและตัวละคร แก้มุก (แก้ไฟล์ใน `src/` และ `scripts/`)
- **เครื่องคุณ:** ข้อ 1–5 ข้างบน · หลังจาก Claude แก้โค้ด: `git pull` แล้วรันข้อ 4–5 ใหม่ (ถ้าเปลี่ยนบทพูด รันตั้งแต่ข้อ 1 เฉพาะประโยคที่เปลี่ยน)
- ไฟล์เสียงและวิดีโอไม่อยู่ใน git (ใหญ่) แต่ละเครื่องสร้างเองจากโค้ด
