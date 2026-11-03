// music.mjs: "The Space Coaster": 28 bars at 134.4 bpm = 50 s (loops).
// home (bouncy) | portal (synth swell) | ride | monster (heavy) | silence -> boom | fight/ride | swapped (wonky) | warp | home
import { Track, SR, TAU, rng, noise, Biquad, env, fade } from '../../../engine/audio/synth.mjs';

const BPM = 134.4, BEAT = 60 / BPM, BAR = 4 * BEAT, E8 = BEAT / 2, DUR = 50, tr = new Track(DUR);
const hz = m => 440 * Math.pow(2, (m - 69) / 12), N = (b, e, len, g, o) => tr.put(b * BAR + e * E8, len, g, o);
function pluck(f, dur = .4, bright = .5) { const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 11)); for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1; let i = 0; const d = .5 + bright * .45; return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * d + b * (1 - d)) * .995; i = (i + 1) % n; return a * fade(t, dur, .001, .1); }; }
const bass = (f, dur = .25) => t => (Math.sin(TAU * f * t) + .35 * Math.sin(TAU * 2 * f * t)) * env(t, .005, .18) * fade(t, dur, .002, .05) * .9;
const synth = (f, dur) => t => { let s = 0; for (let k = 1; k <= 5; k++) s += Math.sin(TAU * f * k * t * (1 + .002 * k)) / k; return s * fade(t, dur, .15, .3) * .25 * (1 + .2 * Math.sin(t * 6)); };
const lead = (f, dur = .25) => t => (((f * t) % 1) * 2 - 1) * env(t, .005, .15) * fade(t, dur, .002, .05) * .35;
const kick = () => t => Math.sin(TAU * 55 * t * (1 + 2 * Math.exp(-t * 40))) * env(t, .002, .12);
const snare = s => { const n = noise(s), bp = new Biquad().set('bp', 1800, .8); return t => bp.run(n()) * env(t, .001, .06) * 1.1; };
const hat = s => { const n = noise(s), hp = new Biquad().set('hp', 7000, .7); return t => hp.run(n()) * env(t, .002, .02) * .5; };
const marimba = (f, dur = 1) => t => (Math.sin(TAU * f * t) * env(t, .002, .4) + Math.sin(TAU * f * 3.99 * t) * env(t, .001, .04) * .3) * fade(t, dur, .001, .2);
// bars (1.786 s): 0-1 home | 2-4 portal | 5-10 ride | 11-12 monster | 13 silence->boom (23.2-25) | 14-17 fight | 18-21 swapped | 22-24 warp | 25-27 home
const SEC = b => b <= 1 || b >= 25 ? 'home' : b <= 4 ? 'portal' : b <= 10 ? 'ride' : b <= 12 ? 'monster' : b === 13 ? 'boom' : b <= 17 ? 'ride2' : b <= 21 ? 'swap' : 'warp';
const RIDE = [69, 72, 76, 79, 76, 72, 74, 71], CH = [45, 41, 43, 40];
for (let b = 0; b < 28; b++) {
  const sec = SEC(b), ch = CH[b % 4];
  if (sec === 'home') { [72, 0, 76, 74, 72, 0, 67, 0].forEach((m, e) => m && N(b, e, .3, pluck(hz(m - (b % 2) * 2), .3, .6), { gain: .35, send: .2 })); [0, 4].forEach(e => N(b, e, .3, bass(hz(36 - (b % 2) * 2)), { gain: .4 })); for (let e = 1; e < 8; e += 2) N(b, e, .05, hat(b * 8 + e), { gain: .18 }); }
  else if (sec === 'portal') { [57, 60, 64, 67].forEach(m => N(b, 0, BAR, synth(hz(m + (b - 2) * 2), BAR), { gain: .3, send: .6 })); for (let e = 0; e < 8; e++) N(b, e, .1, marimba(hz(81 + (e % 4) * 3), .2), { gain: .12, send: .5 }); }
  else if (sec === 'ride' || sec === 'ride2' || sec === 'warp') {
    const up = sec === 'ride2' ? 2 : sec === 'warp' ? 5 : 0;
    RIDE.forEach((m, e) => N(b, e, .22, lead(hz(m + up)), { gain: .3, pan: .2, send: .25 }));
    for (let e = 0; e < 8; e++) N(b, e, .2, bass(hz(ch - 12 + up)), { gain: .4 });
    [0, 4].forEach(e => N(b, e, .2, kick(), { gain: .6 })); [2, 6].forEach(e => N(b, e, .1, snare(b * 8 + e), { gain: .35 })); for (let e = 0; e < 8; e++) N(b, e, .05, hat(100 + b * 8 + e), { gain: .2 });
  } else if (sec === 'monster') { [0, 3, 6].forEach(e => { N(b, e, .5, bass(hz(28), .5), { gain: .7 }); N(b, e, .3, kick(), { gain: .8 }); }); [40, 41].forEach((m, k) => N(b, k * 4, .9, synth(hz(m), .9), { gain: .35 })); }
  else if (sec === 'boom') { /* silence until the boom at 23.5 (in the sfx), then a low hit */ N(b, (23.5 - b * BAR) / E8, 1.5, bass(hz(26), 1.5), { gain: .8 }); }
  else {   // swapped: wonky, tiptoe minor waltz-ish
    [0, 3, 5].forEach((e, k) => N(b, e, .5, pluck(hz([57, 60, 56][k] + (b % 2 ? -1 : 0)), .45, .3), { gain: .4, send: .3 })); N(b, 0, 1.5, bass(hz(33), 1.5), { gain: .35 });
    for (let e = 1; e < 8; e += 2) N(b, e, .2, marimba(hz(88 + (e % 3)), .2), { gain: .08 });
  }
}
tr.reverb(.25, 1);
tr.write('out/audio/music.wav');
