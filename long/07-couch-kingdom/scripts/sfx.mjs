// sfx.mjs: sound effects of long/07 chapter 1 (205 s: titles 0-5, chapter 5-185, End Screen 185-205).
// Cues are written in CHAPTER time (as in shots.js); P() shifts them by the 5-second titles. Run: node scripts/sfx.mjs
import { Track, TAU, bed, thud, whoosh, tap, squeak, sweep, env, fade, noise, rng, Biquad, boing, pop, poof, crunch, clang, chirp, chomp, eep, splash } from '../../../engine/audio/synth.mjs';

const DUR = 205, IN = 5, tr = new Track(DUR), put = (t, len, g, o) => tr.put(t, len, g, o), P = (t, len, g, o) => put(t + IN, len, g, o);
const crackle = (len, seed = 1, rate = .02) => { const n = noise(seed), r = rng(seed + 7), hp = new Biquad().set('hp', 3000, .7); let g = 0; return t => { if (r() < rate) g = 1; g *= .97; return hp.run(n()) * g * fade(t, len, .005, .05) * 1.6; }; };
const sparkle = (seed = 1) => { const r = rng(seed); return t => { let s = 0; for (let k = 0; k < 4; k++) s += Math.sin(TAU * (2400 + k * 700 + r() * 0) * t) * env(t - k * .06, .002, .15); return s * .25; }; };
const rumble = (len, seed = 3) => { const n = noise(seed), lp = new Biquad().set('lp', 120, .8); return t => lp.run(n()) * fade(t, len, .2, .5) * 6; };
const suck = (len, seed = 4) => { const n = noise(seed), bp = new Biquad(); return t => { bp.set('bp', 300 + 200 * Math.sin(t * 3), .7); return bp.run(n()) * fade(t, len, .5, .8) * 2.4; }; };
const kazoo = (f, len) => sweep(t => f * (1 + .02 * Math.sin(t * 40)), t => fade(t, len, .02, .05) * .35 * (Math.sign(Math.sin(TAU * f * t)) * .4 + .6));
const scrape = (len, seed) => { const n = noise(seed), bp = new Biquad().set('bp', 2200, 2); return t => bp.run(n()) * fade(t, len, .02, .1) * (.6 + .4 * Math.sin(t * 60)) * 1.4; };

