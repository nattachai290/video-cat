// sfx.mjs: sound effects of "The Midnight Fridge" (200 s; parts 1-3 (0-180) done; the End Screen has no SFX).
import { Track, TAU, bed, thud, whoosh, tap, squeak, sweep, env, fade, noise, Biquad, boing, pop, poof, clang, crunch, chirp, squish, chomp, inflate, blub } from '../../../engine/audio/synth.mjs';

const DUR = 200, tr = new Track(DUR), put = (t, len, g, o) => tr.put(t, len, g, o);
const meow = (f = 560, len = .7) => { const bp = new Biquad().set('bp', 1400, 1.2); let ph = 0, last = 0; return t => { const k = t / len, fq = f * (1 + .7 * Math.sin(Math.PI * Math.min(1, k * 1.4)) - .3 * k); ph += TAU * fq * (t - last); last = t; const saw = (ph / TAU % 1) * 2 - 1; return (bp.run(saw) * 1.6 + Math.sin(ph) * .4) * fade(t, len, .03, .2) * .7; }; };
const hum = (len, f = 60) => { const n = noise(41), lp = new Biquad().set('lp', 200, .7); return t => (Math.sin(TAU * f * t) * .3 + lp.run(n()) * .6) * fade(t, len, .2, .3); };
const growl = len => { const n = noise(43), lp = new Biquad().set('lp', 140, 2); return t => (lp.run(n()) * 3 + Math.sin(TAU * (45 + 15 * Math.sin(t * 9)) * t) * .5) * fade(t, len, .05, .3) * (.7 + .3 * Math.sin(t * 23)); };
const rustle = (seed, len) => { const n = noise(seed), bp = new Biquad().set('bp', 1800, .8); return t => bp.run(n()) * fade(t, len, .05, .1) * (.6 + .4 * Math.sin(t * 17)) * 1.4; };
const scratch = () => { const n = noise(45), bp = new Biquad(); return t => { bp.set('bp', 3000 - 2600 * Math.min(1, t / .35), 3); return bp.run(n()) * fade(t, .45, .005, .1) * 3; }; };
const rip = () => { const n = noise(47), hp = new Biquad().set('hp', 1500, .7); return t => hp.run(n()) * env(t, .002, .12) * (Math.sin(t * 300) > 0 ? 1.4 : .5) * 2; };
const scribble = len => { const n = noise(49), bp = new Biquad().set('bp', 3500, 2); return t => bp.run(n()) * fade(t, len, .02, .05) * (Math.sin(t * 35) > 0 ? 1 : .2) * 1.6; };
const ding = (f = 2093) => sweep(t => f, t => env(t, .002, .5) * .45);
const beep = (f = 1400, len = .12) => sweep(t => f, t => fade(t, len, .005, .02) * .3);
const blubS = i => blub(500 + i * 80);
const choir = len => { const fs = [523, 659, 784]; return t => fs.reduce((s, f) => s + Math.sin(TAU * f * t * (1 + .003 * Math.sin(t * 5))), 0) * fade(t, len, .4, .6) * .12; };

