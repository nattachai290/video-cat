// music.mjs: the score of "The Sun Spot": a sleepy marimba lullaby in F, 22 bars at 105.6 bpm = exactly 50 s (loops).
// lullaby | rising (time-lapse, the stretch) | silence when the sun goes | cold low notes | bright "delivery" groove |
// lullaby again (leads back into bar 0). Run: node scripts/music.mjs -> out/audio/music.wav
import { Track, SR, TAU, rng, noise, Biquad, env, fade, sweep } from '../../../engine/audio/synth.mjs';

const BPM = 105.6, BEAT = 60 / BPM, BAR = 4 * BEAT, E8 = BEAT / 2, DUR = 50, tr = new Track(DUR);
const hz = m => 440 * Math.pow(2, (m - 69) / 12), at = (b, e = 0) => b * BAR + e * E8, N = (b, e, len, g, o) => tr.put(at(b, e), len, g, o);
function pluck(f, dur = .6, bright = .5) { const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 13)); for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1; let i = 0; const d = .5 + bright * .45; return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * d + b * (1 - d)) * .996; i = (i + 1) % n; return a * fade(t, dur, .001, .15); }; }
const marimba = (f, dur = 1.2) => t => (Math.sin(TAU * f * t) * env(t, .002, .55) + Math.sin(TAU * f * 3.99 * t) * env(t, .001, .05) * .3) * fade(t, dur, .001, .25);
const bass = (f, dur = .9) => t => (Math.sin(TAU * f * t) + .3 * Math.sin(TAU * 2 * f * t)) * env(t, .01, .5) * fade(t, dur, .002, .15) * .8;
const shaker = s => { const n = noise(s), hp = new Biquad().set('hp', 6500, .7); return t => hp.run(n()) * env(t, .004, .03) * .5; };
const bongo = f => sweep(t => f * (1 + .3 * Math.exp(-t * 40)), t => env(t, .001, .09));
const kick = () => sweep(t => 50 + 110 * Math.exp(-t * 30), t => env(t, .001, .12));
const CH = [[41, 65, 69, 72], [38, 62, 65, 69], [46, 65, 70, 74], [48, 64, 67, 72]];   // F  Dm  Bb  C
const LULL = [77, 0, 76, 0, 74, 0, 72, 0];

for (let b = 0; b < 22; b++) {
  const ch = CH[b % 4];
  const sec = b <= 5 ? 'lull' : b <= 10 ? 'rise' : b === 11 ? 'rest' : b === 12 ? 'cold' : b <= 18 ? 'bright' : 'lull';
  if (sec === 'rest') { N(b, 1, 1.2, marimba(hz(65), 1.2), { gain: .25 }); continue; }   // one lonely note as the sun goes
  if (sec === 'lull') {
    for (let e = 0; e < 8; e++) N(b, e, 1.2, marimba(hz(ch[1 + e % 3] + (e >= 4 ? 12 : 0))), { gain: .28, pan: (e % 3 - 1) * .35, send: .45 });
    N(b, 0, 1.8, bass(hz(ch[0] - 12), 1.8), { gain: .45 }); N(b, 4, 1.2, bass(hz(ch[0] - 12 + 7), 1.2), { gain: .3 });
    if (b % 2 === 1) LULL.forEach((m, e) => { if (m) N(b, e, .9, pluck(hz(m - (b % 4 === 3 ? 2 : 0)), .8, .4), { gain: .3, pan: .2, send: .35 }); });
  } else if (sec === 'rise') {   // climbing: the line steps up a tone each bar
    for (let e = 0; e < 8; e++) N(b, e, .9, marimba(hz(ch[1 + e % 3] + 12)), { gain: .25, pan: (e % 3 - 1) * .35, send: .4 });
    N(b, 0, 1.6, bass(hz(ch[0] - 12), 1.6), { gain: .45 });
    [0, 2, 4, 6].forEach((e, k) => N(b, e, .5, pluck(hz(72 + (b - 6) * 2 + k), .4, .6), { gain: .3 + (b - 6) * .03, pan: .2 }));
    for (let e = 0; e < 8; e++) N(b, e, .05, shaker(b * 8 + e), { gain: .12, pan: .4 });
  } else if (sec === 'cold') {   // shivery, minor, low
    [0, 3, 6].forEach(e => N(b, e, .7, pluck(hz([50, 53, 49][e / 3]), .6, .2), { gain: .35, pan: -.2 }));
  } else {   // bright delivery groove
    N(b, 0, .6, bass(hz(ch[0] - 12), .6), { gain: .5 }); N(b, 4, .6, bass(hz(ch[0] - 12), .6), { gain: .45 }); N(b, 7, .3, bass(hz(ch[0]), .3), { gain: .3 });
    [77, 0, 81, 0, 84, 81, 0, 79].forEach((m, e) => { if (m) N(b, e, .5, pluck(hz(m - (b % 4 === 1 ? 5 : b % 4 === 2 ? 2 : 0)), .45, .7), { gain: .4, pan: .2, send: .25 }); });
    [1, 3, 5, 7].forEach(e => N(b, e, .35, pluck(hz(ch[1 + (e >> 1) % 3]), .3, .3), { gain: .2, pan: -.3 }));
    [0, 4].forEach(e => N(b, e, .2, kick(), { gain: .45 }));
    for (let e = 0; e < 8; e++) N(b, e, .05, shaker(900 + b * 8 + e), { gain: e % 2 ? .22 : .12, pan: .4 });
    [3, 6].forEach(e => N(b, e, .15, bongo(e === 3 ? 330 : 250), { gain: .28, pan: -.4 }));
  }
}
tr.reverb(.32, 1);
tr.write('out/audio/music.wav');
