// music.mjs: "The Robot Vacuum": sleepy (bars 0-1) | spooky creep | chase gallop | spa (marimba, slow) | sleepy into bar 0.
// 22 bars at 105.6 bpm = 50 s (loops). Run: node scripts/music.mjs -> out/audio/music.wav
import { Track, SR, TAU, rng, noise, Biquad, env, fade, sweep } from '../../../engine/audio/synth.mjs';

const BPM = 105.6, BEAT = 60 / BPM, BAR = 4 * BEAT, E8 = BEAT / 2, DUR = 50, tr = new Track(DUR);
const hz = m => 440 * Math.pow(2, (m - 69) / 12), N = (b, e, len, g, o) => tr.put(b * BAR + e * E8, len, g, o);
function pluck(f, dur = .4, bright = .5) { const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 9)); for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1; let i = 0; const d = .5 + bright * .45; return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * d + b * (1 - d)) * .995; i = (i + 1) % n; return a * fade(t, dur, .001, .1); }; }
const marimba = (f, dur = 1.2) => t => (Math.sin(TAU * f * t) * env(t, .002, .55) + Math.sin(TAU * f * 3.99 * t) * env(t, .001, .05) * .3) * fade(t, dur, .001, .25);
const bass = (f, dur = .3) => t => (Math.sin(TAU * f * t) + .35 * Math.sin(TAU * 2 * f * t)) * env(t, .005, .2) * fade(t, dur, .002, .06) * .9;
const kick = () => sweep(t => 50 + 110 * Math.exp(-t * 30), t => env(t, .001, .12));
const snare = s => { const n = noise(s), bp = new Biquad().set('bp', 1800, .8); return t => bp.run(n()) * env(t, .001, .06) * 1.1; };
const hat = s => { const n = noise(s), hp = new Biquad().set('hp', 7000, .7); return t => hp.run(n()) * env(t, .002, .02) * .5; };
const CH = [[41, 65, 69, 72], [38, 62, 65, 69], [46, 65, 70, 74], [48, 64, 67, 72]];

for (let b = 0; b < 22; b++) {
  const ch = CH[b % 4];
  const sec = b <= 1 ? 'sleep' : b <= 3 ? 'creep' : b <= 8 ? 'creep2' : b <= 13 ? 'chase' : b <= 19 ? 'spa' : 'sleep';
  if (sec === 'sleep' || sec === 'spa') {
    for (let e = 0; e < 8; e++) N(b, e, 1.2, marimba(hz(ch[1 + e % 3] + (e >= 4 ? 12 : 0))), { gain: sec === 'spa' ? .3 : .22, pan: (e % 3 - 1) * .35, send: .45 });
    N(b, 0, 1.8, bass(hz(ch[0] - 12), 1.8), { gain: .4 });
  } else if (sec === 'creep' || sec === 'creep2') {   // tiptoeing chromatic pizz (the robot, then the crumbs trail)
    [0, 2, 4, 6].forEach((e, k) => N(b, e, .25, pluck(hz([50, 51, 50, 53][k] + (sec === 'creep2' ? 12 : 0)), .2, .3), { gain: .45, pan: -.2 }));
    [0, 4].forEach(e => N(b, e, .3, bass(hz(38)), { gain: .35 }));
    if (sec === 'creep2') for (let e = 1; e < 8; e += 2) N(b, e, .05, hat(b * 8 + e), { gain: .22, pan: .4 });
  } else {   // chase: galloping bass, snare, frantic line
    for (let e = 0; e < 8; e++) N(b, e, .2, bass(hz(38 + (e % 3 === 2 ? 7 : 0))), { gain: .5 });
    [0, 4].forEach(e => N(b, e, .2, kick(), { gain: .5 })); [2, 6].forEach(e => N(b, e, .1, snare(b * 8 + e), { gain: .35 }));
    for (let e = 0; e < 8; e++) N(b, e, .2, pluck(hz(74 + [0, 3, 5, 3, 7, 5, 3, 0][e] + (b % 2) * 2), .18, .7), { gain: .35, pan: .2 });
    for (let e = 0; e < 8; e++) N(b, e, .05, hat(600 + b * 8 + e), { gain: .25, pan: .4 });
  }
}
tr.reverb(.28, 1);
tr.write('out/audio/music.wav');
