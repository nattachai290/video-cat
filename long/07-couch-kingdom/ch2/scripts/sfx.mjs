// sfx.mjs: chapter 2 "The Sock Bridge" (205 s: titles 0-5, chapter 5-185, End Screen 185-205). Cues in CLIP time (the same seconds as lines.json and the storyboard).
import { Track, TAU, bed, thud, whoosh, tap, squeak, sweep, env, fade, noise, rng, Biquad, boing, pop, poof, crunch, clang, chirp, chomp, eep, splash } from '../../../../engine/audio/synth.mjs';

const DUR = 205, IN = 5, tr = new Track(DUR), put = (t, len, g, o) => tr.put(t, len, g, o), P = (t, len, g, o) => put(t, len, g, o);
const sparkle = (seed = 1) => t => { let s = 0; for (let k = 0; k < 4; k++) s += Math.sin(TAU * (2400 + k * 700) * t) * env(t - k * .06, .002, .15); return s * .25; };
const ratchet = (len, seed) => { const n = noise(seed), bp = new Biquad().set('bp', 3000, 2); return t => bp.run(n()) * env(t % .09, .001, .015) * fade(t, len, .01, .05) * 2; };
const motor = (len, f = 260, down = false) => sweep(t => f * (down ? 1 - .7 * t / len : 1) * (1 + .1 * Math.sin(t * 40)), t => fade(t, len, .02, .1) * .2 * (Math.sign(Math.sin(TAU * 30 * t)) * .3 + .7));
const creak = (len, seed) => { const n = noise(seed), bp = new Biquad(); return t => { bp.set('bp', 300 + 250 * Math.sin(t * 7), 6); return bp.run(n()) * fade(t, len, .05, .1) * 2.5; }; };
const gurgle = len => sweep(t => 90 + 60 * Math.sin(t * 23) + 40 * Math.sin(t * 9), t => fade(t, len, .05, .1) * .5);