// ---- titles (absolute time)
put(.05, .5, boing(220, .5), { gain: .6 }); put(.3, .6, whoosh(.6, 600, 2400, 1), { gain: .4 }); put(1.0, .3, chomp(2), { gain: .9 }); put(1.25, .3, sweep(t => 800 + 3000 * t, t => env(t, .005, .1) * .3), { gain: .4 });
put(1.5, .9, whoosh(.9, 300, 900, 3), { gain: .5 }); for (const t of [2.2, 2.9, 3.5]) put(t, .15, eep(2600 + t * 100), { gain: .25 });
put(3.8, 1.0, whoosh(1.0, 200, 2600, 4), { gain: .7 });
// ---- the chapter (chapter time)
P(0, 180, bed(240, 2, .16), { gain: .25, loop: true });
P(.4, 1.2, sweep(t => 500 + 80 * Math.sin(t * 20), t => fade(t, 1.2, .05, .2) * .12), { gain: .4 });   // sniff sniff
P(1.9, .3, whoosh(.3, 400, 1200, 5), { gain: .4 }); P(2.2, .2, thud(150, .05, 6), { gain: .4 });
for (let i = 0; i < 6; i++) P(3.5 + i * .8, .12, eep(3200 + (i % 3) * 300), { gain: .12 });   // tiny eyes blinking
P(8.6, 1.4, scrape(1.4, 7), { gain: .25 });   // the paw gropes down
// sofa: tug, POP, slurp, boing, the cracker
for (let t = 17.2; t < 21; t += .4) P(t, .2, squeak(500, .2, Math.round(t * 10)), { gain: .25 });
for (let t = 21.2; t < 22.6; t += .3) P(t, .25, sweep(x => 300 + 400 * x, x => fade(x, .25, .02, .05) * .2), { gain: .5 });   // the tail stretching
P(22.6, .4, pop(700, 8), { gain: 1 }); P(22.65, .6, sweep(t => 1400 - 1200 * t / .6, t => fade(t, .6, .01, .1) * .3), { gain: .6 });   // slurp
P(24.2, .4, sweep(t => 1800 - 1500 * t / .4, t => fade(t, .4, .01, .05) * .25), { gain: .5 }); P(24.65, .5, boing(160, .5), { gain: .6 });
P(26.5, .3, pop(1200, 9), { gain: .5 });
// the slide: wind, a chip CRUNCH, the remote BEEP, TURBO
P(28, 17, (() => { const n = noise(10), bp = new Biquad(); return t => { bp.set('bp', 500 + 200 * Math.sin(t * 2), .8); return bp.run(n()) * fade(t, 17, .5, .5) * 1.5; }; })(), { gain: .5 });
P(33.8, .5, crunch(11), { gain: .9 }); P(34.3, .5, crunch(12), { gain: .7 });
P(41.6, .15, sweep(t => 2000, t => fade(t, .15, .005, .02) * .3), { gain: .6 }); P(41.65, 1.2, sweep(t => 300 + 2400 * t, t => fade(t, 1.2, .05, .2) * .25), { gain: .6 });
// Lostland: SQUASH, boing, squeak lines
P(45.6, .7, (() => { const th = thud(55, .3, 13), c = crunch(14); return t => th(t) * 1.3 + c(t) * .5; })(), { gain: 1.1 }); P(45.65, .6, poof(15), { gain: .5 });
P(46.2, .5, boing(240, .5), { gain: .5 });
// Sir Lint marches in, ACHOO, the lance pokes
for (let t = 51; t < 52.6; t += .18) P(t, .05, tap(1800, 120, t * 10), { gain: .35 });
P(56.1, .5, sweep(t => 900 + 600 * t, t => fade(t, .5, .1, .02) * .15), { gain: .5 }); P(56.5, .5, poof(16), { gain: .8 });
P(60.2, .15, pop(1500, 17), { gain: .7 }); P(60.3, .5, squeak(1100, .4, 18), { gain: .3 });
// the town pops out & kneels (a cascade of eeps), the lance drops
P(65.6, .3, (() => { const c = clang(900); return t => c(t) * .4; })(), { gain: .5 });
for (let i = 0; i < 11; i++) P(66.6 + i * .2, .1, eep(2400 + (i % 4) * 300), { gain: .2 });
// sticky tape: rip-rip, the flick, slap on Pip's face
P(75.5, 1.2, (() => { const n = noise(19), hp = new Biquad().set('hp', 1500, .7); return t => hp.run(n()) * fade(t, 1.2, .05, .1) * .5; })(), { gain: .5 });
for (let t = 77.3; t < 79.5; t += .35) P(t, .15, (() => { const n = noise(Math.round(t * 99)), bp = new Biquad().set('bp', 2500, 1); return x => bp.run(n()) * env(x, .002, .04) * 1.5; })(), { gain: .4 });
P(79.5, .4, whoosh(.4, 800, 2400, 20), { gain: .4 }); P(79.9, .2, (() => { const th = thud(200, .03, 21); return t => th(t); })(), { gain: .7 });
// the parade, the palace: trumpets (kazoos), the receipt unrolls (and keeps going), the mummy wrap
P(80, 2, (() => { const n = noise(22), bp = new Biquad().set('bp', 1200, 1); return t => bp.run(n()) * fade(t, 2, .1, .3) * .6; })(), { gain: .5 });   // crowd cheer
for (const [t, f] of [[82.2, 523], [82.5, 659], [82.8, 784], [83.2, 1046]]) P(t, .35, kazoo(f, .35), { gain: .45 });
P(86.6, 3.0, (() => { const n = noise(23), bp = new Biquad().set('bp', 3000, 1.5); return t => bp.run(n()) * fade(t, 3, .05, .2) * (.5 + .5 * Math.sin(t * 50)) * .8; })(), { gain: .4 });
P(89.6, 2.0, scrape(2.0, 24), { gain: .3 }); P(91.6, .9, whoosh(.9, 400, 1600, 25), { gain: .5 }); for (let t = 92.6; t < 106; t += .9) P(t, .15, squeak(1500, .15, Math.round(t * 7)), { gain: .12 });   // mummy hops
P(94.8, .3, sparkle(26), { gain: .5 });   // the doodle
P(100.4, .35, whoosh(.35, 600, 3000, 27), { gain: .7 });   // whip pan
P(106.0, .4, kazoo(330, .4), { gain: .5 }); P(106.4, .5, poof(28), { gain: .8 });
// the ceremony: the crown tower, the fork SHLOOP, the crown slides down, the cape, the TRIP, the crown rolls
for (let i = 0; i < 4; i++) P(108.2 + i * .35, .15, eep(2000 + i * 300), { gain: .2 });
P(110.0, .4, (() => { const c = clang(1400); return t => c(t) * .3; })(), { gain: .5 });
P(113.4, .8, sweep(t => 400 + 900 * t, t => fade(t, .8, .05, .05) * .2), { gain: .5 }); P(114.2, .4, pop(500, 29), { gain: .9 }); P(114.25, .6, sparkle(30), { gain: .5 });
P(119.8, .6, sweep(t => 900 - 600 * t / .6, t => fade(t, .6, .02, .1) * .2), { gain: .5 }); P(123.4, .4, sweep(t => 300 + 600 * t / .4, t => fade(t, .4, .02, .1) * .2), { gain: .5 });
P(124.5, 1.0, whoosh(1.0, 300, 1200, 31), { gain: .4 });
P(127.4, .5, thud(60, .25, 32), { gain: 1.1 }); P(127.5, .8, (() => { const c = clang(1500); return t => c(t) * .25; })(), { gain: .4 }); for (let t = 127.6; t < 128.3; t += .1) P(t, .05, tap(3000, 0, t * 9), { gain: .2 });
P(129.6, .3, pop(900, 33), { gain: .5 });
// magic: the fizzle ZAP on Pip's ear, the cracker, the shield-cookie, the crunching, the buckle POOF
P(131.4, .9, sparkle(34), { gain: .4 }); P(132.9, .3, (() => { const c = crackle(.3, 35, .2); return t => c(t); })(), { gain: .9 }); P(133.0, .3, squeak(1800, .3, 36), { gain: .3 });
P(134.4, 2.8, sparkle(37), { gain: .3 }); P(137.0, .4, pop(1100, 38), { gain: .8 }); P(138.4, .6, chomp(39), { gain: .9 });
P(142.0, 1.4, sparkle(40), { gain: .4 }); P(143.3, .4, pop(1100, 41), { gain: .8 }); P(144.6, .8, chomp(42), { gain: .9 });
P(150.0, 2.4, (() => { const n = noise(43), bp = new Biquad().set('bp', 1200, 1); return t => bp.run(n()) * fade(t, 2.4, .1, .3) * .7; })(), { gain: .5 });
P(152.6, .5, sweep(t => 600 - 400 * t / .5, t => fade(t, .5, .02, .05) * .2), { gain: .5 }); P(153.1, .6, poof(44), { gain: .9 }); P(153.25, .4, thud(80, .15, 45), { gain: .9 });
// the Dragon: BOOM... BOOM... the sucking roar, everyone flees, the hides, the sweep
P(155.0, 1.8, (() => { const n = noise(50), bp = new Biquad().set('bp', 1200, 1); return t => bp.run(n()) * fade(t, 1.8, .1, .3) * .7; })(), { gain: .5 }); for (let t = 155.0; t < 156.8; t += .25) P(t, .05, tap(1800, 120, t * 10), { gain: .25 });   // the parade
for (const t of [157.0, 157.9, 158.6]) P(t, .9, thud(42, .45, Math.round(t)), { gain: 1.2 });
P(158.6, 18, (() => { const r = rumble(18), s = suck(18); return t => r(t) + s(t) * .6; })(), { gain: .7 });
for (let i = 0; i < 10; i++) P(160.8 + i * .08, .12, eep(2600 + (i % 3) * 400), { gain: .2 });
P(162.4, .3, whoosh(.3, 600, 2000, 46), { gain: .5 }); P(163.9, .3, whoosh(.3, 600, 2000, 47), { gain: .5 }); P(165.0, .4, whoosh(.4, 500, 1800, 48), { gain: .5 });
P(171.2, 3.0, sweep(t => 120 + 30 * Math.sin(t * 4), t => fade(t, 3, .4, .6) * .25), { gain: .6 });
P(176.4, .8, thud(50, .4, 49), { gain: .8 });
// ---- End Screen
put(186.0, .4, boing(200, .4), { gain: .4 });

tr.reverb(.16, .9);
tr.write('out/audio/sfx.wav');
