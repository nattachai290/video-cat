// music.mjs: "The Last Cookie": sneaky spy pizzicato in D minor, 22 bars at 105.6 bpm = 50 s (loops).
// sneaky (plan) | faster climb | full stop for the reveal | drum roll + crash | sneaky again into bar 0.
import { Track, SR, TAU, rng, noise, Biquad, env, fade, sweep } from '../../../engine/audio/synth.mjs';

const BPM = 105.6, BEAT = 60 / BPM, BAR = 4 * BEAT, E8 = BEAT / 2, DUR = 50, tr = new Track(DUR);
const hz = m => 440 * Math.pow(2, (m - 69) / 12), N = (b, e, len, g, o) => tr.put(b * BAR + e * E8, len, g, o);
function pluck(f, dur = .4, bright = .5) { const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 7)); for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1; let i = 0; const d = .5 + bright * .45; return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * d + b * (1 - d)) * .995; i = (i + 1) % n; return a * fade(t, dur, .001, .1); }; }
const bass = (f, dur = .3) => t => (Math.sin(TAU * f * t) + .35 * Math.sin(TAU * 2 * f * t)) * env(t, .005, .18) * fade(t, dur, .002, .06) * .9;
const snare = s => { const n = noise(s), bp = new Biquad().set('bp', 1800, .8); return t => bp.run(n()) * env(t, .001, .06) * 1.1; };
const kick = () => sweep(t => 50 + 110 * Math.exp(-t * 30), t => env(t, .001, .12));
const hat = s => { const n = noise(s), hp = new Biquad().set('hp', 7000, .7); return t => hp.run(n()) * env(t, .002, .02) * .5; };
const SNEAK = [62, 0, 65, 0, 64, 0, 61, 0], LINE = [74, 0, 77, 76, 0, 73, 74, 0];

for (let b = 0; b < 22; b++) {
  const sec = b <= 10 ? 'sneak' : b <= 13 ? 'climb' : b <= 15 ? 'stop' : b <= 17 ? 'roll' : 'sneak';
  if (sec === 'stop') continue;   // the reveal: silence
  if (sec === 'sneak') {
    SNEAK.forEach((m, e) => { if (m) N(b, e, .3, pluck(hz(m - 12), .25, .2), { gain: .45, pan: -.2 }); });
    [0, 4].forEach(e => N(b, e, .3, bass(hz(38)), { gain: .4 }));
    if (b % 2) LINE.forEach((m, e) => { if (m) N(b, e, .35, pluck(hz(m), .3, .7), { gain: .32, pan: .25, send: .25 }); });
    for (let e = 1; e < 8; e += 2) N(b, e, .05, hat(b * 8 + e), { gain: .25, pan: .4 });
  } else if (sec === 'climb') {   // double time, rising
    for (let e = 0; e < 8; e++) N(b, e, .2, pluck(hz(62 + (b - 11) * 2 + (e % 4 === 3 ? 3 : 0)), .18, .5), { gain: .4, pan: -.1 });
    for (let e = 0; e < 8; e += 2) N(b, e, .2, bass(hz(38 + (b - 11) * 2)), { gain: .45 });
    [0, 4].forEach(e => N(b, e, .2, kick(), { gain: .5 }));
    for (let e = 0; e < 8; e++) N(b, e, .05, hat(500 + b * 8 + e), { gain: .25, pan: .4 });
  } else {   // drum roll into the crash, then a deflated tumble down
    if (b === 16) for (let k = 0; k < 32; k++) N(b, k / 4, .1, snare(900 + k), { gain: .1 + .45 * k / 32 });
    else { N(b, 0, .3, kick(), { gain: .8 }); [72, 70, 68, 66, 64, 62, 60, 58].forEach((m, e) => N(b, e, .3, pluck(hz(m), .25, .6), { gain: .35 - e * .02, pan: .2 })); }
  }
}
tr.reverb(.25, 1);
tr.write('out/audio/music.wav');
