// sfx.mjs: sound effects of "The Midnight Fridge" (200 s; part 1 = 0-60 done, parts 2-3 to come).
import { Track, TAU, bed, thud, whoosh, tap, squeak, sweep, env, fade, noise, Biquad, boing, pop, poof, clang, crunch, chirp } from '../../../engine/audio/synth.mjs';

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

tr.reverb(.2, .8);
tr.write('out/audio/sfx.wav');
