// sfx.mjs: chapter 2 "The Sock Bridge" (205 s: titles 0-5, chapter 5-185, End Screen 185-205). Cues in CHAPTER time via P().
import { Track, TAU, bed, thud, whoosh, tap, squeak, sweep, env, fade, noise, rng, Biquad, boing, pop, poof, crunch, clang, chirp, chomp, eep, splash } from '../../../../engine/audio/synth.mjs';

const DUR = 205, IN = 5, tr = new Track(DUR), put = (t, len, g, o) => tr.put(t, len, g, o), P = (t, len, g, o) => put(t + IN, len, g, o);
const sparkle = (seed = 1) => t => { let s = 0; for (let k = 0; k < 4; k++) s += Math.sin(TAU * (2400 + k * 700) * t) * env(t - k * .06, .002, .15); return s * .25; };
const ratchet = (len, seed) => { const n = noise(seed), bp = new Biquad().set('bp', 3000, 2); return t => bp.run(n()) * env(t % .09, .001, .015) * fade(t, len, .01, .05) * 2; };
const motor = (len, f = 260, down = false) => sweep(t => f * (down ? 1 - .7 * t / len : 1) * (1 + .1 * Math.sin(t * 40)), t => fade(t, len, .02, .1) * .2 * (Math.sign(Math.sin(TAU * 30 * t)) * .3 + .7));
const creak = (len, seed) => { const n = noise(seed), bp = new Biquad(); return t => { bp.set('bp', 300 + 250 * Math.sin(t * 7), 6); return bp.run(n()) * fade(t, len, .05, .1) * 2.5; }; };
const gurgle = len => sweep(t => 90 + 60 * Math.sin(t * 23) + 40 * Math.sin(t * 9), t => fade(t, len, .05, .1) * .5);

