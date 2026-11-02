# RUNBOOK: คำสั่งสำหรับรัน (ให้โมเดลเล็กอย่าง Haiku ทำตาม)

ไฟล์นี้แยก "การคิด/เขียนโค้ด" ออกจาก "การรัน" งานคิดทำในเซสชันหลัก ส่วนการรันให้เปิดเซสชันใหม่ด้วยโมเดลที่ถูกกว่า
แล้ววางพรอมต์ด้านล่างลงไป

## พรอมต์สำหรับวาง (copy ทั้งก้อน)

```text
You are a runner. Do exactly the steps in RUNBOOK.md for the task I name, nothing else.
Rules:
- Do NOT edit any file under engine/, src/, scripts/, or any .md file. Only run commands.
- Run every command from the folder the step says.
- If a command fails, stop, and report the exact command and the last 20 lines of its output. Do not try to fix code.
- Never paste long logs. Report only what the step's "Report" line asks for.
- When a step makes files for the user (images, audio, video), send them to the user if you can, and list their paths.
- At the end, commit only the files the step says to commit (if any), with message "Run: <task name>", and push.
Task: <ใส่ชื่องาน เช่น "voices 02-moon-cat">
```

## ติดตั้งครั้งแรก (setup)

จาก root ของ repo:

```bash
npm install
python3 -m venv .venv
.venv/bin/pip install piper-tts
```

ถ้าจะใช้เสียงมีอารมณ์ (Chatterbox) ต้องติดตั้งเพิ่ม เครื่องที่ไม่มี GPU ใช้ torch แบบ CPU:

```bash
.venv/bin/pip install torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cpu
.venv/bin/pip install chatterbox-tts
```

(Mac ใช้ `.venv/bin/pip install chatterbox-tts` ได้เลย จะใช้ GPU ของ Apple ให้อัตโนมัติ)

ตรวจ:

```bash
.venv/bin/python -c "import chatterbox, piper; print('ok')"
```

Report: `ok` หรือ error

## งาน: voices <story>

สร้างเสียงพูดทั้งเรื่อง วัดเวลา แล้ววางลงไทม์ไลน์ ใช้เวลาราว 30 วินาทีต่อประโยคบน CPU

จาก `stories/<story>`:

```bash
../../.venv/bin/python ../../engine/voice.py
python3 ../../engine/timing.py
node ../../engine/dialog.mjs
ffmpeg -y -loglevel error -i out/audio/dialogue.wav -c:a libmp3lame -b:a 128k out/dialogue_preview.mp3
```

Report: บรรทัดสุดท้ายของ timing.py (`N lines, X s of speech, K flagged`) และทุกบรรทัดที่มี TIGHT หรือ OVER ส่งไฟล์ `out/dialogue_preview.mp3` ให้ผู้ใช้
Commit: `src/dialog.js`

## งาน: retake <story> <ids...>

อัดใหม่เฉพาะบางประโยค 3 เทค ให้ผู้ใช้เลือก

จาก `stories/<story>`:

```bash
../../.venv/bin/python ../../engine/voice.py --takes 3 <ids...>
```

Report: รายชื่อไฟล์ใน `out/voice/takes/` และส่งไฟล์ให้ผู้ใช้ฟัง พอผู้ใช้เลือกแล้ว ให้ copy เทคที่เลือกไปทับ
`out/voice/raw/<id>_<who>.wav` แล้วรัน `timing.py` และ `dialog.mjs` อีกรอบ (เหมือนงาน voices บรรทัด 2–3)
Commit: `src/dialog.js`

## งาน: cast-sheet <story>

เรนเดอร์ model sheet ของตัวละคร (ทุกมุม ทุกสีหน้า) ให้เซสชันหลักตรวจ

จาก `stories/<story>`:

```bash
node ../../engine/test/drycheck.mjs cast facesPumpkin facesPip
node ../../engine/render.mjs --loop=cast --sheet=0.5 --cols=1 --w=1080 --out=out/check/cast.jpg
node ../../engine/render.mjs --loop=facesPumpkin --sheet=0.5 --cols=1 --w=1080 --out=out/check/faces_pumpkin.jpg
node ../../engine/render.mjs --loop=facesPip --sheet=0.5 --cols=1 --w=1080 --out=out/check/faces_pip.jpg
node ../../engine/render.mjs --loop=cast --strip=0:1 --cols=6 --w=360 --out=out/check/cast_motion.jpg
```

ถ้าเป็น Linux ที่ไม่มี GPU ให้เติม `--soft-gl` ทุกคำสั่ง render ถ้าหา Chrome ไม่เจอให้เติม `--chrome=<path>`
(บนเครื่องคลาวด์ของ Claude มี `/usr/bin/google-chrome` อยู่แล้ว เติมแค่ `--soft-gl` ก็พอ)

Report: บรรทัดสุดท้ายของ drycheck, ค่า ms/frame ที่ render.mjs พิมพ์ออกมา (ถ้ามี) และส่งภาพทั้ง 4 ให้ผู้ใช้
Commit: `git add -f out/check/cast.jpg out/check/faces_pumpkin.jpg out/check/faces_pip.jpg out/check/cast_motion.jpg`

## งาน: preview <story> (เอนจินแบน)

เรนเดอร์คลิปเต็มด้วย Playwright (มีในเครื่องคลาวด์ของ Claude อยู่แล้ว ไม่ต้อง npm install) จาก `stories/<story>`:

```bash
NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --out=out/preview.mp4 --audio=out/audio/dialogue.wav
```

Report: บรรทัดสุดท้าย (จำนวนเฟรม/เวลา) และส่งไฟล์ให้ผู้ใช้

## งาน: check <story> <times>

เรนเดอร์ภาพตรวจ (contact sheet) ที่เวลาที่กำหนด เซสชันหลักจะบอกเวลาและชื่อไฟล์ให้

จาก `stories/<story>`:

```bash
node ../../engine/render.mjs --sheet=<times> --cols=4 --w=480 --out=out/check/<name>.jpg
```

ถ้าเป็น Linux ที่ไม่มี GPU ให้เติม `--soft-gl` ถ้าหา Chrome ไม่เจอให้เติม `--chrome=<path>`

Report: ส่งภาพให้ผู้ใช้
Commit: `git add -f out/check/<name>.jpg` (โฟลเดอร์นี้ถูก ignore ไว้ ต้องใช้ -f เพื่อให้เซสชันหลักเปิดดูได้)

## งาน: final <story>

เรนเดอร์วิดีโอเต็ม (นานหลายชั่วโมงถ้าไม่มี GPU รันเป็น background)

จาก `stories/<story>`:

```bash
rm -rf out/frames
node ../../engine/render.mjs --frames --workers=2
node ../../engine/render.mjs --encode --audio=out/audio/mix.wav --out=out/video.mp4
ffprobe -v error -show_entries format=duration:stream=width,height,codec_type -of compact out/video.mp4
```

Report: ผล ffprobe (ความยาว, 1920x1080, มี stream audio) และ path ของ `out/video.mp4`
Commit: ไม่ต้อง (ไฟล์ใหญ่)
