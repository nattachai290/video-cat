// sfx.mjs: sound effects of "The Sun Spot" (times match src/scenes/shots.js). Run: node scripts/sfx.mjs -> out/audio/sfx.wav
import { Track, rng, bed, chirp, thud, whoosh, tap, squeak, sweep, env, fade, noise, Biquad, boing, eep, poof } from '../../../engine/audio/synth.mjs';

const DUR = 50, tr = new Track(DUR), r = rng(4), put = (t, len, g, o) => tr.put(t, len, g, o);

// room tone + a clock + birds far outside the window (left)
put(0, DUR, bed(260, 1, .2), { gain: .45, pan: -.1, loop: true }); put(0, DUR, bed(260, 2, .2), { gain: .45, pan: .1, loop: true });
for (let t = 0; t < DUR; t++) put(t + .5, .05, tap(t % 2 ? 3700 : 3100, 0, t), { gain: .14, pan: .6, send: .3 });
for (let t = .7; t < 24; t += 1.6 + r() * 2.2) put(t, .4, chirp(3000 + r() * 1000, 2 + Math.floor(r() * 2)), { gain: .16, pan: -.8, send: .4 });

// the purr: a low rumbling tremolo whenever he's asleep in the sun (fades out for 25.4–36.9)
const purr = (len) => { const n = noise(9), lp = new Biquad().set('lp', 220, .8); return t => lp.run(n()) * (.55 + .45 * Math.sin(t * 2 * Math.PI * 23)) * (.6 + .4 * Math.sin(t * 2.2)) * fade(t, len, .6, .6) * 2.2; };
put(0, 25.6, purr(25.6), { gain: .5, loop: false });
put(36.9, 13.1, (() => { const p = purr(14.5); return t => p(t + 1.4); })(), { gain: .5 });   // continues across the loop point
// sleep-slides: a soft fur-on-floor shuffle after each jump of the spot
for (const a of [3.55, 6.05, 8.05, 10.55, 46.9, 47.9, 48.9]) put(a, .5, (() => { const n = noise(Math.round(a * 10)), bp = new Biquad().set('bp', 900, .8); return t => bp.run(n()) * fade(t, .45, .05, .2) * .9; })(), { gain: .35 });
// 03 time-lapse whoosh, hop onto the chair
put(12.0, 1.0, whoosh(1.0, 300, 1200, 3), { gain: .25 });
put(14.9, .3, sweep(t => 300 + 900 * t, t => env(t, .01, .12) * .5), { gain: .4 }); put(15.75, .2, thud(90, .08, 4), { gain: .5 });
// 04 the stretch: a rubber-band "eeeee" rising with each reach
for (const [a, b] of [[18.6, 19.4], [20.2, 21.2], [22.0, 23.0], [23.8, 24.8]]) put(a, b - a, squeak(500 + (a - 18) * 60, b - a, Math.round(a)), { gain: .2 });
// 05 sun gone: a sad slide down; the hang (silence); the fall and THUD; the shiver
put(25.4, .7, sweep(t => 700 - 500 * t, t => fade(t, .7, .02, .2) * .4), { gain: .45 });
put(25.95, .45, whoosh(.45, 1800, 300, 5), { gain: .5 });
put(26.4, .25, thud(60, .16, 6), { gain: 1 });
put(26.45, .6, boing(140, .6), { gain: .35 });
put(26.9, .8, (() => { const n = noise(7), bp = new Biquad().set('bp', 2500, 2); return t => bp.run(n()) * (Math.sin(t * 2 * Math.PI * 18) > 0 ? 1 : .2) * fade(t, .8, .02, .2); })(), { gain: .35 });
put(32.4, 1.2, (() => { const n = noise(8), bp = new Biquad().set('bp', 2500, 2); return t => bp.run(n()) * (Math.sin(t * 2 * Math.PI * 18) > 0 ? 1 : .2) * fade(t, 1.2, .02, .4); })(), { gain: .25 });
// 06 Pip: steps on the sill, the lid lifted, the reflection "ting!"
for (let t = 30.0; t < 30.9; t += .15) put(t, .05, tap(2600, 200, t * 100), { gain: .3, pan: -.6 });
put(31.6, .4, sweep(t => 900 + 400 * t, t => env(t, .01, .15) * .3), { gain: .3, pan: -.6 });
put(32.0, 1.2, (() => { const a = sweep(t => 2637, t => env(t, .002, .5) * .5), b = sweep(t => 3951, t => env(t, .002, .35) * .3); return t => a(t) + b(t); })(), { gain: .55, send: .4 });
// 07 the flop, contented sigh (descending)
put(36.1, .4, sweep(t => 260 + 700 * t, t => env(t, .01, .12) * .5), { gain: .35 });
put(36.95, .3, thud(80, .12, 9), { gain: .55 });
put(37.05, .6, poof(12), { gain: .35 });
// 08 the arm trembling; Pip props the lid and trots off
put(43.6, 3.4, (() => { const s = squeak(1400, 3.4, 11); return t => s(t) * .5 * (.3 + .7 * Math.abs(Math.sin(t * 3))); })(), { gain: .12, pan: -.6 });
put(47.3, .1, tap(1600, 300, 77), { gain: .35, pan: -.6 });
for (let i = 0; i < 6; i++) put(47.5 + i * .17, .05, tap(2600, 200, 400 + i), { gain: .25, pan: -.7 - i * .04 });

tr.reverb(.18, .8);
tr.write('out/audio/sfx.wav');
