// sfx.mjs: sound effects of "Static Zap" (times match src/scenes/shots.js). Run: node scripts/sfx.mjs -> out/audio/sfx.wav
import { Track, TAU, bed, thud, whoosh, squeak, sweep, env, fade, noise, rng, Biquad, boing, pop, poof, clang, chirp } from '../../../engine/audio/synth.mjs';

const DUR = 45, tr = new Track(DUR), put = (t, len, g, o) => tr.put(t, len, g, o);
// electric crackle: sparse sharp clicks through a high-pass, len s
const crackle = (len, seed = 1, rate = .02) => { const n = noise(seed), r = rng(seed + 7), hp = new Biquad().set('hp', 3000, .7); let g = 0; return t => { if (r() < rate) g = 1; g *= .97; return hp.run(n()) * g * fade(t, len, .005, .05) * 1.6; }; };
// a big ZAP: crackle + a falling buzz + a thump
const zapBig = (seed = 1) => { const c = crackle(.6, seed, .08), th = thud(70, .12, seed), bz = sweep(t => 2400 * Math.exp(-t * 6) + 120, t => env(t, .002, .12) * .4); return t => c(t) * 1.2 + th(t) * .8 + bz(t) * Math.sign(Math.sin(TAU * 60 * t)); };
// the balloon squeaking on fur, in time with the rubbing (16 rad/s swing = a squeak every ~0.2 s)
const rub = (t0, len) => { for (let t = t0; t < t0 + len; t += .196) put(t, .14, squeak(700 + (t * 331 % 300), .14, Math.round(t * 50)), { gain: .25 }); };
const pap = s => { const p = pop(500, s), th = thud(140, .04, s); return t => p(t) * .8 + th(t) * .6; };
const bang = () => { const n = noise(91), lp = new Biquad().set('lp', 3000, .7), th = thud(50, .3, 92); return t => lp.run(n()) * env(t, .001, .08) * 2 + th(t) * 1.3; };

put(0, DUR, bed(260, 1, .18), { gain: .3, loop: true });
// 01 squeak squeak... fur rising (a soft crackle)... ZAP
rub(.15, 1.85); put(.8, 1.2, crackle(1.2, 2, .01), { gain: .4 });
put(2.0, .6, zapBig(3), { gain: .8 });
// 02 FWOOMP (the puff), a fizzing hum while he floats, Pip giggles
put(2.55, .6, (() => { const p = poof(4), b = boing(120, .6); return t => p(t) * 1.2 + b(t) * .5; })(), { gain: .9 });
put(3.0, 3.0, crackle(3, 5, .006), { gain: .35 });
put(4.4, .7, chirp(3400, 5), { gain: .2 });
// 03 reach... CRACK at the knob; flash; frazzle; birdies
put(6.0, 1.3, crackle(1.3, 6, .008), { gain: .3 });
put(7.3, .7, zapBig(7), { gain: 1 }); put(7.3, .9, (() => { const c = clang(520); return t => c(t) * .4; })(), { gain: .6 });
put(8.0, 1.2, poof(8), { gain: .3 }); put(8.3, 1.2, chirp(3300, 10), { gain: .22 });
// 04 sock, cracker, remote: whoosh... pap
for (const [t, s] of [[10.0, 11], [10.9, 12], [11.8, 13]]) { put(t, .4, whoosh(.4, 500, 2000, s), { gain: .35 }); put(t + .4, .2, pap(s), { gain: .8 }); }
// 05 the shake (rapid flaps), more junk, Pip flies in, "Help!"
for (let t = 14.2; t < 16.3; t += .072) put(t, .05, (() => { const n = noise(Math.round(t * 99)), bp = new Biquad().set('bp', 900, 1); return x => bp.run(n()) * env(x, .002, .02) * 1.4; })(), { gain: .35 });
for (const [t, s] of [[14.6, 14], [15.1, 15], [15.6, 16], [16.0, 17], [16.1, 18]]) { put(t, .4, whoosh(.4, 500, 2000, s), { gain: .3 }); put(t + .4, .2, pap(s), { gain: .7 }); }
put(16.4, .4, whoosh(.4, 700, 2600, 19), { gain: .45 }); put(16.8, .25, pap(20), { gain: .9 }); put(16.85, .3, squeak(1800, .25, 21), { gain: .3 });
// 06 the junk ball rolls left, then right, BONK into the chair, rolls back
put(19.2, 2.3, (() => { const n = noise(22), lp = new Biquad().set('lp', 250, .8); return t => lp.run(n()) * fade(t, 2.3, .1, .3) * 2.2 * (1 + .5 * Math.sin(t * 18)); })(), { gain: .6 });
put(20.3, .6, (() => { const th = thud(65, .25, 23), b = boing(110, .6); return t => th(t) * 1.2 + b(t) * .6; })(), { gain: 1 });
// 07 the balloon drifts by (a thin whistle)... the claw (one tiny crackle). Otherwise silence.
put(25.2, 2.4, sweep(t => 1200 + 200 * Math.sin(t * 2), t => fade(t, 2.4, .6, .6) * .05), { gain: .5 });
put(27.6, .25, sweep(t => 3800, t => env(t, .001, .03) * .2), { gain: .5 });
// 08 poke... BANG. Everything flies (whooshes). A beat of silence.
put(29.1, .05, (() => { const n = noise(24); return t => n() * env(t, .0005, .006); })(), { gain: .6 });
put(29.15, 1.0, bang(), { gain: 1.1 }); put(29.15, .7, zapBig(25), { gain: .8 });
for (let i = 0; i < 4; i++) put(29.2 + i * .06, .7, whoosh(.7, 2400, 400, 26 + i), { gain: .3, pan: i % 2 ? .5 : -.5 });
put(29.6, .5, sweep(t => 900 - 600 * t / .5, t => fade(t, .5, .02, .1) * .15), { gain: .4 });   // the fur deflating
put(30.85, .3, thud(180, .05, 40), { gain: .5 }); put(31.4, .9, sweep(t => 900 - 500 * t, t => fade(t, .9, .05, .2) * .08), { gain: .5 });   // sock plop, slide
// 09 PUMF: Pip lands as a puffball, crackling
put(32.5, .45, sweep(t => 1800 - 1300 * t / .45, t => fade(t, .45, .01, .05) * .25), { gain: .4 });
put(32.95, .5, (() => { const p = poof(30), th = thud(160, .06, 31); return t => p(t) * .8 + th(t); })(), { gain: .8 });
put(33.0, 5.0, crackle(5, 32, .01), { gain: .35 });
put(36.4, .3, sweep(t => 600 + 900 * t, t => env(t, .01, .1) * .2), { gain: .3 });   // the smirk
// 10 the slow reach... "Boop." CRACK! Pip puffs up double
put(38.6, 1.6, sweep(t => 300 + 200 * t, t => fade(t, 1.6, .3, .2) * .05), { gain: .5 });
put(40.6, .7, zapBig(33), { gain: 1 }); put(40.65, .5, (() => { const p = poof(34), b = boing(200, .5); return t => p(t) + b(t) * .6; })(), { gain: .8 });
put(41.0, 1.0, crackle(1, 35, .015), { gain: .35 });
// 11 a new balloon pops out of nowhere (pop), lowered onto the sleeping head (the rubbing starts at 0.15 of the next loop)
put(42.3, .2, pop(1200, 36), { gain: .6 });
put(43.2, 1.4, sweep(t => 500 + 100 * t, t => fade(t, 1.4, .2, .3) * .04), { gain: .5 });

tr.reverb(.18, .8);
tr.write('out/audio/sfx.wav');