// titles
put(.05, .5, boing(220, .5), { gain: .6 }); put(.3, .6, whoosh(.6, 600, 2400, 1), { gain: .4 }); put(1.0, .3, chomp(2), { gain: .9 });
put(1.5, .9, whoosh(.9, 300, 900, 3), { gain: .5 }); put(3.8, 1.0, whoosh(1.0, 200, 2600, 4), { gain: .7 });
// chapter
P(0, 180, bed(240, 2, .16), { gain: .25, loop: true });
// 01 send-off: cheering, crumbs pattering, chomps, the car winding and buzzing off
P(0, 9, (() => { const n = noise(10), bp = new Biquad().set('bp', 1200, 1); return t => bp.run(n()) * fade(t, 9, .3, 1) * .6; })(), { gain: .5 });
for (let i = 0; i < 18; i++) P(2.5 + i * .45 + 1.4, .05, tap(2600, 0, i * 7), { gain: .15 });
for (const t of [3.9, 5.3, 6.6, 8.0, 9.3]) P(t, .3, chomp(Math.round(t * 10)), { gain: .6 });
P(8.0, 1.5, ratchet(1.5, 11), { gain: .5 }); P(9.5, 4.5, motor(4.5), { gain: .5 });
// 02 the Oracle: shimmer in, the fortune slides out, the flip, the lunge CHOMP on air, she whooshes up
P(14, 1.5, sparkle(12), { gain: .5 }); P(14.0, 22, sweep(t => 880 + 30 * Math.sin(t * 2), t => fade(t, 22, 1, 1) * .04), { gain: .5 });
P(24.8, .8, (() => { const n = noise(13), hp = new Biquad().set('hp', 3000, .7); return t => hp.run(n()) * fade(t, .8, .05, .1) * .6; })(), { gain: .4 });
P(28.2, .5, whoosh(.5, 900, 1800, 14), { gain: .3 });
P(33.4, 1.2, sweep(t => 200 + 400 * t, t => fade(t, 1.2, .1, .1) * .1), { gain: .5 }); P(34.6, .3, (() => { const th = thud(140, .05, 15); return t => th(t); })(), { gain: .7 }); P(34.8, 1.2, whoosh(1.2, 600, 2600, 16), { gain: .5 });
// 03 the journey: the car winds down, ratchet, zoom x2; the third: wound backwards, CRASH into the foot
P(38.0, 1.4, motor(1.4, 260, true), { gain: .5 }); P(39.4, 1.6, ratchet(1.6, 17), { gain: .5 }); P(41.0, 4, motor(4), { gain: .5 });
P(44.0, 1.0, motor(1.0, 220, true), { gain: .5 }); P(45.0, 1.8, ratchet(1.8, 18), { gain: .5 }); P(46.8, 4, motor(4), { gain: .5 });
P(50.8, .6, ratchet(.6, 19), { gain: .6 }); P(51.4, .6, motor(.6, 400), { gain: .7 }); P(52.0, .4, (() => { const th = thud(110, .08, 20), c = clang(700); return t => th(t) + c(t) * .3; })(), { gain: 1 });
P(52.1, .5, squeak(900, .5, 21), { gain: .4 }); for (let t = 52.4; t < 55.5; t += .22) P(t, .1, thud(160, .03, Math.round(t * 9)), { gain: .3 });   // hopping
for (let t = 38; t < 52; t += .5) P(t, .05, tap(1400, 120, t * 3), { gain: .15 });   // footsteps
// 04 the canyon: wind in the depths; the troll RISES (drum roll + boom)
P(58, 40, (() => { const n = noise(22), bp = new Biquad().set('bp', 260, .6); return t => bp.run(n()) * fade(t, 40, 1, 2) * 1.2; })(), { gain: .35 });
P(58.4, 1.2, (() => { const n = noise(23), lp = new Biquad().set('lp', 400, .7); return t => lp.run(n()) * fade(t, 1.2, .05, .05) * (.5 + .5 * Math.sin(t * 90)) * 2; })(), { gain: .6 }); P(59.6, .8, thud(50, .4, 24), { gain: 1.1 });
// 05 riddles: a quiz "ding" on every "Correct"; the gurgle
for (const t of [76.0, 86.5, 96.5]) P(t, .8, (() => { const c = clang(1320); return x => c(x) * .5; })(), { gain: .6 });
P(92.4, 1.6, gurgle(1.6), { gain: .7 });
P(82.8, .3, pop(900, 25), { gain: .5 });
// 06 sobbing, the cape flies, slow-mo reunion (a sweet chime), hearts pop, teeth chattering
for (let t = 100.5; t < 113; t += .7) P(t, .3, squeak(500 + (t * 40 % 120), .3, Math.round(t * 3)), { gain: .12 });
P(114.0, 1.4, whoosh(1.4, 400, 1400, 26), { gain: .5 });
for (let i = 0; i < 8; i++) P(115.6 + i * .6, 1.2, sweep(t => [523, 659, 784, 1046][i % 4], t => env(t, .01, .5) * .2), { gain: .5 });
for (let i = 0; i < 6; i++) P(120.6 + i * .8, .1, pop(1600, 27 + i), { gain: .3 });
for (let t = 123.5; t < 129; t += .07) P(t, .03, tap(3200, 0, t * 99), { gain: .15 });
// 07 crunching the railing, SNAP, creaks, planks falling, the run, the leap
for (let t = 131; t < 140; t += .45) P(t, .25, crunch(Math.round(t * 5)), { gain: .4 });
P(140.0, .4, (() => { const th = thud(200, .04, 28), c = crunch(29); return t => th(t) + c(t); })(), { gain: 1 });
P(141, 4, creak(4, 30), { gain: .5 });
for (const [i, t] of [[0, 143.0], [1, 144.0], [2, 145.2], [3, 146.6], [4, 148.2], [5, 149.8], [6, 151.4], [7, 153.0], [8, 154.6], [9, 156.4]]) { P(t, .3, crunch(40 + i), { gain: .5 }); P(t + .1, 1.0, whoosh(1.0, 1200, 300, 50 + i), { gain: .25 }); }
for (let t = 146; t < 157.6; t += .16) P(t, .05, tap(1600, 120, t * 9), { gain: .25 });
P(157.6, .5, whoosh(.5, 500, 2000, 31), { gain: .6 }); P(158.4, .2, (() => { const n = noise(32), bp = new Biquad().set('bp', 3500, 2); return t => bp.run(n()) * env(t, .002, .05) * 2; })(), { gain: .7 });
// 08 hanging, claws scraping, the edge crumbles; the long fall (wind rising); SPLOOSH; drips; the bubble on his nose: plip
P(160, 2.6, (() => { const n = noise(33), bp = new Biquad().set('bp', 3000, 3); return t => bp.run(n()) * fade(t, 2.6, .1, .2) * (1 + .5 * Math.sin(t * 50)) * .8; })(), { gain: .4 });
P(162.6, .6, crunch(34), { gain: .7 });
P(163.4, 6, (() => { const n = noise(35), bp = new Biquad(); return t => { bp.set('bp', 300 + 200 * t, .8); return bp.run(n()) * fade(t, 6, .3, .1) * 2; }; })(), { gain: .5 });
P(169.4, 1.2, splash(36), { gain: 1.2 }); P(169.45, .8, thud(70, .2, 37), { gain: .8 });
for (let t = 170.6; t < 176; t += .5) P(t, .08, sweep(x => 1200 + 2000 * x, x => env(x, .001, .03) * .3), { gain: .3 });
P(174.4, .1, pop(1400, 38), { gain: .5 });
P(176.4, .8, thud(50, .4, 39), { gain: .6 });
P(36.6, .3, chomp(70), { gain: .7 });
P(54.6, 1.0, ratchet(1.0, 71), { gain: .5 }); P(55.6, 1.4, motor(1.4, 320), { gain: .6 });
for (let t = 64.2; t < 65.0; t += .12) P(t, .05, tap(1800, 120, t * 10), { gain: .3 }); P(65.0, .3, (() => { const c = clang(1300); return x => c(x) * .5; })(), { gain: .7 }); P(65.0, 1.4, whoosh(1.4, 600, 2200, 72), { gain: .5 }); P(66.4, .3, (() => { const c = clang(900); return x => c(x) * .5; })(), { gain: .6 });
P(120.4, 1.0, (() => { const n = noise(73); return t => (Math.sign(Math.sin(TAU * 140 * t)) * .4 + n() * .2) * fade(t, 1.0, .02, .2) * .5; })(), { gain: .6 });
P(126.4, .3, boing(300, .3), { gain: .4 }); P(127.4, .15, eep(2800), { gain: .4 });
P(165.6, .4, chomp(74), { gain: .7 }); P(166.4, .3, sparkle(75), { gain: .4 }); P(167.6, .3, sweep(t => 600 + 1500 * t, t => env(t, .005, .1) * .3), { gain: .5 });
put(186.0, .4, boing(200, .4), { gain: .4 });
tr.reverb(.16, .9);
tr.write('out/audio/sfx.wav');
