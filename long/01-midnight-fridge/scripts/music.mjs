// music.mjs: "The Midnight Fridge", 120 bpm (1 bar = 2 s, 30 bars per part, 100 bars total). Parts 1-2 (bars 0-59) done.
import { Track, SR, TAU, rng, noise, Biquad, env, fade } from '../../../engine/audio/synth.mjs';

const BPM = 120, BEAT = .5, BAR = 2, E8 = .25, DUR = 200, tr = new Track(DUR);
const hz = m => 440 * Math.pow(2, (m - 69) / 12), N = (b, e, len, g, o) => tr.put(b * BAR + e * E8, len, g, o);
function pluck(f, dur = .4, bright = .5) { const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 11)); for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1; let i = 0; const d = .5 + bright * .45; return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * d + b * (1 - d)) * .995; i = (i + 1) % n; return a * fade(t, dur, .001, .1); }; }
const bass = (f, dur = .3) => t => (Math.sin(TAU * f * t) + .35 * Math.sin(TAU * 2 * f * t)) * env(t, .005, .2) * fade(t, dur, .002, .05) * .9;
const marimba = (f, dur = 1) => t => (Math.sin(TAU * f * t) * env(t, .002, .4) + Math.sin(TAU * f * 3.99 * t) * env(t, .001, .04) * .3) * fade(t, dur, .001, .2);
const pad = (f, dur) => t => (Math.sin(TAU * f * t) + .5 * Math.sin(TAU * f * 1.5 * t)) * fade(t, dur, .5, .5) * .15;
const hat = s => { const n = noise(s), hp = new Biquad().set('hp', 7000, .7); return t => hp.run(n()) * env(t, .002, .02) * .5; };
const snare = s => { const n = noise(s), bp = new Biquad().set('bp', 1800, .8); return t => bp.run(n()) * env(t, .001, .06) * 1.1; };
const kick = () => t => Math.sin(TAU * 55 * t * (1 + 2 * Math.exp(-t * 40))) * env(t, .002, .12);
const SPY = [52, 0, 55, 52, 58, 0, 57, 55];
const silent = t => (t >= 10.3 && t < 11.5) || (t >= 21.0 && t < 22.0) || (t >= 34.0 && t < 35.2) || (t >= 38.5 && t < 39.0) || (t >= 56.4 && t < 58.4);
const at = (b, e) => b * BAR + e * E8;
function spy(b, up = 0) { SPY.forEach((m, e) => { if (m && !silent(at(b, e))) N(b, e, .22, pluck(hz(m + up), .2, .45), { gain: .4, pan: -.2 }); }); [0, 4].forEach(e => !silent(at(b, e)) && N(b, e, .3, bass(hz(40 + up)), { gain: .45 })); for (let e = 1; e < 8; e += 2) if (!silent(at(b, e))) N(b, e, .05, hat(b * 8 + e), { gain: .15 }); }

// ---------- PART 1 (bars 0-29) ----------
N(0, 0, 4, pad(hz(45), 4), { gain: .6 });                                         // 0-4 the dark fridge drone
for (let b = 2; b <= 6; b++) spy(b);                                              // 4-14 the plan (stops for the growl)
for (let b = 7; b <= 10; b++) for (let e = 0; e < 8; e++) if (!silent(at(b, e))) N(b, e, .5, marimba(hz([72, 76, 79, 84][e % 4] + (b % 2) * 2), .5), { gain: .28, send: .5 });   // 14-22 the dream
for (let b = 12; b <= 15; b++) { [72, 0, 76, 74, 72, 0, 67, 0].forEach((m, e) => m && N(b, e, .25, pluck(hz(m - (b % 2) * 2), .25, .7), { gain: .32, send: .2 })); [0, 4].forEach(e => N(b, e, .2, kick(), { gain: .5 })); [2, 6].forEach(e => N(b, e, .1, snare(b * 8 + e), { gain: .25 })); }   // 24-32 dress-up
for (let b = 16; b <= 21; b++) { if (b >= 17 && b <= 18) { [0, 3, 6].forEach((e, k) => !silent(at(b, e)) && N(b, e, .5, marimba(hz([79, 83, 86][k]), .6), { gain: .25, send: .5 })); } else spy(b, b >= 19 ? 2 : 0); }   // 32-44 sneak / ballet / alarm
for (let b = 22; b <= 25; b++) for (let e = 0; e < 8; e += 2) N(b, e, .3, bass(hz(38)), { gain: .5 });   // 44-52 tension pulse
for (let b = 26; b <= 27; b++) spy(b, 3);                                         // 52-56
N(29, 1, 2.5, pad(hz(38), 2.5), { gain: .6 });                                    // 58-60 the held, ominous note

