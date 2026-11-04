// music.mjs: "Static Zap": a bouncy, buzzy cartoon groove, 26 bars at 138.67 bpm = 45 s (loops).
// tick (the rub) | sting (puff) | bounce (door, junk) | rodeo-ish (shake, roll) | suspense (balloon) | SILENCE (bang) |
// sly (Pip the puffball) | sting (boop) | tick.
import { Track, SR, TAU, rng, noise, Biquad, env, fade } from '../../../engine/audio/synth.mjs';

const BPM = 138.67, BEAT = 60 / BPM, BAR = 4 * BEAT, E8 = BEAT / 2, DUR = 45, tr = new Track(DUR);
const hz = m => 440 * Math.pow(2, (m - 69) / 12), N = (b, e, len, g, o) => tr.put(b * BAR + e * E8, len, g, o);
function pluck(f, dur = .4, bright = .5) { const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 11)); for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1; let i = 0; const d = .5 + bright * .45; return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * d + b * (1 - d)) * .995; i = (i + 1) % n; return a * fade(t, dur, .001, .1); }; }
const bass = (f, dur = .2) => t => (Math.sin(TAU * f * t) + .35 * Math.sin(TAU * 2 * f * t)) * env(t, .005, .15) * fade(t, dur, .002, .05) * .9;
const buzz = (f, dur = .2) => t => Math.sign(Math.sin(TAU * f * t)) * .25 * env(t, .003, .08) * fade(t, dur, .002, .04);   // a square "electric" stab
const kick = () => t => Math.sin(TAU * 55 * t * (1 + 2 * Math.exp(-t * 40))) * env(t, .002, .12);
const snare = s => { const n = noise(s), bp = new Biquad().set('bp', 1800, .8); return t => bp.run(n()) * env(t, .001, .07) * 1.1; };
const hat = s => { const n = noise(s), hp = new Biquad().set('hp', 7000, .7); return t => hp.run(n()) * env(t, .002, .02) * .5; };
const tick = () => t => Math.sin(TAU * 1800 * t) * env(t, .001, .02) * .4;
const marimba = (f, dur = 1) => t => (Math.sin(TAU * f * t) * env(t, .002, .4) + Math.sin(TAU * f * 3.99 * t) * env(t, .001, .04) * .3) * fade(t, dur, .001, .2);
const WALK = [43, 47, 50, 47, 45, 48, 52, 48];          // bouncing bass (G)
const HOOK = [67, 0, 71, 74, 0, 72, 71, 69];
const SLY = [[0, 55], [3, 58], [4, 57], [6, 54]];

// 0-1 rub | 1 sting at 2.0 s (bar 1.15) | 2-10 bounce | 11-13 roll | 14-16 suspense | 17 silence (bang at 29.15) | 18-22 sly | 23 boop sting at 40.6 | 24-25 tick
const SEC = b => b === 0 || b >= 24 ? 'tick' : b === 1 ? 'sting' : b <= 10 ? 'bounce' : b <= 13 ? 'roll' : b <= 16 ? 'suspense' : b === 17 ? 'silence' : b <= 22 ? 'sly' : 'boop';
for (let b = 0; b < 26; b++) {
  const sec = SEC(b);
  if (sec === 'tick') { for (let e = 0; e < 8; e += 2) N(b, e, .05, tick(), { gain: .5 }); N(b, 0, BAR, bass(hz(31), BAR), { gain: .25 }); }
  else if (sec === 'sting') { N(b, 1.2, .5, kick(), { gain: .8 }); [55, 59, 62, 67].forEach((m, k) => N(b, 1.2 + k * .25, 1, pluck(hz(m + 12), 1, .8), { gain: .3, send: .4 })); }
  else if (sec === 'bounce' || sec === 'roll') {
    const up = sec === 'roll' ? 3 : 0;
    WALK.forEach((m, e) => N(b, e, .2, bass(hz(m - 12 + up)), { gain: .5 }));
    HOOK.forEach((m, e) => { if (m) N(b, e, .2, pluck(hz(m + up), .2, .7), { gain: .3, pan: .25, send: .2 }); });
    if (b % 2) [1, 5].forEach(e => N(b, e, .15, buzz(hz(55 + up)), { gain: .3, pan: -.3 }));
    [0, 4].forEach(e => N(b, e, .2, kick(), { gain: .7 })); [2, 6].forEach(e => N(b, e, .1, snare(b * 8 + e), { gain: .4 }));
    for (let e = 0; e < 8; e++) N(b, e, .05, hat(b * 8 + e), { gain: .22, pan: -.3 });
    if (sec === 'roll') for (let e = 1; e < 8; e += 2) N(b, e, .1, snare(900 + b * 8 + e), { gain: .2 });
  } else if (sec === 'suspense') { for (let e = 0; e < 8; e += 4) N(b, e, .6, marimba(hz([79, 78, 77][b - 14]), .6), { gain: .18, send: .5 }); }
  else if (sec === 'silence') { /* the bang lives here */ }
  else if (sec === 'sly') {
    SLY.forEach(([e, m]) => N(b, e, .35, pluck(hz(m - (b % 2) * 2), .3, .3), { gain: .45 }));
    [0, 4].forEach(e => N(b, e, .2, kick(), { gain: .5 })); [2, 6].forEach(e => N(b, e, .05, tick(), { gain: .4 }));
    if (b >= 20) [70, 69, 67].forEach((m, k) => N(b, 1 + k * 2, .3, marimba(hz(m), .3), { gain: .2, send: .3 }));
  } else {   // boop: the sting, then a bouncy tag
    [67, 71, 74, 79].forEach((m, k) => N(b, 3.67 + k * .3, .8, pluck(hz(m), .8, .8), { gain: .3, send: .4 })); N(b, 3.67, .5, kick(), { gain: .8 });
  }
}
tr.reverb(.22, 1);
tr.write('out/audio/music.wav');
