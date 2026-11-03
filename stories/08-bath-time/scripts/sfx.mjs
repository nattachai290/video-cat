// sfx.mjs: sound effects of "Bath Time" (times match src/scenes/shots.js). Run: node scripts/sfx.mjs -> out/audio/sfx.wav
import { Track, TAU, bed, thud, whoosh, tap, squeak, sweep, env, fade, noise, Biquad, boing, pop, poof, splash, blub, drip, clang } from '../../../engine/audio/synth.mjs';

const DUR = 50, tr = new Track(DUR), put = (t, len, g, o) => tr.put(t, len, g, o);
const meow = (f = 520, len = .7) => { const bp = new Biquad().set('bp', 1400, 1.2); let ph = 0, last = 0; return t => { const k = t / len, fq = f * (1 + .7 * Math.sin(Math.PI * Math.min(1, k * 1.4)) - .3 * k); ph += TAU * fq * (t - last); last = t; const saw = (ph / TAU % 1) * 2 - 1; return (bp.run(saw) * 1.6 + Math.sin(ph) * .4) * fade(t, len, .03, .2) * .7; }; };
const rustle = (seed, len) => { const n = noise(seed), bp = new Biquad().set('bp', 900, .8); return t => bp.run(n()) * fade(t, len, .05, .1) * (.6 + .4 * Math.sin(t * 13)) * 1.2; };
const click = s => { const n = noise(s), hp = new Biquad().set('hp', 2500, .7); return t => hp.run(n()) * env(t, .0005, .008) * 2; };
const scrape = len => { const n = noise(41), bp = new Biquad().set('bp', 260, 2); return t => bp.run(n()) * fade(t, len, .05, .1) * (.6 + .4 * Math.sin(t * 31)) * 2.4; };
const fizz = len => { const n = noise(43), hp = new Biquad().set('hp', 4000, .7); return t => hp.run(n()) * fade(t, len, .05, .2) * (.5 + .5 * Math.random()) * .9; };

