# GUIDE: วิดีโอยาว 16:9 ของ Snackatoon (ให้ AI ตัวอื่นทำต่อได้)

โฟลเดอร์ `long/` คือ **วิดีโอยาวแนวนอน** แยกจาก `stories/` ที่เป็น Shorts แนวตั้ง
ทุกเรื่องในนี้มี `STORYBOARD.md` ที่เขียนเสร็จแล้ว งานที่เหลือคือ "สร้างตามสตอรี่บอร์ด" ตามขั้นตอนข้างล่าง

```
long/
  GUIDE.md                 ไฟล์นี้: วิธีทำ + พรอมต์ก๊อปวางสำหรับ AI ตัวอื่น
  _template/               แม่แบบ 16:9 (studio.html, config 1920x1080 200 s, ซับล่างจอ, End Screen ใช้ซ้ำ, props รวมทุกอย่าง)
  01-midnight-fridge/      STORYBOARD.md + STATUS.md
  02-snow-day/ ... 06-...  STORYBOARD.md + STATUS.md
engine/                    เอนจินกลาง (ห้ามแก้ถ้าไม่จำเป็น)
stories/                   Shorts (ดูตัวอย่างโค้ดจริงได้ที่นี่)
```

## สิ่งที่ตัดสินใจแล้ว (ห้ามเปลี่ยนเอง)

- **รูปแบบ:** 1920×1080, 24 fps, ยาว 200 วินาที = **3 ส่วน ส่วนละ 60 วินาที + End Screen 20 วินาที**
  ส่วนที่ 1 = 0–60, ส่วนที่ 2 = 60–120, ส่วนที่ 3 = 120–180, End Screen = 180–200
- **สไตล์:** การ์ตูนแบน (เอนจิน `engine/flat/`), ตัวละคร `engine/cast/pumpkin_pip.js` (Pumpkin แมวส้มเสื้อกั๊กแดง, Pip หนูเทาผ้าพันคอเขียว)
- **เสียง:** ภาษาอังกฤษ ตัวละครพูดกันเอง ไม่มีผู้บรรยาย มีอารมณ์ (Chatterbox) ซับอังกฤษคาราโอเกะ **ล่างจอ** (`src/subs.js` ในแม่แบบตั้งไว้แล้ว)
- **ทุกอย่างแต่งเอง:** ไม่ใช้ตัวละคร/เพลง/ภาพจากที่อื่น เสียงเอฟเฟกต์และเพลงสังเคราะห์ด้วยโค้ด (`engine/audio/synth.mjs`)
- **จังหวะ:** มีมุกใหม่ทุก 3–5 วินาที ไม่มีช็อตเดินเฉย ๆ นาน ๆ (ผู้ใช้เคยบอกว่าตอนที่ยืดไม่สนุก)
- **มุมข้างของตัวละคร:** หนวดชี้ไปข้างหลัง, Pumpkin ไม่มีแขนห้อย (มีแค่ตอนยกอุ้งเท้า), ปากอยู่ในหน้า, Pip ขาเทาอุ้งเท้าชมพู (rig ทำให้แล้ว)
- **แก้งานต้องส่งภาพนิ่งก่อน:** ทุกส่วนต้องส่งภาพนิ่งให้ผู้ใช้ดูและได้ OK ก่อนเรนเดอร์วิดีโอ
- **Branch:** `claude/nice-heisenberg-5vtd6i` commit + push ทุกขั้น อัปเดต `STATUS.md` ของเรื่อง และ `PROGRESS.md`

## ขั้นตอนทำหนึ่งเรื่อง

### 0. เตรียม (ครั้งแรกของเครื่อง)
อัตโนมัติ: hook `.claude/hooks/session-start.sh` ติดตั้ง `.venv` (piper + chatterbox), โหลดเสียงต้นแบบ Piper ลง `out/voice-models/` และน้ำหนัก Chatterbox ตอนเปิดเซสชัน
(ครั้งแรก ~3 นาที ครั้งต่อไปข้าม) ต้องอนุญาต `huggingface.co`, `*.huggingface.co`, `*.hf.co`, `download.pytorch.org` ในการตั้งค่าเครือข่ายของ environment
ถ้าเซสชันขึ้น WARNING ว่าโหลดไม่ได้ ให้แจ้งผู้ใช้ให้เปิดโดเมนเหล่านั้น Playwright มีในเครื่อง cloud อยู่แล้ว

### 1. เริ่มเรื่องจากแม่แบบ
```bash
cd long
cp -r _template/studio.html _template/src _template/scripts NN-name/
mkdir -p NN-name/out/check
```
(ไม่ต้องลอก `_template/out`) แก้ `<title>` ใน `studio.html` เป็นชื่อเรื่อง

### 2. บทพูดและเสียง (ทำครั้งเดียวทั้งเรื่อง)
- เขียน `scripts/lines.json` จากตารางในสตอรี่บอร์ด (ทุกประโยค พร้อมเวลา `t` เป็นวินาทีของทั้งเรื่อง 0–200):
  `{"id":"d01","who":"pip","shot":"1-2","t":9.0,"text":"Operation... Cake.","emo":"whispered, dramatic","exag":0.6,"cfg":0.4,"speed":1.0,"pitch":1.0}`