// ---------- PART 1 (0-60) ----------
put(0, 2.2, hum(2.2), { gain: .5 });                                   // fridge hum
for (let t = .6; t < 1.9; t += .25) put(t, .05, tap(2600, 0, t * 100), { gain: .15 });   // creeping paw
put(2.0, .5, (() => { const th = thud(70, .2, 1), c = clang(220); return t => th(t) * 1.4 + c(t) * .4; })(), { gain: 1 });   // SLAM
put(2.05, .8, meow(700, .8), { gain: .8 });                            // yowl
put(2.45, .8, thud(50, .4, 2), { gain: .8 }); put(2.65, .9, ding(1568), { gain: .5, send: .5 });   // title hits
put(4.2, .05, tap(3000, 0, 3), { gain: .5 });                          // flashlight click
put(5.0, 1.3, sweep(t => 500 + 80 * Math.sin(t * 6), t => fade(t, 1.3, .2, .4) * .12), { gain: .5, send: .6 });   // ghost-story "ooo"
put(6.8, .5, whoosh(.5, 400, 2400, 4), { gain: .5 }); put(7.3, .3, (() => { const n = noise(5), bp = new Biquad().set('bp', 900, 1); return t => bp.run(n()) * env(t, .002, .1) * 2; })(), { gain: .6 });   // up the curtain, claws
for (let t = 7.4; t < 9; t += .07) put(t, .04, tap(1200, 0, t * 77), { gain: .08 });   // trembling
put(9.2, .5, rustle(6, .5), { gain: .5 });                             // the plan unrolls
put(10.3, 1.2, growl(1.2), { gain: 1.1 });                             // GRRRWL
put(14.0, .6, sweep(t => 400 + 2400 * t / .6, t => fade(t, .6, .02, .1) * .2), { gain: .5, send: .5 });   // harp into the dream
put(16.6, .8, whoosh(.8, 300, 1600, 7), { gain: .4 });                // the slow-mo flip
put(18.4, 2.6, choir(2.6), { gain: .7, send: .6 });                   // heavenly cake choir
put(21.0, .45, scratch(), { gain: .9 }); put(21.5, .5, rustle(8, .5), { gain: .5 });   // record scratch, crumple
for (let t = 22.0; t < 23.8; t += .28) put(t, .12, crunch(Math.round(t * 10)), { gain: .35 });   // chewing paper
for (let t = 25.4; t < 26.4; t += .2) put(t, .05, tap(2600, 0, t * 100), { gain: .2 });
put(26.4, .4, boing(260, .4), { gain: .5 }); put(26.4, .15, thud(140, .05, 9), { gain: .5 });   // bonk
put(27.0, .6, sweep(t => 180 + 120 * t, t => fade(t, .6, .05, .1) * .2), { gain: .4 });   // stretching the sweater
put(27.6, .3, rip(), { gain: .9 });                                     // RIP
put(28.2, .3, whoosh(.3, 800, 1600, 10), { gain: .3 });                 // scarf swish
put(29.0, .8, scribble(.8), { gain: .5 });                              // crayon moustache
for (let t = 32.0; t < 34.0; t += .25) put(t, .05, tap(1800, 120, t * 100), { gain: .18 });
put(34.0, .5, sweep(t => 260 + 180 * Math.sin(t * 20), t => fade(t, .5, .01, .1) * .35), { gain: .8 });   // floorboard EEK
for (let k = 0; k < 4; k++) { put(35.3 + k * .7, .35, whoosh(.35, 1200, 2400, 11 + k), { gain: .3 }); put(35.5 + k * .7, .4, ding(2637 + k * 200), { gain: .15 }); }   // pirouettes
put(38.5, 1.2, growl(1.2), { gain: 1.1 });                             // GRRRWL again
put(39.0, .6, ding(2093), { gain: .6 }); put(39.2, 14, hum(14, 90), { gain: .35 });   // ding! vacuum wakes; its motor hum
for (let t = 39.6; t < 43.5; t += .09) put(t, .04, tap(1400 + (t * 977 % 600), 0, t * 33), { gain: .2 });   // scrambling
put(47.4, .14, beep(1200), { gain: .6 }); put(47.6, .2, beep(1700, .18), { gain: .6 });   // "?"
put(48.6, .4, whoosh(.4, 2000, 600, 12), { gain: .5 });                // beam whips back
put(52.4, .5, whoosh(.5, 600, 1800, 13), { gain: .4 });                // Pip dives
put(53.4, .4, whoosh(.4, 900, 1400, 14), { gain: .3 }); put(53.9, .15, tap(900, 140, 15), { gain: .4 });   // shade on
put(56.5, 1.4, (() => { const c = clang(330); return t => c(t) * .8; })(), { gain: .6, send: .5 });   // spotlight sting

