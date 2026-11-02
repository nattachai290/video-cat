# engine/

เครื่องมือที่ทุกเรื่องใน `stories/` ใช้ร่วมกัน รันจากโฟลเดอร์ของเรื่องนั้น ๆ เสมอ เช่น `cd stories/02-moon-cat`

| ไฟล์ | ทำอะไร | ที่มา |
|---|---|---|
| `core.js` | สีพู่กัน เส้นหมึก กล้อง แสง กระดาษ ฟังก์ชันจังหวะเวลา | ClaudeAnimationBase (MIT) |
| `timeline.js` | รายการช็อต ลูป และทรานซิชัน brush wipe | ClaudeAnimationBase (MIT) |
| `clawd.js`, `sheets.js` | ตัวละครตัวอย่างของชุดเครื่องมือ (ไว้ทดสอบเอนจิน) | ClaudeAnimationBase (MIT) |
| `acting.js` | `pose(lt, keys)` ท่าทางเป็นคีย์ตามเวลา, `antic()` จังหวะเตรียมตัวก่อนแอ็กชัน, `nod()` | skill `code-video` ใน Kreycin/ton-sea (MIT) |
| `subs.js` | ซับไตเติลเขียนมือแบบคาราโอเกะ | skill `code-video` ใน Kreycin/ton-sea (MIT) |
| `render.mjs` | เรนเดอร์ใน Chrome: contact sheet, strip, crop, เฟรม, MP4 | ClaudeAnimationBase (MIT) |
| `voice.py` | สร้างเสียงพูดมีอารมณ์ (Chatterbox) หรือแบบเร็ว (Piper) | เขียนใหม่ |
| `timing.py` | เช็กว่าทุกประโยคพูดจบทันในช็อต | เขียนใหม่ |
| `dialog.mjs` | วางเสียงพูดลงไทม์ไลน์ → `out/audio/dialogue.wav` + ปากขยับตามเสียง (`src/dialog.js`) | ดัดแปลงจาก Kreycin/ton-sea (MIT) |
| `ANIMATION_GUIDE.md` | กฎการวาดและ API ทั้งหมดของเอนจิน อ่านก่อนเขียนฉาก | ClaudeAnimationBase (MIT) |

ลำดับงานเสียงพูดของแต่ละเรื่อง:

```bash
python3 ../../engine/voice.py      # out/voice/raw/*.wav
python3 ../../engine/timing.py     # เช็กเวลา
node ../../engine/dialog.mjs       # out/audio/dialogue.wav + src/dialog.js
```
