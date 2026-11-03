// sfx.mjs: every sound effect of "The Cat Flap", placed on the timeline (times match src/scenes/shots.js).
// Run from stories/03-cat-flap:  node scripts/sfx.mjs  ->  out/audio/sfx.wav (52 s, loops)
import { Track, SR, rng, bed, chirp, boing, thud, pop, whoosh, splash, clang, blub, drip, tap, squish, crunch, chomp, inflate, burp, squeak, poof, eep, sweep, env, fade } from '../../../engine/audio/synth.mjs';

const DUR = 52, tr = new Track(DUR), r = rng(42);
const put = (t, len, g, o) => tr.put(t, len, g, o);

// ---------- ambience: kitchen room tone everywhere, garden birds + breeze in the edge-on shots ----------
put(0, DUR, bed(300, 1, .22), { gain: .5, pan: -.1, loop: true });
put(0, DUR, bed(300, 2, .22), { gain: .5, pan: .1, loop: true });
const garden = [[22, 35], [43, 48]];
for (const [a, b] of garden) {
  put(a, b - a, (() => { const g = bed(1200, a, .5); return t => g(t) * fade(t, b - a, .4, .4); })(), { gain: .5, pan: .4 });
  for (let t = a + .4; t < b - .5; t += .9 + r() * 1.6) put(t, .4, chirp(2800 + r() * 1200, 2 + Math.floor(r() * 3)), { gain: .35, pan: .3 + r() * .6, send: .3 });
}
// a kitchen clock, far left, ticking in the quiet kitchen shots (loops cleanly: whole seconds)
for (let t = 0; t < DUR; t++) if (!garden.some(([a, b]) => t >= a && t < b) && !(t >= 9 && t < 14)) put(t + .25, .05, tap(t % 2 ? 3800 : 3200, 0, t), { gain: .18, pan: -.7, send: .3 });