// ---------- PART 2 (60-120) ----------
put(60.2, 1.6, sweep(t => 900 + 500 * Math.abs(Math.sin(t * Math.PI * 1.5 / 1.6)), t => fade(t, 1.6, .05, .1) * .18), { gain: .6 });   // scan line
put(62.0, .3, whoosh(.3, 800, 1800, 21), { gain: .3 }); put(62.7, .05, tap(3000, 0, 22), { gain: .5 });   // Pip pokes, flashlight click
put(62.75, 1.2, (() => { const c = clang(523); return t => c(t) * .5; })(), { gain: .4, send: .6 });     // the shade lights up
put(63.0, .12, beep(1568), { gain: .7 }); put(63.15, .2, beep(2093, .18), { gain: .7 });                   // ✓
put(63.4, .4, sweep(t => 800 - 600 * t / .4, t => fade(t, .4, .01, .1) * .3), { gain: .5 });             // beam off
put(64.0, .4, (() => { const n = noise(23), lp = new Biquad().set('lp', 900, .7); return t => lp.run(n()) * fade(t, .4, .1, .2) * 1.2; })(), { gain: .5 });   // relieved sigh
put(64.3, .4, ding(3136), { gain: .7 });                                                                   // PING (button)
put(65.35, .1, tap(1500, 300, 24), { gain: 1 });                                                           // POK
put(65.8, .2, beep(900), { gain: .5 }); put(66.0, .2, beep(1200), { gain: .5 });                           // ?
put(66.4, .45, (() => { const n = noise(25), bp = new Biquad(); return t => { bp.set('bp', 300 + 2500 * t / .45, 1.5); return bp.run(n()) * fade(t, .45, .01, .1) * 2; }; })(), { gain: .7 });   // SHLURP
put(66.85, .3, chirp(2600, 2), { gain: .6 });                                                              // happy chirp
put(67.1, .9, whoosh(.9, 300, 1200, 26), { gain: .5 });                                                    // rolls off
put(68.0, .4, (() => { const s = sweep(t => 120, t => (Math.sin(t * 90) > 0 ? 1 : .2) * fade(t, .4, .01, .05) * .3); return s; })(), { gain: .6 });   // lasers flicker on
put(68.4, 7.6, sweep(t => 118, t => fade(t, 7.6, .2, .3) * .06), { gain: .5 });                           // laser hum
for (const tt of [68.5, 69.3, 70.0]) put(tt, .1, tap(1800, 200, tt * 10), { gain: .5 });                   // finger jabs
for (const [tt, k] of [[72.2, 1], [72.95, 2], [73.6, 3]]) put(tt, .55, whoosh(.55, 600, 2800, 27 + k), { gain: .45 });   // flips
put(74.3, .7, chirp(3400, 4), { gain: .4, send: .4 });                                                     // TA-DA sparkle
put(76.4, .3, sweep(t => 2600, t => fade(t, .3, .01, .05) * .12), { gain: .5 });                           // the dot appears
for (let t = 77.0; t < 80.2; t += .08) put(t, .04, tap(1200, 0, t * 91), { gain: .07 });                   // trembling
put(80.2, .4, whoosh(.4, 500, 1800, 31), { gain: .5 }); put(80.6, .5, thud(60, .3, 32), { gain: 1.1 });   // POUNCE, flop
for (let i = 0; i < 6; i++) put(80.7 + i * .35, .2, beep(1800, .18), { gain: .8 });                        // ALARM
put(82.0, .9, (() => { const n = noise(33), bp = new Biquad().set('bp', 1200, 1); return t => bp.run(n()) * fade(t, .9, .02, .2) * 1.5; })(), { gain: .5 });   // dragged across the floor
put(83.0, .5, whoosh(.5, 300, 1500, 34), { gain: .5 }); put(83.0, 2.7, hum(2.7, 90), { gain: .35 });       // vacuum zooms in
put(84.0, .2, beep(900), { gain: .5 }); put(84.2, .2, beep(1200), { gain: .5 });                           // ?
put(85.1, .6, whoosh(.6, 1500, 300, 35), { gain: .5 });                                                    // and off
put(86.3, .4, whoosh(.4, 400, 1600, 36), { gain: .4 }); put(86.8, .15, tap(800, 200, 37), { gain: .6 });    // jump, grab
put(87.3, .9, sweep(t => 300 + 200 * Math.sin(t * 30) + 400 * t, t => fade(t, .9, .05, .2) * .25), { gain: .7 });   // CREEEAK
put(88.2, .3, whoosh(.3, 600, 2000, 38), { gain: .5 });
put(88.5, .4, (() => { const s = squish(39), th = thud(80, .2, 40); return t => s(t) * 1.2 + th(t); })(), { gain: 1.1 });   // SPLAT
put(88.6, 1.0, chirp(3000, 6), { gain: .25 });                                                             // birdies
put(89.0, 1.6, sweep(t => 1400 - 800 * t / 1.6, t => fade(t, 1.6, .05, .2) * .12), { gain: .6 });          // sliiide down the wall
put(90.8, .6, chirp(3600, 3), { gain: .3, send: .5 });                                                     // the cake sparkles
put(92.0, .4, (() => { const n = noise(41); return t => tap(600, 120, 41)(t); })(), { gain: .3 });
put(92.5, 1.0, (() => { const n = noise(42), lp = new Biquad().set('lp', 1500, .7); return t => lp.run(n()) * fade(t, 1.0, .05, .5) * 1.4; })(), { gain: .7 });   // cold blast
put(93.0, .4, (() => { const n = noise(43), hp = new Biquad().set('hp', 2500, .7); return t => hp.run(n()) * env(t, .002, .15) * 2 + Math.sin(TAU * 2600 * t) * env(t, .001, .2) * .3; })(), { gain: .8 });   // KRRK (freeze)
for (let t = 93.4; t < 96; t += .09) put(t, .04, tap(4200, 0, t * 33), { gain: .05 });                     // teeth chattering
for (const tt of [96.15, 96.5, 96.85]) put(tt, .4, ding(3520), { gain: .45 });                             // tink tink tink
put(97.2, .8, (() => { const n = noise(44), hp = new Biquad().set('hp', 2000, .7), c = clang(1800); return t => hp.run(n()) * env(t, .002, .25) * 2 + c(t) * .3; })(), { gain: .9 });   // CRASH
put(97.3, .5, poof(45), { gain: .5 });                                                                     // fur puffs
put(98.0, 14.6, hum(14.6, 120), { gain: .3 });                                                             // inside the fridge
for (let t = 98.2; t < 104.4; t += .5) put(t, .3, (() => { const s = squish(46 + Math.round(t * 2)); return u => s(u) * .8; })(), { gain: .35 });   // jelly squelch
for (const tt of [98.6, 99.3, 100.0, 100.7]) { put(tt, .3, whoosh(.3, 900, 2200, 50 + tt), { gain: .3 }); put(tt + .5, .1, tap(1400, 220, tt * 3), { gain: .5 }); }   // Pip hops up
put(101.8, 3.0, choir(3.0), { gain: .7, send: .6 });                                                       // the cake choir (callback)
put(104.4, .5, (() => { const n = noise(51), bp = new Biquad(); return t => { bp.set('bp', 2000 - 1500 * t / .5, 2); return bp.run(n()) * env(t, .005, .15) * 2.2; }; })(), { gain: .8 });   // SHLOP
put(105.6, .4, (() => { const n = noise(52), bp = new Biquad().set('bp', 900, 1); return t => bp.run(n()) * fade(t, .4, .02, .1); })(), { gain: .4 });   // cake slides
put(106.0, .7, whoosh(.7, 1600, 400, 53), { gain: .4 });
put(106.7, .5, (() => { const th = thud(110, .1, 54), s = squish(55); return t => th(t) + s(t) * .6; })(), { gain: .9 });   // BONK (cake hat)
for (let i = 0; i < 9; i++) put(109.4 + i * .28, .12, tap(i % 2 ? 1200 : 700, 160, 60 + i), { gain: .35 });   // victory dance steps
put(112.0, .6, sweep(t => 250 + 150 * t, t => fade(t, .6, .05, .1) * .25), { gain: .6 });                 // door creak
put(112.6, .8, (() => { const th = thud(55, .4, 61), c = clang(160); return t => th(t) * 1.5 + c(t) * .3; })(), { gain: 1.2 });   // THUNK
for (const tt of [113.3, 113.6, 114.0]) put(tt, .06, tap(3500, 0, tt * 5), { gain: .25 });                // blinks
put(116.6, 1.2, growl(1.2), { gain: 1.1 });                                                                // GRRRWL in the dark
put(117.8, .14, beep(880), { gain: .5 }); put(118.1, 1.8, sweep(t => 70, t => fade(t, 1.8, .3, .4) * .3), { gain: .6 });   // the vacuum outside

