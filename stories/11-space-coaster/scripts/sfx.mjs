// sfx.mjs: sound effects of "The Space Coaster" (times match src/scenes/shots.js). Run: node scripts/sfx.mjs -> out/audio/sfx.wav
import { Track, TAU, bed, thud, whoosh, tap, squeak, sweep, env, fade, noise, Biquad, boing, pop, poof, clang, chirp } from '../../../engine/audio/synth.mjs';

const DUR = 50, tr = new Track(DUR), put = (t, len, g, o) => tr.put(t, len, g, o);
const vortex = len => { const n = noise(3), bp = new Biquad(); return t => { bp.set('bp', 300 + 200 * Math.sin(t * 6), 1.5); return (bp.run(n()) * 1.6 + Math.sin(TAU * (90 + 20 * Math.sin(t * 6)) * t) * .3) * fade(t, len, .3, .4); }; };
const clack = (t0, len, rate = .09, f = 1600) => { for (let t = t0; t < t0 + len; t += rate) put(t, .04, tap(f, 120, t * 100), { gain: .25 }); };
const screech = len => sweep(t => 2200 + 300 * Math.sin(t * 70), t => fade(t, len, .02, .1) * .18);
const roar = len => { const n = noise(9), lp = new Biquad().set('lp', 400, 2); return t => (lp.run(n()) * 2.5 + Math.sin(TAU * (60 + 20 * Math.sin(t * 8)) * t) * .6) * fade(t, len, .1, .3); };
const bonk = () => { const th = thud(180, .05, 11), c = clang(900); return t => th(t) * 1.2 + c(t) * .5; };
const boomFx = () => { const n = noise(13), lp = new Biquad().set('lp', 300, .7), th = thud(40, .8, 14); return t => lp.run(n()) * env(t, .005, .9) * 3 + th(t) * 1.5; };
const warp = len => sweep(t => 200 + 2400 * (t / len) ** 2, t => fade(t, len, .1, .1) * .3);

