// ending_audio.mjs: 6 s of sound for the Short's ending card (run from long/01-midnight-fridge): writes out/audio/short_ending.wav
import { Track, TAU, sweep, env, fade, thud, clang, tap, noise, Biquad, rng, SR } from '../../../engine/audio/synth.mjs';
const tr = new Track(6), put = (t, len, g, o) => tr.put(t, len, g, o);
const beep = (f, len = .12) => sweep(t => f, t => fade(t, len, .005, .02) * .3);
function pluck(f, dur = .4) { const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 11)); for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1; let i = 0; return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * .7 + b * .3) * .995; i = (i + 1) % n; return a * fade(t, dur, .001, .1); }; }
const hum = len => { const n = noise(3), lp = new Biquad().set('lp', 200, .7); return t => (Math.sin(TAU * 90 * t) * .3 + lp.run(n()) * .6) * fade(t, len, .2, .5); };
put(.2, 1.2, hum(1.2), { gain: .5 });                                                   // the vacuum rolls in
for (const [t, f] of [[1.0, 1400], [1.35, 1400], [1.9, 1200], [2.1, 1700]]) put(t, .15, beep(f), { gain: .6 });   // scanning... "?"
put(2.6, 1.2, (() => { const c = clang(330); return t => c(t) * .8; })(), { gain: .6, send: .5 });   // "!"
put(2.62, .5, sweep(t => 900 + 300 * Math.sin(t * 40), t => fade(t, .5, .01, .1) * .25), { gain: .5 });   // alarm wobble
put(3.0, .5, thud(55, .3, 2), { gain: .8 }); put(3.25, .5, thud(65, .3, 3), { gain: .7 });   // WILL THEY GET / THE CAKE?
put(4.0, 1.4, sweep(t => 1568, t => env(t, .002, .6) * .4), { gain: .5, send: .5 });      // PART 2 ding
[52, 0, 55, 52, 58, 0, 57, 55, 52, 0, 55, 52].forEach((m, i) => m && put(i * .25, .2, pluck(440 * Math.pow(2, (m - 69) / 12), .2), { gain: .35 }));   // the spy riff, once
tr.reverb(.25, 1);
tr.write('out/audio/short_ending.wav');
