// sfx.mjs: sound effects of "The Sandwich" (times match src/scenes/shots.js). Run: node scripts/sfx.mjs -> out/audio/sfx.wav
import { Track, TAU, bed, thud, whoosh, tap, squeak, sweep, env, fade, noise, Biquad, boing, pop, poof, crunch, chomp, chirp, splash, drip, blub } from '../../../engine/audio/synth.mjs';

const DUR = 45, tr = new Track(DUR), put = (t, len, g, o) => tr.put(t, len, g, o);
const plop = (f, s) => { const p = pop(f, s), th = thud(140, .04, s); return t => p(t) * .8 + th(t) * .4; };
const ting = (f = 2637, d = .5) => sweep(t => f, t => env(t, .002, d) * .5);
const whistle = (t0, len) => sweep(t => 1500 + 300 * Math.sin((t + t0) * 7) + 200 * Math.sin((t + t0) * 2.3), t => fade(t, len, .05, .1) * .18);
const slurp = len => { const n = noise(31), bp = new Biquad(); return t => { bp.set('bp', 300 + 900 * (t / len), 3); return bp.run(n()) * fade(t, len, .05, .1) * 2; }; };
const creak = len => sweep(t => 140 + 60 * Math.sin(t * 9) + 80 * t / len, t => fade(t, len, .05, .1) * .25);
const hic = s => { const sw = sweep(t => 700 - 400 * t / .15, t => fade(t, .15, .005, .04) * .45), th = thud(160, .03, s); return t => sw(t) + th(t) * .5; };

put(0, DUR, bed(260, 1, .18), { gain: .3, loop: true });
// 01 stacking: plops rising in pitch, the TING on top (and the same first plop at the end of the film is in the next loop)
for (let i = 0; i < 12; i++) put(.3 + i * .24 + .2, .2, plop(500 + i * 70, i + 1), { gain: .55 });
put(3.0, .8, ting(2637, .6), { gain: .5, send: .4 }); put(3.1, .8, ting(3520, .5), { gain: .35, send: .4 });
// 02 peeking, pupils, drool
put(3.6, .5, sweep(t => 300 + 300 * t, t => fade(t, .5, .05, .1) * .2), { gain: .4 });
put(4.6, .4, thud(60, .3, 3), { gain: .7 }); put(5.4, 1.4, slurp(1.4), { gain: .35 });
for (const t of [6.0, 6.5]) put(t, .1, drip(900), { gain: .3 });
// 03 whistling stroll, swipe, the plate spins, SLAP, tomato SPLAT, slides off
put(7.0, 1.6, whistle(0, 1.6), { gain: .7 });
for (let t = 7.0; t < 8.5; t += .3) put(t, .05, tap(1500, 110, t * 100), { gain: .25 });
put(8.8, .3, whoosh(.3, 500, 2000, 4), { gain: .5 }); put(8.85, .25, sweep(t => 900 + 1600 * t, t => fade(t, .25, .01, .05) * .25), { gain: .4 });
put(9.05, .2, (() => { const n = noise(5), bp = new Biquad().set('bp', 1200, 1); return t => bp.run(n()) * env(t, .001, .03) * 2.4; })(), { gain: .8 });
put(9.35, .3, splash(6), { gain: .5 }); put(11.0, .6, sweep(t => 500 - 300 * t, t => fade(t, .6, .05, .2) * .2), { gain: .3 });
// 04 spy plucks are in the music; the reel clicks, the snag, the reel-in
for (let t = 12.4; t < 14.2; t += .12) put(t, .03, tap(3500, 0, t * 100), { gain: .2 });
put(14.7, .15, tap(2500, 0, 7), { gain: .5 }); put(14.75, .4, squeak(1400, .35, 8), { gain: .35 });
for (let t = 14.8; t < 15.6; t += .06) put(t, .03, tap(3200, 0, t * 77), { gain: .25 });
// 05 lowering, hop down, the cracker rolls, Pip dashes off; the jaw creaks open, drumroll (music), silence, GULP
for (let t = 18.0; t < 18.6; t += .1) put(t, .03, tap(3200, 0, t * 55), { gain: .2 });
put(19.1, .2, thud(90, .08, 9), { gain: .5 });
for (let t = 19.2; t < 20.5; t += .09) put(t, .04, tap(1900, 0, t * 100), { gain: .2 });
put(19.9, .6, whoosh(.6, 600, 2200, 10), { gain: .4 });
put(21.2, 1.8, creak(1.8), { gain: .6 });
put(23.35, .5, (() => { const s = sweep(t => 260 - 200 * t / .4, t => fade(t, .4, .005, .1) * .7), th = thud(70, .15, 11); return t => s(t) + th(t); })(), { gain: 1 });
put(23.55, .5, poof(12), { gain: .5 }); put(23.6, .5, boing(150, .5), { gain: .4 });
// 06 Pip runs back; the empty plate; a happy burp-purr; Pip fumes
for (let t = 24.4; t < 25.4; t += .15) put(t, .04, tap(2800, 0, t * 77), { gain: .2 });
put(26.0, .3, sweep(t => 1200 - 500 * t, t => env(t, .01, .1) * .3), { gain: .35 });
for (let t = 28.6; t < 30; t += .2) put(t, .15, (() => { const n = noise(t * 10), hp = new Biquad().set('hp', 3000, .7); return u => hp.run(n()) * fade(u, .15, .02, .08) * .9; })(), { gain: .3 });
// 07 the hiccups: Pip's stomps + HIC + each layer plopping on the plate
put(30.2, .4, whoosh(.4, 600, 1600, 13), { gain: .3 });
[30.6, 31.2, 31.75, 32.25, 32.7, 33.05, 33.35, 33.6, 33.85, 34.1, 34.35, 34.6].forEach((h, i) => { put(h, .2, hic(20 + i), { gain: .8 }); put(h + .4, .2, plop(500 + i * 70, 40 + i), { gain: .5 }); if (i < 5) put(h - .02, .1, thud(120, .05, 60 + i), { gain: .5 }); });
put(34.95, .5, poof(14), { gain: .5 }); put(35.0, .6, boing(200, .6), { gain: .45 });
// 08 drips, yuck, the plate slides, the sparkle
for (let t = 36.2; t < 40; t += .6) put(t, .1, drip(800 + (t * 60 % 300)), { gain: .3 });
put(37.0, .5, sweep(t => 400 - 150 * t, t => fade(t, .5, .05, .15) * .25), { gain: .4 });
put(39.8, .5, sweep(t => 300 + 100 * t, t => fade(t, .5, .05, .1) * .2), { gain: .4 });
put(40.3, 1.0, chirp(3400, 8), { gain: .3 }); put(40.3, .8, ting(3136, .5), { gain: .35, send: .4 });
// 09 happy footsteps away, a sigh, the fresh plate clink
for (let t = 41.6; t < 43.0; t += .3) put(t, .05, tap(1500, 110, t * 100), { gain: .25 });
put(41.6, .6, (() => { const n = noise(15), lp = new Biquad().set('lp', 1200, .7); return t => lp.run(n()) * fade(t, .6, .15, .3) * 1.1; })(), { gain: .4 });
put(42.2, .4, ting(2093, .3), { gain: .3 });

tr.reverb(.18, .8);
tr.write('out/audio/sfx.wav');