- ตัวละครใหม่ใส่ใน `scripts/cast.json` (เลือกเสียงต้นแบบ Piper ที่มีใน `out/voice-models/` ของ root เช่น `en_US-joe-medium`, `en_GB-northern_english_male-medium`)
- รัน (จากโฟลเดอร์เรื่อง):
```bash
../../.venv/bin/python ../../engine/voice.py --engine chatterbox
python3 ../../engine/timing.py
node ../../engine/dialog.mjs
```
- ถ้า `timing.py` ขึ้น `OVER` ให้เลื่อน `t` ของประโยคนั้นให้เร็วขึ้น แล้วรัน `timing.py` + `dialog.mjs` ใหม่ (ไม่ต้องอัดใหม่)
- เสียงต้องการเสียงแหลม/เล็ก: ใช้ ffmpeg `asetrate=48000*1.5,aresample=48000` กับไฟล์ใน `out/voice/raw/` แล้วรัน `timing.py` + `dialog.mjs`

### 3. ฉากและพร็อพ (`src/props.js`)
- แม่แบบมี props รวมทุกอย่างจาก Shorts แล้ว: `livingRoom6`, `curtain`, `robotVac`, `crackerProp`, `cushion`, `speedLines`, `dizzy`,
  `burst`, `puffCloud`, `layer`/`sandwich`/`plate`/`coffeeTable` (แซนด์วิช), `dusty` (แรคคูน), `sharkHood`, `coasterCart`, `rail`, `portal`, `space`, `monster`, `starBlast`, `fireball`, `redDot`, `laserHook`
- ของใหม่ให้เขียนเพิ่มท้ายไฟล์ ใต้หัวข้อ `// ---------- this story ----------` หนึ่งฟังก์ชันต่อของหนึ่งชิ้น พิกัดคงที่
- ดูตัวอย่างการเขียนพร็อพได้ใน `stories/10-sandwich/src/props.js` และ `stories/11-space-coaster/src/props.js`
- **ห้องนั่งเล่นของซีรีส์วางบนพื้นกว้าง 1080 px** (พื้น y≈1300–1600) ใน 16:9 ให้ใช้กล้อง `camBegin(cx, cy, zoom)` เช่น `camBegin(540, 1250, 1.0)` สำหรับ WS
- ตัวละครยืน: `pumpkin(x, 1560, 40, {...})`, `pip(x, 1560, 40, {...})` (y = จุดเท้า, 40 = ขนาด u)

### 4. ช็อต (`src/scenes/shots.js`) ทำ **ทีละส่วน**
- ฟังก์ชันหนึ่งต่อหนึ่งช็อต `function s1_2(t) {...}` แล้ว `shots([[0, s1_1], [6, s1_2], ... , [180, t => endScreen(t, 180, { hat: true })]])`
- ทุกเฟรมคำนวณจาก `t` อย่างเดียว (ห้ามใช้ Math.random) ใช้ `seg(t, a, b)`, `ease()`, `backOut()`, `arcPt()`, `faces(t, [[t0, 'name', {...}]])`
- สีหน้าที่มี: neutral, happy, smug, embarrassed, annoyed, deadpan, sheepish, proud, surprised, panic, determined, teasing, innocent, munching, dazed, greedy, strain, soggy
- ปากขยับตามเสียง: ใส่ `who: 'pumpkin'` / `who: 'pip'`
- ตัวละครครึ่งตัวในภาชนะ: `clipRects([[x, y, w, h]], () => pumpkin(...))` แล้ววาดของที่บังทีหลัง
- ดูตัวอย่างโค้ดช็อตจริง: `stories/09-red-dot/src/scenes/shots.js` (ไล่ล่า), `stories/10-sandwich/src/scenes/shots.js` (มุกของกิน)

### 5. ตรวจ ทุกครั้งที่แก้ (จากโฟลเดอร์เรื่อง)
```bash
node ../../engine/test/drycheck.mjs --times=$(python3 -c "print(','.join(str(x/4) for x in range(0,801)))")
NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --sheet=<เวลาละ 1 จุดต่อช็อตของส่วนนั้น> --cols=4 --w=480 --out=out/check/partN.jpg
```
- `drycheck` ต้องได้ `0 problems`
- เปิดภาพดูเอง: ตัวละครบังกัน? หน้าโดนซับทับ? ของหลุดกรอบ? ตัวที่ควรซ่อนโผล่?
- **ส่ง `out/check/partN.jpg` ให้ผู้ใช้ดู รอ OK**

### 6. เรนเดอร์ส่วนนั้น (ภาพอย่างเดียว ไว้ให้ผู้ใช้ดู)
```bash
NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --range=0:60 --out=out/part1.mp4
```
(ส่วนที่ 2 `--range=60:120`, ส่วนที่ 3 `--range=120:180`, End Screen `--range=180:200`)