// ---------- PART 3 (120-180) ----------
const sirenS = len => { let ph = 0, last = 0; return t => { const f = (Math.floor(t * 2.5) % 2) ? 880 : 660; ph += TAU * f * (t - last); last = t; return (Math.sin(ph) + .3 * Math.sign(Math.sin(ph))) * fade(t, len, .05, .2) * .18; }; };
put(120.4, .7, (() => { const th = thud(60, .35, 70), c = clang(180); return t => th(t) * 1.6 + c(t) * .4; })(), { gain: 1.2 });   // BANG (door rammed open)
put(120.45, 8.2, sirenS(8.2), { gain: .5 });                                                           // siren
put(120.5, 4.0, hum(4.0, 120), { gain: .25 });
put(123.8, .6, sweep(t => 140, t => (Math.sin(t * 200) > 0 ? 1 : -1) * fade(t, .6, .01, .1) * .25), { gain: .8 });   // BZZT ✗
put(124.4, .6, meow(800, .6), { gain: .6 });                                                          // scream
put(125.6, .4, whoosh(.4, 500, 2000, 71), { gain: .4 });                                              // Pip hops on
for (let t = 126.0; t < 126.7; t += .06) put(t, .05, tap(500, 160, t * 50), { gain: .25 });            // legs spinning in the air
put(126.7, .6, whoosh(.6, 300, 2600, 72), { gain: .7 });                                              // ZOOM
put(127.6, 1.0, whoosh(1.0, 400, 1400, 73), { gain: .5 });                                            // vacuum after them
for (let t = 129.0; t < 130.6; t += .12) put(t, .05, tap(1600, 200, t * 31), { gain: .25 });           // running paws on tiles
put(130.6, .6, sweep(t => 2400 - 1200 * t / .6, t => fade(t, .6, .01, .1) * .3), { gain: .7 });       // SKRRT
for (let t = 131.2; t < 131.9; t += .05) put(t, .04, tap(1200, 0, t * 51), { gain: .2 });              // scrabbling
put(129.0, 3.0, sirenS(3.0), { gain: .4 }); put(132.0, 3.0, sirenS(3.0), { gain: .35 }); put(135.0, 3.0, sirenS(3.0), { gain: .3 });
put(132.6, .9, whoosh(.9, 300, 1800, 74), { gain: .5 }); put(133.5, .3, thud(90, .1, 75), { gain: .5 });   // over the armchair
put(133.4, .2, (() => { const p = pop(500, 76), th = thud(80, .1, 77); return t => p(t) + th(t); })(), { gain: .9 });   // POK
put(133.5, 1.4, sweep(t => 600 + 300 * Math.sin(t * 20), t => fade(t, 1.4, .02, .3) * .15), { gain: .6 });   // spinning
put(135.2, .8, whoosh(.8, 400, 1800, 78), { gain: .4 });
for (const tt of [136.0, 136.5, 137.0, 137.5]) put(tt, .3, (() => { const n = noise(80 + tt), bp = new Biquad(); return t => { bp.set('bp', 400 + 3000 * t / .3, 2); return bp.run(n()) * fade(t, .3, .01, .05) * 1.8; }; })(), { gain: .6 });   // fwip
for (let i = 0; i < 8; i++) put(138.0 + i * .25, .25, whoosh(.25, 700, 1300, 90 + i), { gain: .25 });   // round and round
put(140.0, .9, sweep(t => 900 - 600 * t / .9, t => fade(t, .9, .01, .2) * .3), { gain: .7 });        // power-down "wooo"
put(140.1, 1.0, chirp(3200, 6), { gain: .3 });                                                        // dizzy birdies
put(141.0, .4, whoosh(.4, 600, 1600, 95), { gain: .4 }); put(141.4, .5, (() => { const n = noise(96), lp = new Biquad().set('lp', 600, .7); return t => lp.run(n()) * env(t, .005, .15) * 3; })(), { gain: .8 });   // FLUMP
for (let t = 141.5; t < 143; t += .28) put(t, .2, (() => { const n = noise(97 + t), lp = new Biquad().set('lp', 1200, .7); return u => lp.run(n()) * fade(u, .2, .03, .1) * .8; })(), { gain: .35 });   // panting
put(147.4, .5, whoosh(.5, 600, 2200, 98), { gain: .35 });
put(148.0, .3, (() => { const n = noise(99), bp = new Biquad().set('bp', 2200, 1); return t => bp.run(n()) * env(t, .001, .04) * 3; })(), { gain: 1 });   // CLAP
put(148.05, .35, whoosh(.35, 1500, 400, 100), { gain: .4 }); put(148.35, .3, thud(100, .12, 101), { gain: .6 });
put(148.4, 1.0, chirp(3000, 5), { gain: .25 });
put(150.0, .5, (() => { const n = noise(102), bp = new Biquad().set('bp', 900, 1); return t => bp.run(n()) * fade(t, .5, .02, .1) * .6; })(), { gain: .4 });   // cake set down
put(151.4, .3, chomp(103), { gain: .8 });
put(151.5, .8, squeak(1100, .8, 104), { gain: .9 });                                                   // SQUEAK (sponge)
for (let t = 151.9; t < 154.8; t += .25) put(t, .15, squeak(700 + 300 * Math.sin(t * 7), .15, Math.round(t * 10)), { gain: .35 });   // squeaky chewing
for (let i = 0; i < 6; i++) put(155.9 + i * .25, .12, blubS(i), { gain: .35 });                       // bubbles
put(156.6, .9, inflate(200, 700, .9), { gain: .5 });                                                  // Pip blows a big bubble
put(157.5, .15, pop(1400, 105), { gain: .9 });                                                        // POP
put(158.4, .9, (() => { const n = noise(106), bp = new Biquad(); return t => { bp.set('bp', 300 + 2600 * t / .9, 1.5); return bp.run(n()) * fade(t, .9, .02, .1) * 2; }; })(), { gain: .8 });   // SHLURP (the blanket)
put(159.5, .4, (() => { const n = noise(120), lp = new Biquad().set('lp', 500, .7); return t => lp.run(n()) * env(t, .005, .12) * 3; })(), { gain: .8 });   // FLOMP (the cushion walls fall flat)
put(159.3, 1.0, whoosh(1.0, 300, 900, 107), { gain: .35 }); put(159.3, 6.5, hum(6.5, 90), { gain: .25 });
put(160.4, .6, chirp(3600, 4), { gain: .35, send: .5 });                                              // the cake sparkles
// the vacuum's little birthday tune (original): beeps
[[0, 784], [.3, 784], [.6, 880], [1.0, 784], [1.4, 1047], [1.8, 988], [2.6, 784], [2.9, 784], [3.2, 880], [3.6, 784], [4.0, 1175], [4.4, 1047]].forEach(([d, f]) => put(161.0 + d, .28, beep(f, .26), { gain: .55, send: .4 }));
put(166.4, .6, (() => { const n = noise(108), bp = new Biquad().set('bp', 2500, 2); return t => bp.run(n()) * fade(t, .6, .02, .05) * (Math.sin(t * 40) > 0 ? 1 : .3); })(), { gain: .4 });   // marker circles the date
put(166.9, .9, ding(2637), { gain: .5, send: .5 });
put(168.2, 3.0, (() => { const n = noise(109), bp = new Biquad().set('bp', 1800, .8); return t => bp.run(n()) * fade(t, 3.0, .1, .4) * .7; })(), { gain: .5 });   // tear fountains
put(168.5, .6, chirp(2400, 3), { gain: .4 });                                                         // heart
put(172.4, .5, (() => { const n = noise(110), lp = new Biquad().set('lp', 800, .7); return t => lp.run(n()) * fade(t, .5, .2, .05) * .8; })(), { gain: .5 });   // big inhale
put(173.0, .8, whoosh(.8, 300, 2200, 111), { gain: .8 });                                              // FWOOSH
put(173.6, .3, thud(120, .1, 112), { gain: .5 }); put(174.2, .5, whoosh(.5, 900, 2000, 113), { gain: .3 });
for (let t = 174.8; t < 176.6; t += .4) put(t, .3, chomp(114 + Math.round(t * 3)), { gain: .4 });        // eating (real cake)
put(176.8, .7, (() => { const n = noise(115), bp = new Biquad(); return t => { bp.set('bp', 400 + 2400 * t / .7, 1.5); return bp.run(n()) * fade(t, .7, .01, .1) * 2; }; })(), { gain: .7 });   // SHLURP (crumbs off his face)
put(178.0, .6, chirp(2600, 3), { gain: .35 });

tr.reverb(.2, .8);
tr.write('out/audio/sfx.wav');
