// sfx.mjs: sound effects of "The Last Cookie" (times match src/scenes/shots.js). Run: node scripts/sfx.mjs -> out/audio/sfx.wav
import { Track, rng, bed, thud, whoosh, tap, squeak, sweep, env, fade, noise, Biquad, boing, clang, crunch, drip, poof } from '../../../engine/audio/synth.mjs';

const DUR = 50, tr = new Track(DUR), r = rng(5), put = (t, len, g, o) => tr.put(t, len, g, o);
const ting = (f = 2637, d = .5) => { const a = sweep(t => f, t => env(t, .002, d) * .5), b = sweep(t => f * 1.5, t => env(t, .002, d * .7) * .3); return t => a(t) + b(t); };
const knock = (f, seed) => { const th = thud(f, .1, seed), n = noise(seed), bp = new Biquad().set('bp', f * 6, 3); return t => th(t) * .8 + bp.run(n()) * env(t, .001, .03) * .6; };
const hum = len => { const n = noise(3), lp = new Biquad().set('lp', 140, .7); return t => (Math.sin(2 * Math.PI * 60 * t) * .4 + lp.run(n()) * .8) * fade(t, len, .5, .5) * .5; };

put(0, DUR, bed(260, 1, .2), { gain: .4, loop: true }); put(0, DUR, hum(DUR), { gain: .35, pan: .5, loop: true });   // room + fridge hum
// 01 the cookie's glint, drool drops
put(0.25, .9, ting(2637, .6), { gain: .5, send: .4 }); put(2.5, .9, ting(2637, .6), { gain: .3, send: .4 });
for (const d of [2.3, 3.7]) put(d, .1, drip(900), { gain: .4 });
// 02 the crouch, the bottom wiggle
put(5.6, .4, sweep(t => 500 - 300 * t, t => env(t, .01, .15) * .4), { gain: .4 });
for (let t = 5.9; t < 7.9; t += .12) put(t, .05, tap(1800, 0, t * 100), { gain: .18 });
// 03 the leap, SPLAT, the long squeaky slide, the slump
put(8.2, .55, whoosh(.55, 400, 2400, 2), { gain: .6 });
put(8.75, .3, (() => { const th = thud(90, .12, 3), n = noise(4), lp = new Biquad().set('lp', 1600, .8); return t => th(t) + lp.run(n()) * env(t, .002, .08) * 1.2; })(), { gain: 1 });
put(9.6, 1.4, (() => { const s = squeak(780, 1.4, 5); return t => s(t) * (1 - t / 1.6); })(), { gain: .45 });
put(11.0, .3, thud(70, .12, 6), { gain: .6 });
// 04 building: thunk as each piece lands, quick steps between; Pip's tail (a tiny squeak)
for (let i = 0; i < 4; i++) { const a = 14.4 + 2.2 * i; put(a + .5, .4, whoosh(.4, 600, 1500, 10 + i), { gain: .25 }); put(a + 1.4, .25, knock([70, 120, 90, 300][i], 20 + i), { gain: .7 });
  for (let t = a; t < a + 1.1; t += .16) put(t, .05, tap(2000, 160, t * 100), { gain: .2 }); }
put(19.4, .2, sweep(t => 3200 + 900 * t, t => env(t, .004, .05) * .3), { gain: .35, pan: .7 });
// 05 the climb: a hop per level, creaks that grow
for (const [a, b] of [[24.4, 25.3], [25.9, 26.7], [27.3, 28.0], [28.6, 29.3]]) { put(a, .3, sweep(t => 300 + 900 * t, t => env(t, .01, .1) * .45), { gain: .4 }); put(b, .2, knock(110, Math.round(a)), { gain: .45 }); }
for (let t = 24.8; t < 37.8; t += .9) put(t, .6, squeak(330 + (t - 24) * 12, .6, Math.round(t * 3)), { gain: .08 + (t - 24) * .012 });
// 06 the glass lid, Pip's crunch
put(31.9, .5, ting(3520, .3), { gain: .45, send: .3 });
put(32.5, .6, sweep(t => 900 - 600 * t, t => env(t, .01, .2) * .45), { gain: .35 });
for (let t = 33.0; t < 34.6; t += .42) put(t, .12, crunch(Math.round(t * 100)), { gain: .4 });
for (let t = 36.2; t < 36.9; t += .42) put(t, .12, crunch(Math.round(t * 100) + 1), { gain: .35 });
// 07 the crash (after a beat of silence ~37-38): rumble, his fall, each piece hitting, the tin hat
put(37.9, .5, squeak(260, .5, 77), { gain: .35 });
put(38.0, 1.2, (() => { const n = noise(9), lp = new Biquad().set('lp', 300, .7); return t => lp.run(n()) * env(t, .02, .5) * 2; })(), { gain: .6 });
put(38.1, .5, whoosh(.5, 2000, 300, 30), { gain: .5 });
put(38.6, .3, thud(60, .16, 31), { gain: 1 }); put(38.62, .6, boing(140, .6), { gain: .35 });
put(39.15, .3, knock(120, 32), { gain: .8 }); put(39.17, .8, clang(260), { gain: .35 });
put(39.4, .3, knock(90, 33), { gain: .7 });
put(39.85, .9, clang(620), { gain: .6, send: .3 });
for (let i = 0; i < 4; i++) put(40.0 + i * .2, .1, tap(1200, 0, 40 + i), { gain: .15 * (1 - i / 4) });   // tin rattling to a stop
// 08 the jar: lid pushed up, the cookie set down, Pip hops out, the lid drops: the glint (matches 0.25 s)
put(46.5, .4, ting(3520, .25), { gain: .35, send: .3 });
put(47.35, .2, knock(400, 50), { gain: .3 });
put(47.5, .3, sweep(t => 600 + 1200 * t, t => env(t, .01, .1) * .35), { gain: .35 });
put(48.25, .4, ting(3520, .3), { gain: .45, send: .3 });

tr.reverb(.18, .8);
tr.write('out/audio/sfx.wav');
