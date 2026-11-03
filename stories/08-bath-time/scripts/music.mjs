// music.mjs: "Bath Time": 22 bars at 105.6 bpm = 50 s (loops).
// spooky (Pip) | sneaky hide-and-seek pizz | stop (the poke) | sneaky | spa marimba (bubbles) | drop (the slip) | silly | spooky.
import { Track, SR, TAU, rng, noise, Biquad, env, fade } from '../../../engine/audio/synth.mjs';

const BPM = 105.6, BEAT = 60 / BPM, BAR = 4 * BEAT, E8 = BEAT / 2, DUR = 50, tr = new Track(DUR);
const hz = m => 440 * Math.pow(2, (m - 69) / 12), N = (b, e, len, g, o) => tr.put(b * BAR + e * E8, len, g, o);
function pluck(f, dur = .4, bright = .5) { const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 11)); for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1; let i = 0; const d = .5 + bright * .45; return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * d + b * (1 - d)) * .995; i = (i + 1) % n; return a * fade(t, dur, .001, .1); }; }
const marimba = (f, dur = 1.2) => t => (Math.sin(TAU * f * t) * env(t, .002, .55) + Math.sin(TAU * f * 3.99 * t) * env(t, .001, .05) * .3) * fade(t, dur, .001, .25);
const bass = (f, dur = .3) => t => (Math.sin(TAU * f * t) + .35 * Math.sin(TAU * 2 * f * t)) * env(t, .005, .2) * fade(t, dur, .002, .06) * .9;
const organ = (f, dur) => t => (Math.sin(TAU * f * t) + .5 * Math.sin(TAU * 2 * f * t) + .25 * Math.sin(TAU * 3 * f * t)) * (1 + .3 * Math.sin(t * 30)) * fade(t, dur, .1, .3) * .25;
const hat = s => { const n = noise(s), hp = new Biquad().set('hp', 7000, .7); return t => hp.run(n()) * env(t, .002, .02) * .5; };
const SNEAK = [57, 0, 60, 0, 59, 0, 56, 0];   // A minor tiptoe
const SPA = [[60, 64, 67, 71], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]];

for (let b = 0; b < 22; b++) {
  const sec = b <= 1 ? 'spooky' : b <= 4 ? 'sneak' : b === 5 ? 'stop' : b <= 11 ? 'sneak' : b <= 14 ? 'spa' : b === 15 ? 'creep' : b === 16 ? 'drop' : b <= 20 ? 'silly' : 'spooky';
  if (sec === 'spooky') {   // mock horror: organ minor chord + low drone
    [[57, 60, 64], [56, 59, 65]][b % 2].forEach(m => N(b, 0, BAR, organ(hz(m), BAR), { gain: .32, send: .5 }));
    N(b, 0, BAR, bass(hz(33), BAR), { gain: .45 });
  } else if (sec === 'sneak' || sec === 'creep') {
    SNEAK.forEach((m, e) => { if (m) N(b, e, .3, pluck(hz(m + (b % 2 ? -2 : 0)), .25, .3), { gain: .45, pan: -.2 }); });
    [0, 4].forEach(e => N(b, e, .25, bass(hz(45 + (b % 2 ? -2 : 0) - 12)), { gain: .4 }));
    if (sec === 'creep') for (let e = 0; e < 8; e++) N(b, e, .05, hat(b * 8 + e), { gain: .2 });
  } else if (sec === 'stop') {
    N(b, 4, 1.4, marimba(hz(81), 1.4), { gain: .2 });
  } else if (sec === 'spa') {
    const ch = SPA[b % 4];
    for (let e = 0; e < 8; e++) N(b, e, 1.2, marimba(hz(ch[e % 4] + 12)), { gain: .25, pan: (e % 3 - 1) * .35, send: .5 });
    N(b, 0, 1.8, bass(hz(ch[0] - 24), 1.8), { gain: .35 });
  } else if (sec === 'drop') {
    // silence for the slip (36.4..37.3), then a big low hit on the splash
    N(b, 3.3, 1.0, bass(hz(29), 1.0), { gain: .6 });
  } else {   // silly: bouncy pizz, major
    [72, 76, 79, 76, 74, 71, 67, 71].forEach((m, e) => N(b, e, .3, pluck(hz(m - (b % 2) * 2), .25, .7), { gain: .35, pan: .2, send: .2 }));
    [0, 4].forEach(e => N(b, e, .3, bass(hz(36 - (b % 2) * 2)), { gain: .45 }));
    for (let e = 1; e < 8; e += 2) N(b, e, .05, hat(500 + b * 8 + e), { gain: .2, pan: .4 });
  }
}
tr.reverb(.25, 1);
tr.write('out/audio/music.wav');
