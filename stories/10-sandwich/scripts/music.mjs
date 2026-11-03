// music.mjs: "The Sandwich": 26 bars at 138.67 bpm = 45 s (loops).
// cooking (bouncy) | lurk | sneak (whistle stroll) | spy (fishing) | sneak | drumroll + silence | happy-stuffed | hiccup bounce | yuck | cooking.
import { Track, SR, TAU, rng, noise, Biquad, env, fade } from '../../../engine/audio/synth.mjs';

const BPM = 138.67, BEAT = 60 / BPM, BAR = 4 * BEAT, E8 = BEAT / 2, DUR = 45, tr = new Track(DUR);
const hz = m => 440 * Math.pow(2, (m - 69) / 12), N = (b, e, len, g, o) => tr.put(b * BAR + e * E8, len, g, o);
function pluck(f, dur = .4, bright = .5) { const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 11)); for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1; let i = 0; const d = .5 + bright * .45; return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * d + b * (1 - d)) * .995; i = (i + 1) % n; return a * fade(t, dur, .001, .1); }; }
const bass = (f, dur = .25) => t => (Math.sin(TAU * f * t) + .35 * Math.sin(TAU * 2 * f * t)) * env(t, .005, .18) * fade(t, dur, .002, .05) * .9;
const marimba = (f, dur = 1) => t => (Math.sin(TAU * f * t) * env(t, .002, .4) + Math.sin(TAU * f * 3.99 * t) * env(t, .001, .04) * .3) * fade(t, dur, .001, .2);
const snare = s => { const n = noise(s), bp = new Biquad().set('bp', 1800, .8); return t => bp.run(n()) * env(t, .001, .06) * 1.1; };
const hat = s => { const n = noise(s), hp = new Biquad().set('hp', 7000, .7); return t => hp.run(n()) * env(t, .002, .02) * .5; };
const kick = () => t => Math.sin(TAU * 55 * t * (1 + 2 * Math.exp(-t * 40))) * env(t, .002, .12);
const COOK = [72, 76, 79, 76, 77, 74, 71, 74], CH = [48, 53, 55, 48];
// bars: 0-1 cooking (0-3.5 s) | 2-3 lurk (3.5-7) | 4-6 sneak (7-12) | 7-9 spy (12-17.3) | 10-11 sneak (17.3-20.8) |
// 12-13 drumroll -> silence at 23.0-23.35 (bar 13 ends 24.2) | 14-16 stuffed (24.2-29.4) | 17-20 hiccup bounce (29.4-36.3) |
// 21-23 yuck (36.3-41.5) | 24-25 cooking (41.5-45)
const SEC = b => b <= 1 || b >= 24 ? 'cook' : b <= 3 ? 'lurk' : b <= 6 || (b >= 10 && b <= 11) ? 'sneak' : b <= 9 ? 'spy' : b <= 13 ? 'roll' : b <= 16 ? 'stuffed' : b <= 20 ? 'hic' : 'yuck';
for (let b = 0; b < 26; b++) {
  const sec = SEC(b), ch = CH[b % 4];
  if (sec === 'cook' || sec === 'hic') {
    COOK.forEach((m, e) => N(b, e, .25, marimba(hz(m + (sec === 'hic' ? 2 : 0) + (b % 4 === 1 ? 5 : b % 4 === 2 ? 7 : 0)), .3), { gain: .3, pan: .2, send: .3 }));
    [0, 4].forEach(e => N(b, e, .25, bass(hz(ch - 12 + (sec === 'hic' ? 2 : 0))), { gain: .45 })); [2, 6].forEach(e => N(b, e, .1, snare(b * 8 + e), { gain: .25 }));
    for (let e = 1; e < 8; e += 2) N(b, e, .05, hat(b * 8 + e), { gain: .2 });
  } else if (sec === 'lurk') { [0, 3, 6].forEach((e, k) => N(b, e, .5, pluck(hz([45, 48, 44][k]), .45, .2), { gain: .45 })); }
  else if (sec === 'sneak') { [57, 0, 60, 0, 59, 0, 56, 0].forEach((m, e) => m && N(b, e, .25, pluck(hz(m), .22, .35), { gain: .4 })); [0, 4].forEach(e => N(b, e, .25, bass(hz(33)), { gain: .35 })); }
  else if (sec === 'spy') { [52, 52, 55, 52, 58, 52, 57, 55].forEach((m, e) => N(b, e, .22, pluck(hz(m), .2, .5), { gain: .4, pan: -.2 })); for (let e = 0; e < 8; e++) N(b, e, .05, hat(300 + b * 8 + e), { gain: .2 }); }
  else if (sec === 'roll') {   // drumroll building, then silence from 23.0 to the GULP at 23.35, then a hit
    for (let e = 0; e < 8; e += .5) { const t = b * BAR + e * E8; if (t >= 23.0 && t < 23.35) continue; if (t >= 21.2) N(b, e, .06, snare(700 + b * 16 + e * 2), { gain: .25 + .3 * (t - 21.2) / 1.8 }); }
    if (b === 13) N(b, (23.35 - 13 * BAR) / E8, .6, kick(), { gain: 1 });
  } else if (sec === 'stuffed') { for (let e = 0; e < 8; e += 2) N(b, e, 1.0, marimba(hz([60, 64, 67, 72][e / 2] - (b % 2) * 2), 1.0), { gain: .28, send: .5 }); N(b, 0, 1.6, bass(hz(36), 1.6), { gain: .35 }); }
  else {   // yuck: wobbly minor
    [64, 63, 62, 61].forEach((m, k) => N(b, k * 2, .6, pluck(hz(m), .5, .3), { gain: .38, send: .3 })); N(b, 0, 1.6, bass(hz(34), 1.6), { gain: .35 });
  }
}
tr.reverb(.22, 1);
tr.write('out/audio/music.wav');
