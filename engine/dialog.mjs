// dialog.mjs: places a story's dialogue takes on its timeline. Adapted from Kreycin/ton-sea scripts/dialog.mjs (MIT).
// Run from a story folder after voice.py:   node ../../engine/dialog.mjs
//
// Reads scripts/lines.json ({id, who, t, text}: t = when the speech starts, video s), src/config.js (duration) and the
// takes in out/voice/raw/<id>_<who>.wav. Writes:
//   src/dialog.js          DIALOG rows [t0, who, env] (env: mouth level 0-9 per 1/24 s from t0), SPEAK(who, t) for the
//                          rigs (0..1, held for 1/12 s so the mouth changes like a drawing), and LY [[start, end, text]]
//                          for subs.js
//   out/audio/dialogue.wav every line at its time, levelled to one loudness, 48 kHz stereo, the film's length
import fs from 'fs';
import vm from 'vm';
import { execFileSync } from 'child_process';

const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('src/config.js', 'utf8') + '\nthis.PROJECT = PROJECT;', ctx);
const DUR = ctx.PROJECT.duration, FPS = 24, SR = 24000, TARGET = -21;   // mean dBFS of each line
const LINES = JSON.parse(fs.readFileSync('scripts/lines.json', 'utf8'));

const rows = [], ly = [], inputs = [], filt = [];
for (const [i, ln] of LINES.entries()) {
  const f = `out/voice/raw/${ln.id}_${ln.who}.wav`;
  const pcm = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', String(SR), '-'], { maxBuffer: 1 << 28 });
  const x = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4), hop = SR / FPS, env = [];
  for (let s = 0; s < x.length; s += hop) { let e = 0; for (let j = s; j < Math.min(s + hop, x.length); j++) e += x[j] * x[j]; env.push(Math.sqrt(e / hop)); }
  const p90 = [...env].sort((a, b) => a - b)[Math.floor(env.length * .9)] || 1e-6;
  const lv = env.map(v => Math.min(9, Math.round(9 * Math.min(1, v / p90))));
  const on = Math.max(0, lv.findIndex(v => v >= 2)) / FPS, last = lv.length - 1 - [...lv].reverse().findIndex(v => v >= 2);
  const t0 = +(ln.t - on).toFixed(3);                       // place the file so its first sound lands on ln.t
  let mean = 0; for (const v of x) mean += v * v; mean = 10 * Math.log10(mean / x.length + 1e-12);
  rows.push([t0, ln.who, lv.join('')]);
  ly.push([ln.t, +(t0 + (last + 1) / FPS).toFixed(3), ln.text, ln.who]);
  inputs.push('-i', f);
  filt.push(`[${i}:a]aresample=48000,volume=${(TARGET - mean).toFixed(2)}dB,adelay=${Math.round(t0 * 1000)}:all=1[a${i}]`);
}
filt.push(`${rows.map((_, i) => `[a${i}]`).join('')}amix=inputs=${rows.length}:normalize=0,apad=whole_dur=${DUR},atrim=0:${DUR},aformat=channel_layouts=stereo[out]`);
fs.mkdirSync('out/audio', { recursive: true });
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', filt.join(';'), '-map', '[out]', '-ar', '48000', '-c:a', 'pcm_s16le', 'out/audio/dialogue.wav'], { stdio: 'inherit' });

fs.writeFileSync('src/dialog.js', `// dialog.js: written by engine/dialog.mjs (do not edit). DIALOG rows [t0, who, env], env = mouth level 0-9 per 1/24 s
// from t0. SPEAK(who, t): that character's mouth level 0..1 at video time t, held for 1/12 s. LY: [[start, end, text, who]]
// for subs.js (each line's speech start and end).
const DIALOG = ${JSON.stringify(rows)};
const LY = ${JSON.stringify(ly)};
function SPEAK(who, t) {
  const tq = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || tq < t0) continue;
    const k = Math.floor((tq - t0) * 24);
    if (k < env.length) return +env[k] / 9;
  }
  return 0;
}
`);
console.log(`placed ${rows.length} lines -> out/audio/dialogue.wav, src/dialog.js`);
