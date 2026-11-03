// mix.mjs: mixes a story's stems into out/audio/mix.wav. Adapted from Kreycin/ton-sea scripts/mix.mjs (MIT).
// Run from a story folder:  node ../../engine/audio/mix.mjs
// Stems (any that exist): out/audio/dialogue.wav, out/audio/music.wav, out/audio/sfx.wav. Each is set to a loudness
// target (LUFS where it plays), the music ducks under the voices, then a two-pass loudnorm to -14 LUFS / -1.5 dBTP
// (YouTube's playback level). Override targets in scripts/mix.json: { "dialogue": -18, "music": -30, "sfx": -24 }.
import { spawnSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

const LEVEL = { dialogue: -18, music: -29, sfx: -24, ...(existsSync('scripts/mix.json') ? JSON.parse(readFileSync('scripts/mix.json', 'utf8')) : {}) };
const names = ['dialogue', 'music', 'sfx'].filter(n => existsSync(`out/audio/${n}.wav`)), OUT = 'out/audio/mix.wav';
if (!names.includes('dialogue')) { console.error('needs out/audio/dialogue.wav (run engine/dialog.mjs)'); process.exit(1); }
const ff = args => { const p = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { encoding: 'utf8', maxBuffer: 1 << 26 }); if (p.status) throw new Error(p.stderr.slice(-800)); return p.stderr; };
const lufs = f => +[...ff(['-i', f, '-af', 'ebur128', '-f', 'null', '-']).matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop()[1];
const dur = +spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', 'out/audio/dialogue.wav'], { encoding: 'utf8' }).stdout;

const gain = Object.fromEntries(names.map(n => [n, +(LEVEL[n] - lufs(`out/audio/${n}.wav`)).toFixed(2)]));
console.log('stem gains dB', JSON.stringify(gain));
const inputs = names.flatMap(n => ['-i', `out/audio/${n}.wav`]);
const v = (i, n) => `[${i}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,volume=${gain[n]}dB`;
const parts = [`${v(0, 'dialogue')},asplit=2[d][k]`], mixIn = ['[d]'];
const mi = names.indexOf('music'), si = names.indexOf('sfx');
if (mi > 0) { parts.push(`${v(mi, 'music')}[m]`, `[m][k]sidechaincompress=threshold=0.015:ratio=5:attack=60:release=700:knee=4[md]`); mixIn.push('[md]'); }
else parts.push('[k]anullsink');
if (si > 0) { parts.push(`${v(si, 'sfx')}[s]`); mixIn.push('[s]'); }
const graph = loud => [...parts, `${mixIn.join('')}amix=inputs=${mixIn.length}:normalize=0,atrim=0:${dur},${loud}[out]`].join(';');
const base = 'loudnorm=I=-14:TP=-1.5:LRA=11';
const m = JSON.parse(/\{[^{}]*"input_i"[^{}]*\}/.exec(ff([...inputs, '-filter_complex', graph(`${base}:print_format=json`), '-map', '[out]', '-f', 'null', '-']))[0]);
ff(['-y', ...inputs, '-filter_complex', graph(`${base}:linear=true:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset},aresample=48000`),
  '-map', '[out]', '-c:a', 'pcm_s16le', OUT]);
console.log(`${OUT}: ${lufs(OUT)} LUFS (target -14)`);