// ---------- PART 2 (bars 30-59) ----------
const silent2 = t => (t >= 80.2 && t < 80.6) || (t >= 88.5 && t < 89.0) || (t >= 93.0 && t < 93.6) || (t >= 101.8 && t < 104.4) || t >= 112.6;
function spy2(b, up = 0) { SPY.forEach((m, e) => { if (m && !silent2(at(b, e))) N(b, e, .22, pluck(hz(m + up), .2, .45), { gain: .4, pan: -.2 }); }); [0, 4].forEach(e => !silent2(at(b, e)) && N(b, e, .3, bass(hz(40 + up)), { gain: .45 })); for (let e = 1; e < 8; e += 2) if (!silent2(at(b, e))) N(b, e, .05, hat(b * 8 + e), { gain: .15 }); }
spy2(30); spy2(31, 2);                                                                // 60-64 still a lamp
[0, 2, 4].forEach((e, k) => N(32, e, .6, marimba(hz([79, 84, 88][k]), .7), { gain: .3, send: .5 }));   // 64-66 phew
spy2(33, 3);                                                                          // 66-68 the vacuum
for (let b = 34; b <= 37; b++) spy2(b, 5);                                           // 68-76 lasers + Pip's flips
for (let b = 38; b <= 39; b++) for (let e = 0; e < 8; e++) if (!silent2(at(b, e))) N(b, e, .2, pluck(hz(64 + (e % 2)), .18, .6), { gain: .3 });   // 76-80 temptation (trill)
for (let b = 40; b <= 42; b++) { for (let e = 0; e < 8; e++) if (!silent2(at(b, e))) N(b, e, .2, bass(hz(e % 2 ? 46 : 40)), { gain: .45 }); [0, 2, 4, 6].forEach(e => !silent2(at(b, e)) && N(b, e, .2, kick(), { gain: .5 })); }   // 80-86 ALARM chase
for (let b = 43; b <= 45; b++) spy2(b, 2);                                           // 86-92 the fridge
for (let b = 47; b <= 48; b++) spy2(b, 0);                                           // 94-98 frozen (thin) -> shatter
for (let b = 49; b <= 50; b++) [0, 3, 6].forEach((e, k) => !silent2(at(b, e)) && N(b, e, .5, marimba(hz([76, 79, 83][k] + (b % 2) * 2), .6), { gain: .25, send: .5 }));   // 98-101.8 inside the fridge
for (let b = 52; b <= 53; b++) spy2(b, 7);                                           // 104-108 cake falls
for (let b = 54; b <= 55; b++) { [72, 0, 76, 74, 72, 0, 67, 0].forEach((m, e) => m && !silent2(at(b, e)) && N(b, e, .25, pluck(hz(m + 2), .25, .7), { gain: .32, send: .2 })); [0, 4].forEach(e => N(b, e, .2, kick(), { gain: .5 })); [2, 6].forEach(e => N(b, e, .1, snare(b * 8 + e), { gain: .25 })); }   // 108-112 victory dance
N(56, 2.6, 1.0, bass(hz(28), 1.0), { gain: .6 });                                    // the THUNK
N(57, 0, 6, pad(hz(38), 6), { gain: .55 });                                           // 114-120 dark, ominous

tr.reverb(.25, 1);
tr.write('out/audio/music.wav');