put(0, DUR, bed(260, 1, .18), { gain: .25, loop: true });
// 01 Rawr is voiced; a tiny "rawr" claw swish
put(.9, .3, whoosh(.3, 800, 2000, 1), { gain: .25 });
// 02 the portal swirls open, wind, the track shoots out, the cart rattles down and SCREECHES to a stop, bat taps
put(3.0, .6, sweep(t => 200 + 900 * t, t => fade(t, .6, .02, .2) * .35), { gain: .5 }); put(3.0, 2.6, vortex(2.6), { gain: .7 });
clack(3.8, .7, .05, 2400); clack(4.4, .8, .07);
put(5.0, .4, screech(.4), { gain: .8 }); put(5.2, .25, thud(90, .1, 4), { gain: .6 });
for (const t of [5.3, 5.62, 5.95]) put(t, .08, tap(900, 150, t * 10), { gain: .4 });
// 03 hop in, lap bar CLACK, BONK the lever, launch WHOOSH, warp
put(8.0, .4, whoosh(.4, 600, 1600, 5), { gain: .3 }); put(8.6, .15, (() => { const c = clang(1200); return t => c(t) * .6; })(), { gain: .5 });
put(8.98, .2, bonk(), { gain: .7 }); put(9.25, 1.0, whoosh(1.0, 300, 2600, 6), { gain: .7 }); put(10.2, .8, warp(.8), { gain: .5 });
// 04 the ride: track rumble, the loop whoosh
put(11, 8, (() => { const n = noise(7), lp = new Biquad().set('lp', 220, .7); return t => lp.run(n()) * fade(t, 8, .2, .3) * 1.8 * (1 + .3 * Math.sin(t * 12)); })(), { gain: .5 });
clack(11, 4, .12); put(15.0, 1.5, whoosh(1.5, 300, 1800, 8), { gain: .5 }); clack(16.5, 2.5, .12);
// 05 monster rises (rumble), ROARS, the star whine, silence, BOOM
put(19.2, 1.4, (() => { const n = noise(15), lp = new Biquad().set('lp', 120, 1); return t => lp.run(n()) * fade(t, 1.4, .3, .3) * 3; })(), { gain: .7 });
put(20.8, 1.2, roar(1.2), { gain: 1 });
put(22.8, .7, sweep(t => 1200 + 2000 * t, t => fade(t, .7, .05, .05) * .25), { gain: .5 });
put(23.5, 1.6, boomFx(), { gain: 1.2 }); put(23.5, .8, poof(16), { gain: .6 });
// 06 fireball whoosh in, BONK, whoosh out, cough, "home run", shockwave, tumble, portal
put(25.3, 1.3, whoosh(1.3, 300, 1400, 17), { gain: .6 });
put(26.6, .4, bonk(), { gain: 1.1 }); put(26.6, .8, whoosh(.8, 1600, 400, 18), { gain: .5 });
put(27.4, .8, (() => { const n = noise(19), bp = new Biquad().set('bp', 500, 1.2); return t => bp.run(n()) * (Math.sin(t * 25) > 0 ? 1 : .3) * fade(t, .8, .02, .2) * 2; })(), { gain: .7 });
put(28.9, .8, boomFx(), { gain: .8 }); put(29.5, 1.3, sweep(t => 900 + 400 * Math.sin(t * 20) - 300 * t, t => fade(t, 1.3, .05, .2) * .25), { gain: .5 });
put(29.4, 1.6, vortex(1.6), { gain: .6 });
// 07 fall, land (tiny thud), GIANT boom-grow, the shadow
put(31.0, .5, sweep(t => 1800 - 1200 * t, t => fade(t, .5, .02, .05) * .25), { gain: .4 }); put(31.5, .1, tap(3000, 0, 20), { gain: .4 });
put(31.8, .6, (() => { const th = thud(50, .4, 21); return t => th(t) * 1.4; })(), { gain: 1 }); put(31.85, .5, boing(80, .5), { gain: .4 });
put(36.4, 1.2, sweep(t => 70 + 10 * t, t => fade(t, 1.2, .3, .3) * .4), { gain: .5 });
for (let t = 33; t < 38; t += .12) put(t, .05, tap(4000, 0, t * 33), { gain: .08 });   // tiny teeth chattering
// 08 CRASH through the wall, scoop, the giant POP-shrink, into the portal, warp tunnel
put(38.6, .8, (() => { const th = thud(60, .3, 22), n = noise(23), bp = new Biquad().set('bp', 900, .8); return t => th(t) + bp.run(n()) * env(t, .002, .25) * 2.2; })(), { gain: 1.1 });
put(39.2, .3, whoosh(.3, 800, 2000, 24), { gain: .4 }); put(39.4, .4, pop(500, 25), { gain: .8 }); put(39.45, .4, poof(26), { gain: .4 });
put(40.4, 1.2, vortex(1.2), { gain: .5 }); put(41.0, .6, whoosh(.6, 400, 2400, 27), { gain: .5 });
put(41.6, 2.4, warp(2.4), { gain: .6 });
// 09 out of the portal, flung into the armchair (FWUMP), birdies, cap tip, cart reverses, portal shrinks POP, hop down
put(44.0, .5, whoosh(.5, 500, 1800, 28), { gain: .4 }); put(45.2, .4, (() => { const n = noise(29), lp = new Biquad().set('lp', 700, .7); return t => lp.run(n()) * env(t, .01, .15) * 2; })(), { gain: .7 });
put(45.3, 2.0, chirp(3300, 14), { gain: .25 });
put(45.7, .25, sweep(t => 900 + 600 * t, t => env(t, .01, .1) * .25), { gain: .3 });
put(46.2, .6, whoosh(.6, 1600, 300, 30), { gain: .4 }); put(46.8, .6, sweep(t => 800 + 2000 * t, t => fade(t, .6, .02, .02) * .25), { gain: .4 });
put(47.35, .3, pop(1200, 31), { gain: .8 });
put(47.8, .15, thud(100, .05, 32), { gain: .4 }); for (let t = 47.8; t < 48.2; t += .13) put(t, .05, tap(1500, 110, t * 100), { gain: .25 });
put(48.4, .5, sweep(t => 500 + 300 * t, t => fade(t, .5, .05, .1) * .15), { gain: .3 });

tr.reverb(.2, .9);
tr.write('out/audio/sfx.wav');