put(0, DUR, bed(260, 1, .2), { gain: .35, loop: true });
// 01 horror sting (same at the end), the fur POOF
const sting = () => sweep(t => 110 + 4 * Math.sin(t * 40), t => fade(t, 2.4, .2, .4) * .25);
put(0, 2.5, sting(), { gain: .5 }); put(48.0, 2.0, sweep(t => 110 + 4 * Math.sin(t * 40), t => fade(t, 2.0, .6, .02) * .25), { gain: .5 });
put(2.75, .4, poof(3), { gain: .8 }); put(2.76, .5, boing(300, .5), { gain: .35 });
// 02 the dive under the rug, tiptoes, rug flip, lump moves
put(4.4, .55, whoosh(.55, 400, 2000, 5), { gain: .5 }); put(4.95, .5, rustle(6, .5), { gain: .6 }); put(4.95, .2, thud(90, .08, 6), { gain: .5 });
for (let t = 5.6; t < 8.5; t += .36) put(t, .05, tap(3000, 0, t * 100), { gain: .22 });
put(8.8, .35, whoosh(.35, 600, 1800, 7), { gain: .4 }); put(9.05, .4, rustle(8, .4), { gain: .5 });
put(9.3, .3, sweep(t => 600 + 600 * t, t => env(t, .01, .12) * .3), { gain: .3 });
// 03 footsteps, the POKE, MEOW, the curtain running off
for (let t = 10.2; t < 12.0; t += .3) put(t, .05, tap(2600, 160, t * 100), { gain: .25 });
put(13.35, .15, squeak(1300, .12, 3), { gain: .4 }); put(13.38, .9, meow(560, .8), { gain: .9 });
put(13.7, 1.0, rustle(9, 1.0), { gain: .6 }); for (let t = 13.7; t < 14.6; t += .12) put(t, .05, tap(800, 120, t * 100), { gain: .35 });
put(15.0, .3, sweep(t => 700 - 300 * t, t => env(t, .01, .1) * .25), { gain: .3 });
// 04 walk in, nod, lamp chain CLICK, tail tug, the leap, the shade spinning, landing over Pip
for (let t = 16.0; t < 16.8; t += .2) put(t, .05, tap(2600, 160, t * 100), { gain: .25 });
put(19.45, .05, click(1), { gain: .8 }); put(19.5, .05, click(2), { gain: .5 });
put(20.45, .3, squeak(500, .25, 4), { gain: .3 });
put(20.65, .6, whoosh(.6, 300, 2600, 10), { gain: .6 }); put(20.7, .5, poof(11), { gain: .5 });
put(20.75, 1.5, sweep(t => 900 + 300 * Math.sin(t * 25), t => fade(t, 1.5, .02, .3) * .12), { gain: .4 });
put(22.3, .3, (() => { const c = clang(380), th = thud(140, .06, 12); return t => c(t) * .4 + th(t); })(), { gain: .6 });
// 05 shade tossed, sigh, tub scraped in, bubble bath squirts, the hop, splosh, relax
put(23.2, .5, whoosh(.5, 500, 1500, 13), { gain: .4 });
put(23.7, .7, (() => { const n = noise(14), lp = new Biquad().set('lp', 1200, .7); return t => lp.run(n()) * fade(t, .7, .15, .3) * 1.1; })(), { gain: .45 });
put(24.4, 1.8, scrape(1.8), { gain: .55 });
for (let t = 26.35; t < 26.95; t += .2) put(t, .15, (() => { const n = noise(t * 10), bp = new Biquad().set('bp', 2200, 1); return u => bp.run(n()) * env(u, .005, .05) * 1.5; })(), { gain: .5 });
put(26.4, .9, fizz(.9), { gain: .3 });
put(27.1, .5, whoosh(.5, 600, 1600, 15), { gain: .3 }); put(27.6, .5, splash(16), { gain: .55 });
for (let t = 28.0; t < 31; t += .45) put(t, .1, blub(380 + (t * 37 % 200)), { gain: .12 });
// 06 bubbles pop, creeping, the slip, silence... SPLASH, Pip flung out
for (const t of [31.3, 32.2]) put(t, .25, sweep(u => 300 + 500 * u, u => env(u, .01, .1) * .25), { gain: .3 });
put(31.6, .5, whoosh(.5, 300, 1200, 17), { gain: .35 }); put(32.2, .2, thud(80, .08, 18), { gain: .5 });
put(32.6, .2, pop(1400, 19), { gain: .6 }); put(33.8, .2, pop(1600, 20), { gain: .6 });
for (let t = 34.2; t < 35.2; t += .3) put(t, .05, tap(1600, 110, t * 100), { gain: .2 });
put(36.3, .4, squeak(1500, .35, 21), { gain: .2 });
put(36.8, .2, pop(1000, 22), { gain: .6 }); put(36.82, .45, sweep(t => 1800 - 1400 * t / .45, t => fade(t, .45, .01, .1) * .35), { gain: .5 });
put(37.3, 1.4, splash(23), { gain: 1.1 }); put(37.32, .3, thud(70, .12, 24), { gain: .8 }); put(37.4, 1.0, splash(25), { gain: .5, pan: .4 });
put(37.35, .6, sweep(t => 1200 + 1200 * t, t => fade(t, .6, .02, .1) * .25), { gain: .4, pan: .3 });
// 07 blubs as he rises, drips, the duck SQUEAK, Pip giggles
for (let t = 38.2; t < 39.4; t += .2) put(t, .1, blub(250 + (t * 53 % 150)), { gain: .3 });
for (let t = 39.5; t < 44; t += .55) put(t, .1, drip(1100 + (t * 71 % 500)), { gain: .25 });
put(42.55, .3, squeak(1700, .28, 26), { gain: .5 });
for (let t = 41.6; t < 43.4; t += .16) put(t, .08, sweep(u => 1900 + 300 * Math.sin(u * 50), u => fade(u, .08, .01, .03) * .2), { gain: .3, pan: .3 });
// 08 hop down, brush pick-up, footsteps, the arms-up whoosh
put(44.4, .4, whoosh(.4, 600, 1600, 27), { gain: .3 }); put(44.9, .1, tap(1400, 120, 28), { gain: .35 });
put(45.1, .15, (() => { const n = noise(29), bp = new Biquad().set('bp', 1200, 2); return t => bp.run(n()) * env(t, .002, .03) * 1.4; })(), { gain: .4 });
for (let t = 45.4; t < 46.4; t += .2) put(t, .05, tap(2600, 160, t * 100), { gain: .25 });
put(46.8, .4, whoosh(.4, 400, 2200, 30), { gain: .4 });

tr.reverb(.18, .8);
tr.write('out/audio/sfx.wav');
