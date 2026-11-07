// music.mjs: chapter 2 (205 s). The same "tiny adventure" theme as chapter 1, arranged for the road, the riddles, the reunion
// and the chase. 120 bpm, 1 bar = 2 s. Absolute times (titles 0-5, chapter +5, End Screen 185-205).
import { Track, SR, TAU, rng, noise, Biquad, env, fade } from '../../../../engine/audio/synth.mjs';
const DUR = 205, tr = new Track(DUR), hz = m => 440 * Math.pow(2, (m - 69) / 12), N = (t, len, g, o) => tr.put(t, len, g, o);
const pluck = (f, dur = .3, bright = .5) => { const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 11)); for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1; let i = 0; const d = .5 + bright * .45; return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * d + b * (1 - d)) * .995; i = (i + 1) % n; return a * fade(t, dur, .001, .08); }; };
const marimba = (f, dur = .5) => t => (Math.sin(TAU * f * t) * env(t, .002, .35) + Math.sin(TAU * f * 3.99 * t) * env(t, .001, .04) * .3) * fade(t, dur, .001, .15);
const bass = (f, dur = .4) => t => (Math.sin(TAU * f * t) + .3 * Math.sin(TAU * 2 * f * t)) * env(t, .005, .25) * fade(t, dur, .002, .05) * .9;
const kick = () => t => Math.sin(TAU * 55 * t * (1 + 2 * Math.exp(-t * 40))) * env(t, .002, .12);
const snare = s => { const n = noise(s), bp = new Biquad().set('bp', 1800, .8); return t => bp.run(n()) * env(t, .001, .07) * 1.1; };
const shaker = s => { const n = noise(s), hp = new Biquad().set('hp', 6000, .7); return t => hp.run(n()) * env(t, .004, .03) * .5; };
const pad = (f, dur) => t => (Math.sin(TAU * f * t) + .5 * Math.sin(TAU * f * 1.5 * t) + .3 * Math.sin(TAU * f * 2.01 * t)) * fade(t, dur, .6, .8) * .12;
const THEME = [[72, 76, 79, 76, 77, 74, 72, 0], [71, 74, 77, 74, 72, 67, 72, 0]], BASS = [[48, 55], [43, 50]];
function bars(t0, t1, style, key = 0) {
  for (let t = t0, b = 0; t < t1 - .01; t += 2, b++) {
    const ph = THEME[b % 2], bs = BASS[b % 2];
    if (style === 'mystery') { if (b % 2 === 0) N(t, 4, pad(hz(48 + key), 4), { gain: .7 }); [0, 3, 6].forEach((e, k) => N(t + e * .25, .5, marimba(hz([60, 63, 67][k] + key + 12), .5), { gain: .18, send: .5 })); continue; }
    if (style === 'quiz') { [0, 2, 4, 6].forEach((e, k) => N(t + e * .25, .25, pluck(hz([55, 58, 62, 58][k] + key), .2, .3), { gain: .35 })); N(t, .3, kick(), { gain: .35 }); continue; }
    if (style === 'sweet') { if (b % 2 === 0) N(t, 4, pad(hz(60 + key), 4), { gain: .9 }); ph.forEach((m, e) => { if (m && e % 2 === 0) N(t + e * .25, .8, marimba(hz(m + key), .8), { gain: .2, send: .5 }); }); continue; }
    if (style === 'dark') { if (b % 2 === 0) N(t, 4, pad(hz(36 + key), 4), { gain: 1.0 }); N(t, .3, kick(), { gain: .5 }); continue; }
    ph.forEach((m, e) => { if (m) N(t + e * .25, .3, (style === 'chase' ? pluck : marimba)(hz(m + key), .3, .7), { gain: .26, pan: .2, send: .2 }); });
    N(t, .4, bass(hz(bs[0] - 12 + key)), { gain: .45 }); N(t + 1, .4, bass(hz(bs[1] - 12 + key)), { gain: .45 });
    if (style !== 'town') { N(t, .3, kick(), { gain: .55 }); N(t + 1, .3, kick(), { gain: .55 }); N(t + .5, .1, snare(b * 4), { gain: .3 }); N(t + 1.5, .1, snare(b * 4 + 1), { gain: .3 }); if (style === 'chase') for (let e = 0; e < 8; e++) N(t + e * .25, .05, snare(900 + b * 8 + e), { gain: .14 }); }
    for (let e = 0; e < 8; e++) N(t + e * .25, .05, shaker(b * 8 + e + 400), { gain: .18, pan: -.3 });
  }
}
// absolute clip time: titles 0-5, chapter 5-185, End Screen 185-205
bars(0, 5, 'march', 0);
bars(5, 20, 'march', 0);       // 2-1 the crumb welcome
bars(20, 45, 'mystery', 0);    // 2-2 the Oracle's map
bars(45, 65, 'town', 2);       // 2-3 the road
bars(65, 76, 'dark', 0);       // 2-4 the troll
bars(76, 95, 'quiz', 0);       // the riddles
bars(96, 119, 'mystery', -2);  // 2-5 sobbing, the cape
bars(120.5, 130, 'sweet', 0);  // the reunion
bars(135, 152, 'town', 0);     // 2-6 crossing
bars(152, 166, 'chase', 5);    // CRACK, the collapse, the run
bars(166, 169.5, 'dark', -3);  // the fall
bars(185, 205, 'town', 0);     // End Screen
tr.reverb(.22, 1);
tr.write('out/audio/music.wav');