### 7. เสียงเอฟเฟกต์ + เพลง + มิกซ์ (หลังทำครบทุกส่วน)
- `scripts/sfx.mjs` และ `scripts/music.mjs` ยาว 200 วินาที ลอกโครงจาก `stories/10-sandwich/scripts/` แล้วเปลี่ยน `DUR = 200`
- เพลง 120 bpm: 1 ห้อง = 2 วินาที, 30 ห้องต่อส่วน, 100 ห้องทั้งเรื่อง ใส่ช่วงเงียบก่อนมุกใหญ่ของแต่ละส่วน
- รัน:
```bash
node scripts/sfx.mjs && node scripts/music.mjs && node ../../engine/audio/mix.mjs
```

### 8. เรนเดอร์จริง + ตรวจ
```bash
NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --out=out/video.mp4 --audio=out/audio/mix.wav
ffprobe -v error -show_entries stream=codec_type,width,height:format=duration -of csv=p=0 out/video.mp4
ffmpeg -y -loglevel error -i out/video.mp4 -vf "select='not(mod(n\,120))',scale=320:-1,tile=8x5" -frames:v 1 out/check/cuts.jpg
```
ต้องได้ `1920,1080` + `audio` + `200.0` ส่งวิดีโอให้ผู้ใช้

### 9. ปก + ข้อความ YouTube + End Screen
- ปก: วาดใน `src/cover.js` (`LOOPS.cover`) ภาพใหม่ตลก ๆ ไม่ใช่เฟรมจากเรื่อง ตัวหนังสือใหญ่ 2 บรรทัด แล้ว
```bash
NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --loop=cover --still=0.6 --out=out/cover_full.png
ffmpeg -y -loglevel error -i out/cover_full.png -vf scale=1280:720 out/cover.png
```
- `YOUTUBE.md`: ชื่อเรื่อง 3 แบบ, คำอธิบาย (บอกว่าเสียงตัวละครเป็น AI), แฮชแท็ก, ตั้งค่า (ติ๊ก altered or synthetic content) ดูตัวอย่าง `stories/11-space-coaster/YOUTUBE.md`
- `ENDSCREEN.md`: บอกผู้ใช้ว่าใน YouTube Studio > Editor > End screen ให้ใส่ "Video: Most recent upload" ที่กรอบบนขวา,
  "Video: Best for viewer" ที่กรอบล่างขวา, "Subscribe" ที่วงกลม (ตำแหน่งอยู่ใน `src/endscreen.js` → `ENDSLOTS`) ตั้งเวลาเริ่มที่ 3:00
  ตรวจตำแหน่งกรอบ: ใส่ `const GUIDES = 1;` บรรทัดแรกของ `shots.js` ชั่วคราว เรนเดอร์ภาพนิ่งที่ 185 แล้ว **ลบออกก่อนเรนเดอร์จริง**
- commit: `git add -f out/cover.png out/check/cuts.jpg` + ไฟล์ src/scripts/md ทั้งหมด (ห้าม commit `out/audio`, `out/voice`, `*.mp4`)

## พรอมต์ก๊อปวางสำหรับ AI ตัวอื่น

วางทั้งก้อน แล้วเปลี่ยนบรรทัด `Task:` เป็นงานที่ต้องการ

```text
You are continuing a cartoon-video project in this repo (branch claude/nice-heisenberg-5vtd6i).
Read long/GUIDE.md first and follow it exactly. Reply to the user in Thai; write code, comments and dialogue in English.
Rules:
- Build only what the story's STORYBOARD.md says. Do not change the story, the characters' look, or the engine.
- Work one part at a time. After each part: run drycheck (must be 0 problems), render a still sheet, LOOK at it yourself,
  fix obvious problems, then send the sheet to the user and WAIT for their OK before rendering video.
- Reuse props from long/_template/src/props.js and code patterns from stories/09-red-dot and stories/10-sandwich.
- Every frame must be a pure function of t (no Math.random, no state).
- Commit and push after each step; update the story's STATUS.md.
- If a command fails twice, stop and report the command and the last 20 lines of output.
Task: <เช่น "long/01-midnight-fridge: steps 1-2 (start from template, write lines.json, make voices)"
       หรือ "long/01-midnight-fridge: part 1 (steps 3-5)" หรือ "long/01-midnight-fridge: steps 7-9 (sound, final render, cover)">
```

ลำดับงานที่แนะนำต่อเรื่อง (สั่งทีละงาน):
1. `steps 1-2` เริ่มเรื่อง + เสียงพูด
2. `part 1 (steps 3-6)` → ผู้ใช้ OK
3. `part 2 (steps 3-6)` → ผู้ใช้ OK
4. `part 3 + End Screen (steps 3-6)` → ผู้ใช้ OK
5. `steps 7-9` เสียง + เรนเดอร์จริง + ปก + YOUTUBE.md + ENDSCREEN.md
