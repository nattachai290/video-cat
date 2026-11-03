// sfx.mjs: sound effects of "The Red Dot" (times match src/scenes/shots.js). Run: node scripts/sfx.mjs -> out/audio/sfx.wav
import { Track, TAU, bed, thud, whoosh, tap, squeak, sweep, env, fade, noise, Biquad, boing, pop, poof, crunch, clang, chirp } from '../../../engine/audio/synth.mjs';

const DUR = 45, tr = new Track(DUR), put = (t, len, g, o) => tr.put(t, len, g, o);
const click = s => { const n = noise(s), hp = new Biquad().set('hp', 2500, .7); return t => hp.run(n()) * env(t, .0005, .01) * 2.2; };
const zap = (len = .25) => sweep(t => 3000 + 2000 * t / len, t => fade(t, len, .005, .08) * .18);
const screech = len => sweep(t => 1400 + 300 * Math.sin(t * 60), t => fade(t, len, .01, .05) * .2);
const scramble = (t0, len) => { for (let t = t0; t < t0 + len; t += .055) put(t, .04, tap(900 + (t * 977 % 400), 90, t * 100), { gain: .3 }); };
const boom = () => { const th = thud(55, .4, 3); return t => th(t) * 1.2; };
const hum = len => { const n = noise(41), bp = new Biquad().set('bp', 180, 3); return t => (bp.run(n()) * 1.5 + Math.sin(TAU * 120 * t) * .2) * fade(t, len, .1, .2); };
const wind = len => { const n = noise(43), bp = new Biquad(); return t => { bp.set('bp', 300 + 500 * (1 + Math.sin(t * 3)), .7); return bp.run(n()) * fade(t, len, .3, .3) * 2.2; }; };