// titles
put(.05, .5, boing(220, .5), { gain: .6 }); put(.3, .6, whoosh(.6, 600, 2400, 1), { gain: .4 }); put(1.0, .3, chomp(2), { gain: .9 });
put(1.5, .9, whoosh(.9, 300, 900, 3), { gain: .5 }); put(3.8, 1.0, whoosh(1.0, 200, 2600, 4), { gain: .7 });
// chapter
P(5, 180, bed(240, 2, .16), { gain: .25, loop: true });
const noiseBand = (seed, f, q, len, a, r, k = 1) => { const n = noise(seed), bp = new Biquad().set('bp', f, q); return t => bp.run(n()) * fade(t, len, a, r) * k; };
// 2-1 the crumb welcome: crumbs pattering all along, chomps, the crumb on the nose, the catches, the miss, the crumb puff
P(5, 15, noiseBand(10, 2600, 1, 15, .5, 1, .35), { gain: .5 });
for (let i = 0; i < 40; i++) P(5.5 + i * .35, .05, tap(2200 + (i % 5) * 200, 0, i * 7), { gain: .15 });
P(7.9, .1, tap(1800, 0, 3), { gain: .5 });                                          // the crumb lands on his nose
for (const t of [8.4, 8.9, 9.3]) P(t, .3, chomp(Math.round(t * 10)), { gain: .6 });
for (const t of [13.6, 14.3, 15.0, 15.7]) P(t, .3, chomp(Math.round(t * 10) + 5), { gain: .5 });
P(16.5, .25, squeak(700, .3, 61), { gain: .5 });                                    // a crumb in the eye
P(18.6, 1.6, whoosh(1.6, 300, 1200, 62), { gain: .35 });                            // the crumb puff
// 2-2 the Oracle: shimmer in, the map rolls open, the flips, the hug, she sinks away
P(20.0, 1.5, sparkle(12), { gain: .5 }); P(20.0, 24, sweep(t => 880 + 30 * Math.sin(t * 2), t => fade(t, 24, 1, 1) * .04), { gain: .5 });
P(23.9, .8, noiseBand(13, 4000, .7, .8, .05, .1, .6), { gain: .4 });                // the scroll unrolls
P(24.6, .5, whoosh(.5, 900, 1800, 14), { gain: .3 }); P(26.2, .5, whoosh(.5, 900, 1800, 15), { gain: .3 });
P(34.5, .3, squeak(1200, .3, 16), { gain: .4 });                                    // the happy hug
for (let t = 39.4; t < 41.8; t += .39) P(t, .3, whoosh(.3, 700, 1700, Math.round(t * 5)), { gain: .25 });   // the flips
P(43.8, 1.0, whoosh(1.0, 1500, 300, 17), { gain: .4 });
// 2-3 the journey: the car winds down (tick-tick), Pip winds, it goes, Pumpkin winds hard, it shoots backwards, the wheel falls off
for (let t = 45; t < 48; t += .5) P(t, .05, tap(1400, 120, t * 3), { gain: .15 });
P(45, 3, motor(3), { gain: .5 }); P(48.0, 1.2, motor(1.2, 260, true), { gain: .5 });
P(50.4, 1.2, ratchet(1.2, 17), { gain: .5 }); P(51.6, 1.8, motor(1.8), { gain: .5 }); P(53.2, .6, motor(.6, 260, true), { gain: .5 });
P(54.2, 2.3, ratchet(2.3, 19), { gain: .7 });                                       // winding it much harder
P(56.5, 1.1, motor(1.1, 420, true), { gain: .7 }); P(56.5, 1.0, whoosh(1.0, 1400, 400, 20), { gain: .4 });   // backwards
P(56.7, .4, boing(180, .4), { gain: .4 });
P(61.9, .6, ratchet(.6, 21), { gain: .5 }); P(62.5, 2.5, motor(2.5, 300), { gain: .5 });
P(63.0, .25, clang(900), { gain: .5 }); for (let k = 0; k < 6; k++) P(63.1 + k * .3, .1, tap(1500 - k * 150, 0, k + 30), { gain: .3 });   // the wheel bounces off
P(63.2, 1.8, squeak(500, 1.5, 22), { gain: .2 });
for (let t = 45; t < 65; t += .5) if ((t > 45 && t < 49.2) || t > 62.5) P(t, .05, tap(1400, 120, t * 3 + 1), { gain: .15 });   // footsteps
// 2-4 the canyon: wind in the depths; the troll's stomp, the quiz dings on each "Correct", the growl
P(65, 30, noiseBand(22, 260, .6, 30, 1, 2, 1.2), { gain: .35 });
P(65.2, .5, thud(60, .3, 23), { gain: 1 });
P(66.0, .4, thud(90, .1, 24), { gain: .5 });
P(70.0, .4, boing(300, .4), { gain: .4 });                                          // the sign pops up
for (const t of [78.4, 86.6, 94.8]) P(t, .8, (() => { const c = clang(1320); return x => c(x) * .5; })(), { gain: .6 });
P(90.5, 2.0, gurgle(2.0), { gain: .8 });
P(83.4, .3, pop(900, 25), { gain: .5 });                                            // the donut
// 2-5 sobbing, the cape flies, slow-mo reunion with a sweet chime and hearts, teeth chattering
for (let t = 96; t < 109; t += .7) P(t, .3, squeak(500 + (t * 40 % 120), .3, Math.round(t * 3)), { gain: .12 });
P(100.7, .3, pop(1100, 26), { gain: .4 });                                           // the thought bubble
P(109.5, .4, boing(260, .4), { gain: .5 }); P(110.0, 1.0, squeak(1600, .4, 27), { gain: .3 });
P(119.3, .4, whoosh(.4, 400, 1400, 28), { gain: .4 }); P(119.7, .5, poof(), { gain: .4 }); P(120.2, .3, sparkle(70), { gain: .5 }); P(120.45, .15, eep(3200), { gain: .3 });   // drop, unfold, eyes open, the blink
for (let i = 0; i < 8; i++) P(120.5 + i * .55, 1.2, sweep(t => [523, 659, 784, 1046][i % 4], t => env(t, .01, .5) * .2), { gain: .5 });
for (let i = 0; i < 6; i++) P(121.2 + i * .8, .1, pop(1600, 29 + i), { gain: .3 });
P(124.5, .3, sparkle(35), { gain: .5 });
for (let t = 127.5; t < 131; t += .07) P(t, .03, tap(3200, 0, t * 99), { gain: .15 });   // teeth chattering
P(130.7, .6, whoosh(.6, 300, 900, 36), { gain: .3 });
// 2-6 crunching the railing, CRACK, creaks, planks falling, the run, the leap
for (const t of [139.5, 139.8, 149.5, 149.8, 160.0, 160.3]) P(t, .25, crunch(Math.round(t * 5)), { gain: .5 });
P(141.2, .2, squeak(1100, .2, 37), { gain: .3 });
P(152.0, .5, (() => { const th = thud(200, .04, 28), c = crunch(29); return t => th(t) + c(t); })(), { gain: 1.1 });
P(152.3, 8, creak(8, 30), { gain: .5 });
P(160.8, .3, eep(2000), { gain: .4 }); P(160.5, .6, thud(80, .2, 38), { gain: .6 });
for (const [i, t] of [[0, 161.0], [1, 161.3], [2, 161.6], [3, 161.9], [4, 162.2], [5, 162.5], [9, 162.4], [8, 162.7], [7, 163.0], [6, 164.5]]) { P(t, .3, crunch(40 + i), { gain: .5 }); P(t + .1, 1.0, whoosh(1.0, 600, 200, 50 + i), { gain: .15 }); }
for (let t = 163.4; t < 164.4; t += .16) P(t, .05, tap(1600, 120, t * 9), { gain: .25 });
P(161.8, .5, whoosh(.5, 500, 2000, 31), { gain: .6 }); P(162.0, .8, motor(.8, 420), { gain: .6 });   // Pip leaps, Sir Lint just makes it
P(164.4, .5, whoosh(.5, 500, 2000, 32), { gain: .6 });                              // Pumpkin's leap
P(165.2, .6, sweep(t => 700 - 300 * t, t => env(t, .01, .5) * .1), { gain: .4 });   // the hang-time "uh oh"
// 2-7 the long fall (wind rising), SPLASH, bloops, the pop, the bubble
P(166, 3.5, (() => { const n = noise(35), bp = new Biquad(); return t => { bp.set('bp', 300 + 400 * t, .8); return bp.run(n()) * fade(t, 3.5, .3, .1) * 2; }; })(), { gain: .5 });
P(169.5, 1.2, splash(36), { gain: 1.2 }); P(169.55, .8, thud(70, .2, 37), { gain: .8 });
for (let t = 171.0; t < 177; t += .55) P(t, .08, sweep(x => 900 + 1800 * x, x => env(x, .001, .03) * .3), { gain: .3 });   // bloop... bloop...
P(180.5, 2.0, sweep(t => 300 + 500 * t, t => env(t, .1, .6) * .12), { gain: .5 });  // the bubble swelling
P(182.5, .2, pop(1400, 38), { gain: .7 }); for (let i = 0; i < 5; i++) P(182.7 + i * .12, .08, pop(2200 + i * 200, 60 + i), { gain: .25 });
P(183.2, .8, thud(50, .4, 39), { gain: .5 });
P(186.0, .4, boing(200, .4), { gain: .4 });
tr.reverb(.16, .9);
tr.write('out/audio/sfx.wav');