// ---------- 01–02: stuck, Pip arrives munching ----------
for (const w of [.42, 1.0, 1.55]) put(w, .2, squeak(1300 + r() * 300, .12, w * 10), { gain: .12, pan: 0 });   // whisker-twitch squeaks of the flap
for (let t = 4.0; t < 5.3; t += .16) put(t, .05, tap(2600, 220, t * 100), { gain: .35, pan: .5 });              // tiny steps in from the right
const munch = (a, b, pan) => { for (let t = a; t < b; t += 2 * Math.PI / 15) put(t + .02, .12, crunch(Math.round(t * 100)), { gain: .32, pan }); };
munch(4.0, 4.35, .5); munch(8.9, 9.0, .45); munch(49.6, 50.9, .45);
// ---------- 03: flashback ----------
put(8.75, .55, whoosh(.55, 400, 2400, 1), { gain: .5 }); put(13.75, .55, whoosh(.55, 2400, 400, 2), { gain: .5 });
for (const b of [10.0, 10.8, 11.6]) { put(b - .02, .2, chomp(Math.round(b * 10)), { gain: .7 }); put(b + .05, .3, inflate(150 + (b - 10) * 60, 260 + (b - 10) * 90, .25), { gain: .5 }); }
put(12.35, .5, burp(.45), { gain: .65 });
// ---------- 04–05 ----------
put(13.95, .55, whoosh(.5, 2000, 500, 3), { gain: .25 });
put(19.05, .5, boing(520, .45), { gain: .25 });                          // the glance at the empty dish
put(20.15, .3, sweep(t => 500 - 600 * t, t => env(t, .01, .12) * .4), { gain: .4 });   // sheepish droop
// ---------- 06: out of the mouse hole, push ----------
put(22.15, .2, eep(2700), { gain: .45, pan: .1 });
for (let t = 22.2; t < 23.0; t += .13) put(t, .05, tap(2500, 200, t * 100), { gain: .3, pan: .3 });
put(23.3, .06, tap(1800, 300, 5), { gain: .4, pan: .6 });                // the cracker set down
for (let t = 23.6; t < 24.4; t += .14) put(t, .05, tap(2500, 200, t * 100), { gain: .3, pan: .5 });
for (let t = 24.45; t < 27.9; t += .085) put(t, .04, tap(4200, 0, t * 100), { gain: .22, pan: .5 });   // feet scrabbling on the step
put(24.5, 3.4, (() => { const s = squeak(700, 3.4, 4); return t => s(t) * (.4 + .6 * Math.abs(Math.sin(t * 2.3))); })(), { gain: .22, pan: 0 });   // the flap straining
put(25.2, .25, sweep(t => 3000 + 800 * t, t => env(t, .005, .05) * .3), { gain: .3, pan: .5 });         // sweat drop "tink"
// ---------- 07: run-up ----------
for (let t = 28.8; t < 30.6; t += .3) put(t, .06, tap(2200, 160, t * 100), { gain: .35, pan: .6 });      // big exaggerated steps back
put(30.65, .9, sweep(t => 400 + 700 * t, t => fade(t, .9, .05, .2) * .25), { gain: .4, pan: .7 });     // stretch "streeetch" whistle up
put(31.6, .4, sweep(t => 1100 - 900 * t, t => fade(t, .4, .02, .1) * .25), { gain: .4, pan: .7 });    // crouch down
// ---------- 08: charge, BOING, the squeeze gives ----------
for (let t = 32.0; t < 33.6; t += .07 - (t - 32) * .02) put(t, .04, tap(2600, 180, t * 100), { gain: .38, pan: .5 - (t - 32) * .3 });
put(32.4, 1.25, whoosh(1.2, 500, 3200, 4), { gain: .55, pan: .2 });
put(33.6, .2, thud(65, .14, 5), { gain: .9 });
put(33.6, .8, boing(150, .8), { gain: .8 });
put(34.2, .8, squeak(500, .8, 6), { gain: .4 });
// ---------- 09: POP, flight, splash, clang, bubbles ----------
put(35.05, .4, pop(1100, 7), { gain: 1 });
put(35.1, 1.3, (() => { const w = whoosh(1.3, 3000, 500, 8); return t => w(t) * (.7 + .3 * Math.sin(t * 40)); })(), { gain: .5, pan: -.3 });   // spinning flight, right to left
put(36.4, 1.2, splash(9), { gain: .9, pan: -.6, send: .4 });
put(36.42, 1.2, clang(380), { gain: .45, pan: -.6, send: .4 });
for (let i = 0; i < 6; i++) put(36.6 + i * .22, .08, tap(900, 140, i), { gain: .25 * (1 - i / 6), pan: -.6 });   // bucket rattling on the boards
for (let i = 0; i < 5; i++) put(37.6 + i * .25 + r() * .1, .1, blub(250 + r() * 200), { gain: .4, pan: -.6 });
// ---------- 10: out of the bucket ----------
put(39.05, .8, splash(10), { gain: .45, pan: -.3 });
for (let t = 39.7; t < 43; t += .35 + r() * .4) put(t, .1, drip(1100 + r() * 700), { gain: .3, pan: -.3 + r() * .4 });
// ---------- 11: wet stroll out and back; POOF ----------
for (let t = 43.1; t < 44.7; t += .36) put(t, .16, squish(Math.round(t * 10)), { gain: .4, pan: -.4 + (t - 43) * .5 });
for (let t = 45.05; t < 45.9; t += .34) put(t, .16, squish(Math.round(t * 10) + 1), { gain: .4, pan: .4 - (t - 45) * .5 });
put(45.9, .5, poof(31), { gain: .8 });
put(45.92, .5, boing(330, .4), { gain: .35 });
put(46.3, 1.0, squeak(800, 1.0, 9), { gain: .3 });
// ---------- 12 ----------
for (let i = 0; i < 6; i++) put(50.9 + i * .14, .05, tap(2600, 200, 300 + i), { gain: .3, pan: .5 + i * .06 });   // Pip trots off right

tr.reverb(.2, .8);
tr.write('out/audio/sfx.wav');