put(0, DUR, bed(260, 1, .18), { gain: .3, loop: true });
// 01 CLICK + zap, the pupils BOOM
put(.5, .05, click(1), { gain: .9 }); put(.52, .3, zap(), { gain: .5 });
put(1.55, .6, boom(), { gain: .9 }); put(1.55, .4, sweep(t => 200 + 1600 * t, t => env(t, .005, .15) * .3), { gain: .4 });
// 02 butt wiggle, pounce, SPLAT, Pip giggles
for (let t = 2.6; t < 3.6; t += .12) put(t, .06, tap(1200, 0, t * 100), { gain: .15 });
put(3.6, .5, whoosh(.5, 400, 2200, 4), { gain: .5 }); put(3.9, .2, zap(.15), { gain: .4 });
put(4.1, .35, (() => { const th = thud(80, .12, 5), n = noise(6), lp = new Biquad().set('lp', 900, .7); return t => th(t) + lp.run(n()) * env(t, .002, .06) * 1.2; })(), { gain: 1 });
put(4.15, .8, chirp(3400, 6), { gain: .3 });
// 03 zig-zag: zaps, scrambling paws, skids, the CRASH, cushion flies
for (const t of [6.0, 6.7, 7.4, 8.1]) { put(t, .2, zap(.18), { gain: .35 }); put(t + .3, .3, screech(.3), { gain: .45 }); scramble(t + .3, .25); }
scramble(6.4, 2.0);
put(8.5, .7, whoosh(.7, 300, 1800, 7), { gain: .5 });
put(9.2, .6, (() => { const th = thud(70, .2, 8), c = clang(260); return t => th(t) * 1.2 + c(t) * .3; })(), { gain: 1 }); put(9.22, .5, poof(9), { gain: .5 });
put(9.25, .8, whoosh(.8, 900, 400, 10), { gain: .35 }); put(10.0, .2, thud(120, .06, 11), { gain: .4 });
put(9.6, 1.0, chirp(3200, 8), { gain: .25 });
// 04 up the wall (claws), the stop... silence... fall, THUD
scramble(10.5, .5); for (let t = 11.0; t < 12.0; t += .08) put(t, .04, tap(3200, 0, t * 100), { gain: .25 });
put(12.9, .4, sweep(t => 1500 - 1200 * t / .4, t => fade(t, .4, .01, .05) * .3), { gain: .5 });
put(13.3, .4, thud(60, .2, 12), { gain: 1.1 }); put(13.32, .5, boing(140, .5), { gain: .4 }); put(13.4, .8, chirp(3400, 6), { gain: .25 });
// 05 dot hops on, pounce, the vacuum ROARS off; rodeo bumps; CRASH
put(14.0, .25, zap(.2), { gain: .4 }); put(14.4, .5, whoosh(.5, 400, 2000, 13), { gain: .45 }); put(14.9, .15, thud(100, .06, 14), { gain: .5 });
put(14.9, 3.5, (() => { const h = hum(3.5); return t => h(t) * (1 + .3 * Math.sin(t * 7)); })(), { gain: .7 });
for (let t = 15.2; t < 18.4; t += .43) put(t, .12, thud(110 + (t * 50 % 40), .05, t * 10), { gain: .35 });
put(18.4, .7, (() => { const th = thud(60, .25, 15), c = clang(300); return t => th(t) * 1.3 + c(t) * .5; })(), { gain: 1 }); put(18.45, .6, whoosh(.6, 600, 2400, 16), { gain: .4 });
// 06 he drops in; silence; pupils BOOM; the wiggle
put(19.0, .3, sweep(t => 1600 - 1000 * t / .3, t => fade(t, .3, .01, .05) * .3), { gain: .4 });
put(19.3, .3, thud(70, .15, 17), { gain: 1 }); put(19.6, .2, zap(.15), { gain: .3 });
put(20.4, .6, boom(), { gain: .8 });
for (let t = 21.8; t < 22.5; t += .1) put(t, .05, tap(1200, 0, t * 100), { gain: .18 });
// 07 the chase: feet, whip pan, cracker CRUNCH
scramble(22.5, 2.5); for (let t = 22.5; t < 27.6; t += .14) put(t, .04, tap(2800, 0, t * 77), { gain: .2, pan: .2 });
put(24.85, .35, whoosh(.35, 400, 3000, 18), { gain: .7 });
scramble(25.1, 2.5);
put(25.75, .25, whoosh(.25, 900, 2000, 19), { gain: .3 }); put(26.3, .5, crunch(20), { gain: .9 }); put(26.3, .2, thud(110, .05, 21), { gain: .4 });
put(27.6, .4, screech(.4), { gain: .4 });
for (let t = 28.6; t < 30; t += .11) put(t, .05, tap(1200, 0, t * 100), { gain: .15 });
// 08 click the laser round; the spin winds up
put(30.5, .05, click(2), { gain: .8 }); put(30.52, .2, zap(.2), { gain: .4 });
put(32.2, 2.0, sweep(t => 200 + 600 * t * t, t => fade(t, 2.0, .2, .1) * .25), { gain: .5 });
put(32.4, 1.8, wind(1.8), { gain: .4 });
// 09 TORNADO, the crash, cushion lands, birdies
put(34.0, 2.9, wind(2.9), { gain: .9 });
put(36.8, .7, (() => { const th = thud(60, .25, 22), p = poof(23); return t => th(t) * 1.2 + p(t); })(), { gain: 1 });
put(37.4, .25, thud(140, .06, 24), { gain: .5 }); put(37.5, 2.5, chirp(3300, 18), { gain: .25 });
for (const t of [37.0, 37.15, 37.3]) put(t, .1, tap(1500, 100, t * 100), { gain: .3 });
// 10 sigh, the laser raised (click is at 0.5 of the next loop)
put(40.2, .9, (() => { const n = noise(25), lp = new Biquad().set('lp', 1200, .7); return t => lp.run(n()) * fade(t, .9, .2, .4) * 1.1; })(), { gain: .45 });
put(42.4, .3, sweep(t => 500 + 800 * t, t => env(t, .01, .1) * .3), { gain: .3 });

tr.reverb(.18, .8);
tr.write('out/audio/sfx.wav');
