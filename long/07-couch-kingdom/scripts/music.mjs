// music.mjs: long/07 chapter 1, 205 s. One "tiny adventure" theme (marimba + pizzicato + march drums), arranged per place.
// Sections are in absolute time (titles 0-5, chapter +5, End Screen 185-205). 120 bpm: 1 bar = 2 s.
import { Track, SR, TAU, rng, noise, Biquad, env, fade } from '../../../engine/audio/synth.mjs';

const DUR = 205, BEAT = .5, tr = new Track(DUR);
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const pluck = (f, dur = .3, bright = .5) => { const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 11)); for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1; let i = 0; const d = .5 + bright * .45; return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * d + b * (1 - d)) * .995; i = (i + 1) % n; return a * fade(t, dur, .001, .08); }; };
const marimba = (f, dur = .5) => t => (Math.sin(TAU * f * t) * env(t, .002, .35) + Math.sin(TAU * f * 3.99 * t) * env(t, .001, .04) * .3) * fade(t, dur, .001, .15);
const bass = (f, dur = .4) => t => (Math.sin(TAU * f * t) + .3 * Math.sin(TAU * 2 * f * t)) * env(t, .005, .25) * fade(t, dur, .002, .05) * .9;
const kick = () => t => Math.sin(TAU * 55 * t * (1 + 2 * Math.exp(-t * 40))) * env(t, .002, .12);
const snare = s => { const n = noise(s), bp = new Biquad().set('bp', 1800, .8); return t => bp.run(n()) * env(t, .001, .07) * 1.1; };
const shaker = s => { const n = noise(s), hp = new Biquad().set('hp', 6000, .7); return t => hp.run(n()) * env(t, .004, .03) * .5; };
const pad = (f, dur) => t => (Math.sin(TAU * f * t) + .5 * Math.sin(TAU * f * 1.5 * t) + .3 * Math.sin(TAU * f * 2.01 * t)) * fade(t, dur, .6, .8) * .12;
const N = (t, len, g, o) => tr.put(t, len, g, o);
// the theme (8 eighth notes per bar, 2 bars), in C major / its relatives
const THEME = [[72, 76, 79, 76, 77, 74, 72, 0], [71, 74, 77, 74, 72, 67, 72, 0]];
const BASS = [[48, 55], [43, 50]];
function bars(t0, t1, style, key = 0) {
  for (let t = t0, b = 0; t < t1 - .01; t += 2, b++) {
    const ph = THEME[b % 2], bs = BASS[b % 2];
    if (style === 'mystery') { if (b % 2 === 0) N(t, 4, pad(hz(48 + key), 4), { gain: .7 }); [0, 3, 6].forEach((e, k) => N(t + e * .25, .5, marimba(hz([60, 63, 67][k] + key + 12), .5), { gain: .18, send: .5 })); continue; }
    if (style === 'whoosh') { for (let e = 0; e < 8; e++) N(t + e * .25, .2, pluck(hz(60 + e * 2 + b * 3 + key), .2, .7), { gain: .22 }); N(t, .3, kick(), { gain: .5 }); continue; }
    if (style === 'dark') { if (b % 2 === 0) N(t, 4, pad(hz(36 + key), 4), { gain: 1.0 }); N(t, .3, kick(), { gain: .5 }); N(t + 1, .3, kick(), { gain: .35 }); continue; }
    if (style === 'sneak') { [0, 3, 4, 7].forEach((e, k) => N(t + e * .25, .25, pluck(hz([48, 51, 50, 47][k] + key), .2, .2), { gain: .4 })); for (let e = 0; e < 8; e += 2) N(t + e * .25, .05, shaker(b * 8 + e), { gain: .25 }); continue; }
    // town / march / fanfare: the theme
    ph.forEach((m, e) => { if (m) N(t + e * .25, .3, (style === 'fanfare' ? pluck : marimba)(hz(m + key), .3, .7), { gain: style === 'fanfare' ? .3 : .26, pan: .2, send: .2 }); });
    N(t, .4, bass(hz(bs[0] - 12 + key)), { gain: .45 }); N(t + 1, .4, bass(hz(bs[1] - 12 + key)), { gain: .45 });
    if (style !== 'town') { N(t, .3, kick(), { gain: .55 }); N(t + 1, .3, kick(), { gain: .55 }); N(t + .5, .1, snare(b * 4), { gain: .3 }); N(t + 1.5, .1, snare(b * 4 + 1), { gain: .3 }); if (style === 'fanfare') for (let e = 0; e < 8; e++) N(t + e * .25, .05, snare(900 + b * 8 + e), { gain: .12 }); }
    for (let e = 0; e < 8; e++) N(t + e * .25, .05, shaker(b * 8 + e + 400), { gain: .18, pan: -.3 });
  }
}
// sections: [start, end, style, key]. Gaps = deliberate silence before the big gags.
const C = 5;   // chapter offset
bars(0, 5, 'fanfare', 0);                   // titles
bars(C + 0, C + 12, 'mystery', 0);          // the cold open + the dark
bars(C + 12, C + 22.4, 'sneak', 0);         // the cracker, the tug   (silence at the POP)
bars(C + 28, C + 44, 'whoosh', 2);          // the slide
bars(C + 46.5, C + 60, 'town', 0);          // Lostland, Sir Lint
bars(C + 61, C + 80, 'town', 0);            // the Chosen One, the tape
bars(C + 80, C + 94.6, 'fanfare', 0);       // the parade, the palace   (silence for the doodle)
bars(C + 97.6, C + 106, 'town', 0);
bars(C + 108, C + 119.6, 'march', 0);       // the ceremony
bars(C + 124.4, C + 127.2, 'march', 0);     // (silence for the crown gag and the trip)
bars(C + 130, C + 152.4, 'fanfare', 5);     // magic, cheers   (silence at the buckle)
bars(C + 155, C + 176, 'dark', 0);          // the Dragon
bars(185, 205, 'town', 0);                  // End Screen
tr.reverb(.22, 1);
tr.write('out/audio/music.wav');
