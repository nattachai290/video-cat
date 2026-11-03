// sfx.mjs: sound effects of "The Robot Vacuum" (times match src/scenes/shots.js). Run: node scripts/sfx.mjs -> out/audio/sfx.wav
import { Track, rng, bed, thud, whoosh, tap, squeak, sweep, env, fade, noise, Biquad, boing, poof, crunch } from '../../../engine/audio/synth.mjs';

const DUR = 50, tr = new Track(DUR), put = (t, len, g, o) => tr.put(t, len, g, o);
// the vacuum's motor: a whiny hum + filtered noise; louder when sucking, smoother and lower in massage mode
const motor = (len, f, suck = 0, smooth = 0) => { const n = noise(Math.round(f)), bp = new Biquad().set('bp', 900 + suck * 1200, .9);
  return t => (Math.sin(2 * Math.PI * f * t) * .25 * (1 - smooth * .5) + Math.sin(2 * Math.PI * f * 2.01 * t) * .12 + bp.run(n()) * (.35 + suck * .6)) * fade(t, len, .3, .3); };
const purr = len => { const n = noise(9), lp = new Biquad().set('lp', 220, .8); return t => lp.run(n()) * (.55 + .45 * Math.sin(t * 2 * Math.PI * 23)) * fade(t, len, .6, .6) * 2.2; };
const beep = (f = 1800) => sweep(t => f, t => (t < .07 ? 1 : 0) * .35);

put(0, DUR, bed(260, 1, .2), { gain: .4, loop: true });
put(0, 1.4, purr(1.4), { gain: .45 }); put(45.8, 4.2, (() => { const p = purr(5.6); return t => p(t); })(), { gain: .45 });   // asleep at both ends (loops)
put(1.2, 3.3, motor(3.3, 140), { gain: .5, pan: .6 }); for (const b of [1.6, 2.4, 3.2]) put(b, .1, beep(2000), { gain: .25, pan: .6 });
put(3.8, .2, thud(120, .06, 2), { gain: .5 });
put(4.5, .5, poof(4), { gain: .8 }); put(4.55, .4, sweep(t => 700 + 2400 * t, t => env(t, .005, .15) * .5), { gain: .5 });   // fur explodes, a yowl-ish rise
put(4.75, .6, whoosh(.6, 400, 2600, 5), { gain: .5, pan: -.4 });
put(5.35, .5, (() => { const n = noise(6), bp = new Biquad().set('bp', 3000, 2); return t => bp.run(n()) * env(t, .002, .12) * 1.3; })(), { gain: .5, pan: -.6 });   // claws into fabric
put(4.5, 5.0, motor(5.0, 140), { gain: .25, pan: .5 });
// 03 Pip surfing; the vacuum sucking crumbs
put(9.0, .3, sweep(t => 500 + 900 * t, t => env(t, .01, .1) * .35), { gain: .35 });
put(9.3, 6.4, motor(6.4, 150, .6), { gain: .45 });
for (let i = 0; i < 9; i++) put(10.6 + i * .5, .12, crunch(i + 30), { gain: .2 });
for (let i = 0; i < 9; i++) put(10.4 + i * .55, .15, sweep(t => 2200 + 1500 * t, t => env(t, .004, .05) * .4), { gain: .25 });   // "sup!" crumb gulps
// 04 the tail: a long rising suction slurp, rubbery stretch
put(15.7, 5.4, motor(5.4, 170, 1), { gain: .55, pan: -.3 });
put(15.9, 4.8, (() => { const s = sweep(t => 300 + 120 * t, t => fade(t, 4.8, .2, .3) * .35); return t => s(t) * (.6 + .4 * Math.sin(t * 25)); })(), { gain: .5, pan: -.3 });
// 05 the rod snaps, the drop, the wild ride
put(21.0, .15, (() => { const n = noise(7), hp = new Biquad().set('hp', 1500, .7); return t => hp.run(n()) * env(t, .001, .03) * 1.5; })(), { gain: .8, pan: -.6 });
put(21.05, .5, whoosh(.5, 2000, 400, 8), { gain: .5, pan: -.5 });
put(21.55, .25, thud(90, .1, 9), { gain: .9 }); put(21.57, .5, boing(180, .5), { gain: .35 });
put(21.7, 8.3, (() => { const m = motor(8.3, 190, .3); return t => m(t) * (.8 + .2 * Math.sin(t * 1.7 * 2)); })(), { gain: .6 });
for (let i = 0; i < 6; i++) put(22.3 + i * 1.18, .5, whoosh(.5, 600, 1800, 10 + i), { gain: .3, pan: i % 2 ? .6 : -.6 });
// 06 the massage: smooth low hum + vibration + purr
put(30.0, 15.8, motor(15.8, 110, 0, 1), { gain: .4 });
put(31.6, 14.2, (() => { const n = noise(11), lp = new Biquad().set('lp', 120, .8); return t => lp.run(n()) * (.5 + .5 * Math.sin(t * 2 * Math.PI * 32)) * fade(t, 14.2, 1, .5) * 1.5; })(), { gain: .35 });
put(35.0, 10.8, purr(10.8), { gain: .5 });
// 07 Pip munching
for (let t = 40.0; t < 41.2; t += .42) put(t, .12, crunch(Math.round(t * 100)), { gain: .3, pan: .5 });
for (let t = 42.6; t < 45.0; t += .42) put(t, .12, crunch(Math.round(t * 100) + 1), { gain: .3, pan: .5 });
// 08 the tilt, the slide off, reversing beeps, gone
put(46.0, .8, squeak(500, .8, 12), { gain: .2 }); put(46.8, .2, thud(80, .08, 13), { gain: .4 });
for (let i = 0; i < 4; i++) put(47.0 + i * .45, .1, beep(1500), { gain: .2 * (1 - i / 4), pan: .4 + i * .15 });
put(47.0, 2.2, motor(2.2, 140), { gain: .3, pan: .7 });

tr.reverb(.15, .8);
tr.write('out/audio/sfx.wav');
