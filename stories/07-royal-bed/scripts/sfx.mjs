// sfx.mjs: sound effects of "The Royal Bed" (times match src/scenes/shots.js). Run: node scripts/sfx.mjs -> out/audio/sfx.wav
import { Track, rng, bed, thud, whoosh, tap, squeak, sweep, env, fade, noise, Biquad, boing, pop, poof, crunch } from '../../../engine/audio/synth.mjs';

const DUR = 50, tr = new Track(DUR), put = (t, len, g, o) => tr.put(t, len, g, o), r = rng(7);
const card = (seed, len = .12) => { const n = noise(seed), bp = new Biquad().set('bp', 700 + (seed % 5) * 120, 1.4); return t => bp.run(n()) * env(t, .002, len / 3) * 1.4; };   // cardboard knock/rustle
const ting = (f = 2637, d = .5) => { const a = sweep(t => f, t => env(t, .002, d) * .5), b = sweep(t => f * 1.5, t => env(t, .002, d * .7) * .3); return t => a(t) + b(t); };
const purr = len => { const n = noise(9), lp = new Biquad().set('lp', 220, .8); return t => lp.run(n()) * (.55 + .45 * Math.sin(t * 2 * Math.PI * 23)) * fade(t, len, .6, .6) * 2.2; };

put(0, DUR, bed(260, 1, .2), { gain: .4, loop: true });
// box wiggles (start and end: identical rhythm, so the loop is seamless)
for (const [a, b] of [[0, 2.0], [46.9, 50]]) for (let t = a; t < b; t += .25) put(t, .12, card(Math.round(t * 4)), { gain: .55 });
put(0.8, .3, sweep(t => 600 + 600 * t, t => env(t, .01, .12) * .3), { gain: .3 });   // "?"
put(2.0, .4, pop(700, 3), { gain: .7 }); for (const k of [0, 1, 2]) put(2.02 + k * .05, .12, card(20 + k), { gain: .5 });
// 02 hauling the bed: rustle, shine, the reveal
put(5.0, .4, sweep(t => 400 + 900 * t, t => env(t, .01, .12) * .4), { gain: .35 });
put(6.0, 1.4, (() => { const n = noise(31), bp = new Biquad().set('bp', 500, .9); return t => bp.run(n()) * fade(t, 1.4, .1, .3) * (.5 + .5 * Math.sin(t * 9)); })(), { gain: .5 });
put(7.3, 1.2, ting(2093, .7), { gain: .5, send: .4 }); put(7.45, 1.2, ting(2637, .7), { gain: .4, send: .4 }); put(7.6, 1.2, ting(3136, .8), { gain: .35, send: .4 });
put(9.5, .3, sweep(t => 300 + 700 * t, t => env(t, .01, .1) * .35), { gain: .3, pan: .5 }); put(10.0, .15, tap(1400, 120, 1), { gain: .4, pan: .4 });
for (let t = 10.0; t < 11.8; t += .3) put(t, .06, tap(1600, 110, t * 100), { gain: .25 });
// 03 sniff sniff, the head-snap, the box sparkle, wiggle, leap, THUMP into the box
for (const s of [12.2, 12.45, 12.7]) put(s, .1, (() => { const n = noise(s * 100), hp = new Biquad().set('hp', 3000, .7); return t => hp.run(n()) * env(t, .005, .03) * 1.2; })(), { gain: .35 });
put(13.2, .25, whoosh(.25, 2000, 600, 4), { gain: .35 });
put(13.25, .9, ting(3520, .6), { gain: .35, send: .4 });
for (let t = 15.65; t < 16.2; t += .1) put(t, .05, tap(1800, 0, t * 100), { gain: .15 });
put(16.3, .55, whoosh(.55, 400, 2400, 5), { gain: .5 });
put(16.9, .3, (() => { const th = thud(85, .1, 6), c = card(6, .3); return t => th(t) + c(t); })(), { gain: .9 });
put(17.3, 2.6, purr(2.6), { gain: .45 });
// 04 stomping, the tug, the POP out of the box, flaps slapped shut, the squeeze into the tiny box
for (let t = 20.2; t < 22.5; t += .29) put(t, .08, tap(900, 140, t * 100), { gain: .4, pan: .4 });
put(22.6, .7, squeak(700, .7, 7), { gain: .35 });
put(23.3, .4, pop(900, 8), { gain: 1 }); put(23.35, .6, whoosh(.6, 2400, 600, 9), { gain: .4 });
put(23.9, .25, thud(80, .1, 10), { gain: .6 });
for (const k of [0, 1, 2, 3]) put(23.6 + k * .1, .12, card(40 + k), { gain: .45 });
for (let t = 24.4; t < 25.6; t += .3) put(t, .06, tap(1600, 110, t * 100), { gain: .25 });
for (let t = 25.8; t < 27.6; t += .3) put(t, .25, (() => { const s = squeak(420 + (t - 25.8) * 120, .22, Math.round(t * 10)); return u => s(u); })(), { gain: .3 });
put(27.6, .4, pop(500, 11), { gain: .45 });
// 05 Pip hops down, pads over, FWUMP into the velvet; a contented sigh; tiny snores
put(30.2, .3, sweep(t => 500 + 700 * t, t => env(t, .01, .1) * .3), { gain: .3 });
for (let t = 30.8; t < 32.2; t += .17) put(t, .05, tap(2600, 200, t * 100), { gain: .25 });
put(32.4, .7, (() => { const n = noise(12), lp = new Biquad().set('lp', 900, .7); return t => lp.run(n()) * env(t, .02, .2) * 1.6; })(), { gain: .6 });
for (let t = 37.0; t < 39.0; t += 1.0) put(t, .5, sweep(u => 900 + 200 * Math.sin(u * 8), u => fade(u, .5, .1, .2) * .12), { gain: .4, pan: -.4 });
// 06 jealous: a low grumble
put(41.2, 1.6, (() => { const n = noise(13), lp = new Biquad().set('lp', 160, 1.5); return t => lp.run(n()) * fade(t, 1.6, .2, .4) * 2.4; })(), { gain: .45 });
put(43.0, .3, sweep(t => 200 + 100 * t, t => env(t, .01, .1) * .4), { gain: .4 });
// 07 the leap, BOING in the bed, Pip launched (whistle down), into the box
put(45.0, .7, whoosh(.7, 300, 2000, 14), { gain: .55 });
put(45.7, .3, thud(80, .1, 15), { gain: .8 }); put(45.72, .7, boing(170, .7), { gain: .6 });
put(45.75, .85, sweep(t => 2400 - 1600 * t, t => fade(t, .85, .02, .1) * .35), { gain: .5 });
put(46.6, .3, (() => { const c = card(50, .3), th = thud(110, .08, 16); return t => c(t) + th(t) * .6; })(), { gain: .8 });

tr.reverb(.18, .8);
tr.write('out/audio/sfx.wav');
