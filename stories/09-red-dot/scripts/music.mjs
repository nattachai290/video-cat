// music.mjs: "The Red Dot": fast cartoon chase, 26 bars at 138.67 bpm = 45 s (loops).
// tick (hook) | sting | chase | stop (on the wall) | rodeo | stop (uh oh) | chase+ | sneak | wind-up | tornado | dizzy | silly | tick.
import { Track, SR, TAU, rng, noise, Biquad, env, fade } from '../../../engine/audio/synth.mjs';

const BPM = 138.67, BEAT = 60 / BPM, BAR = 4 * BEAT, E8 = BEAT / 2, DUR = 45, tr = new Track(DUR);
const hz = m => 440 * Math.pow(2, (m - 69) / 12), N = (b, e, len, g, o) => tr.put(b * BAR + e * E8, len, g, o);
function pluck(f, dur = .4, bright = .5) { const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 11)); for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1; let i = 0; const d = .5 + bright * .45; return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * d + b * (1 - d)) * .995; i = (i + 1) % n; return a * fade(t, dur, .001, .1); }; }
const bass = (f, dur = .2) => t => (Math.sin(TAU * f * t) + .35 * Math.sin(TAU * 2 * f * t)) * env(t, .005, .15) * fade(t, dur, .002, .05) * .9;
const kick = () => t => Math.sin(TAU * 55 * t * (1 + 2 * Math.exp(-t * 40))) * env(t, .002, .12);
const snare = s => { const n = noise(s), bp = new Biquad().set('bp', 1800, .8); return t => bp.run(n()) * env(t, .001, .07) * 1.1; };
const hat = s => { const n = noise(s), hp = new Biquad().set('hp', 7000, .7); return t => hp.run(n()) * env(t, .002, .02) * .5; };
const tick = () => t => Math.sin(TAU * 1800 * t) * env(t, .001, .02) * .4;
const marimba = (f, dur = 1) => t => (Math.sin(TAU * f * t) * env(t, .002, .4) + Math.sin(TAU * f * 3.99 * t) * env(t, .001, .04) * .3) * fade(t, dur, .001, .2);
const RUN = [45, 47, 48, 50, 52, 50, 48, 47];          // running bass (A minor)
const LEAD = [69, 72, 76, 72, 74, 71, 67, 71];
const RODEO = [64, 0, 67, 64, 69, 0, 67, 64];

const SEC = b => b === 0 || b === 25 ? 'tick' : b === 1 ? 'sting' : b <= 6 ? 'chase' : b === 7 ? 'stop' : b <= 10 ? 'rodeo' : b <= 12 ? 'stop' : b <= 16 ? 'chase2' : b === 17 ? 'sneak' : b <= 19 ? 'wind' : b <= 21 ? 'tornado' : b === 22 ? 'dizzy' : 'silly';
for (let b = 0; b < 26; b++) {
  const sec = SEC(b);
  if (sec === 'tick') { for (let e = 0; e < 8; e += 2) N(b, e, .05, tick(), { gain: .5 }); N(b, 0, BAR, bass(hz(33), BAR), { gain: .25 }); }
  else if (sec === 'sting') { [57, 60, 63, 66].forEach((m, k) => N(b, 0, 1.2, pluck(hz(m), 1.2, .8), { gain: .35, send: .4 })); N(b, 0, .5, kick(), { gain: .8 }); }
  else if (sec === 'chase' || sec === 'chase2' || sec === 'tornado') {
    const up = sec === 'tornado' ? 5 : sec === 'chase2' ? 2 : 0;
    RUN.forEach((m, e) => N(b, e, .2, bass(hz(m - 12 + up)), { gain: .5 }));
    LEAD.forEach((m, e) => { if (e % 2 === 0 || sec !== 'chase') N(b, e, .2, pluck(hz(m + up), .2, .7), { gain: .3, pan: .25, send: .2 }); });
    [0, 4].forEach(e => N(b, e, .2, kick(), { gain: .7 })); [2, 6].forEach(e => N(b, e, .1, snare(b * 8 + e), { gain: .4 }));
    for (let e = 0; e < 8; e++) N(b, e, .05, hat(b * 8 + e), { gain: .25, pan: -.3 });
    if (sec === 'tornado') for (let e = 1; e < 8; e += 2) N(b, e, .1, snare(900 + b * 8 + e), { gain: .25 });
  } else if (sec === 'stop') { if (b === 7) N(b, 5.5, .5, kick(), { gain: .9 }); if (b === 11) RODEO.slice(0, 4).forEach((m, e) => m && N(b, e, .2, pluck(hz(m), .2, .7), { gain: .3 })); }
  else if (sec === 'rodeo') {
    RODEO.forEach((m, e) => { if (m) N(b, e, .2, pluck(hz(m), .2, .8), { gain: .35, pan: .3, send: .15 }); });
    [0, 2, 4, 6].forEach(e => N(b, e, .2, bass(hz(e % 4 ? 47 - 12 : 40 - 12)), { gain: .5 })); [1, 3, 5, 7].forEach(e => N(b, e, .1, snare(300 + b * 8 + e), { gain: .3 }));
  } else if (sec === 'sneak') { [0, 3, 6].forEach((e, k) => N(b, e, .4, pluck(hz([45, 48, 44][k]), .35, .2), { gain: .45 })); }
  else if (sec === 'wind') { for (let e = 0; e < 8; e++) N(b, e, .15, pluck(hz(57 + e + (b - 18) * 8), .15, .7), { gain: .3 }); for (let e = 0; e < 8; e++) N(b, e, .05, hat(600 + b * 8 + e), { gain: .25 }); }
  else if (sec === 'dizzy') { [76, 75, 74, 73, 72, 71].forEach((m, e) => N(b, e * 1.3, .5, marimba(hz(m), .5), { gain: .3, send: .4 })); }
  else {   // silly: bouncy major
    [72, 76, 79, 76, 74, 71, 67, 71].forEach((m, e) => N(b, e, .25, pluck(hz(m - (b % 2) * 2), .25, .7), { gain: .32, pan: .2, send: .2 }));
    [0, 4].forEach(e => N(b, e, .25, bass(hz(36 - (b % 2) * 2)), { gain: .45 })); for (let e = 1; e < 8; e += 2) N(b, e, .05, hat(500 + b * 8 + e), { gain: .2 });
  }
}
tr.reverb(.22, 1);
tr.write('out/audio/music.wav');
