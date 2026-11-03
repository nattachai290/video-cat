// music.mjs: "The Royal Bed": mock-royal fanfare + playful pizz, 22 bars at 105.6 bpm = 50 s (loops).
// playful (box) | fanfare (the bed) | stop (he sees the box) | playful | lullaby (Pip in the bed) | jealous low | playful.
import { Track, SR, TAU, rng, noise, Biquad, env, fade, sweep } from '../../../engine/audio/synth.mjs';

const BPM = 105.6, BEAT = 60 / BPM, BAR = 4 * BEAT, E8 = BEAT / 2, DUR = 50, tr = new Track(DUR);
const hz = m => 440 * Math.pow(2, (m - 69) / 12), N = (b, e, len, g, o) => tr.put(b * BAR + e * E8, len, g, o);
function pluck(f, dur = .4, bright = .5) { const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 11)); for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1; let i = 0; const d = .5 + bright * .45; return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * d + b * (1 - d)) * .995; i = (i + 1) % n; return a * fade(t, dur, .001, .1); }; }
const brass = (f, dur = .5) => t => { let s = 0; for (let k = 1; k <= 6; k++) s += Math.sin(TAU * f * k * t) / k * (k === 1 ? 1 : .6); return s * env(t, .03, .4) * fade(t, dur, .02, .1) * .35; };
const marimba = (f, dur = 1.2) => t => (Math.sin(TAU * f * t) * env(t, .002, .55) + Math.sin(TAU * f * 3.99 * t) * env(t, .001, .05) * .3) * fade(t, dur, .001, .25);
const bass = (f, dur = .3) => t => (Math.sin(TAU * f * t) + .35 * Math.sin(TAU * 2 * f * t)) * env(t, .005, .2) * fade(t, dur, .002, .06) * .9;
const hat = s => { const n = noise(s), hp = new Biquad().set('hp', 7000, .7); return t => hp.run(n()) * env(t, .002, .02) * .5; };
const snare = s => { const n = noise(s), bp = new Biquad().set('bp', 1800, .8); return t => bp.run(n()) * env(t, .001, .06) * 1.1; };
const CH = [[48, 64, 67, 72], [45, 64, 69, 72], [41, 65, 69, 72], [43, 62, 67, 71]];   // C Am F G
const PLAY = [72, 0, 76, 74, 72, 0, 67, 0];

for (let b = 0; b < 22; b++) {
  const ch = CH[b % 4];
  const sec = b <= 1 ? 'play' : b <= 4 ? 'fanfare' : b === 5 ? 'stop' : b <= 8 ? 'play' : b <= 12 ? 'play2' : b <= 16 ? 'lull' : b <= 19 ? 'jealous' : 'play';
  if (sec === 'stop') { N(b, 0, 1.5, marimba(hz(84), 1.5), { gain: .2 }); continue; }
  if (sec === 'play' || sec === 'play2') {
    PLAY.forEach((m, e) => { if (m) N(b, e, .35, pluck(hz(m + (b % 4 === 2 ? -3 : b % 4 === 3 ? 2 : 0)), .3, .6), { gain: .38, pan: .2, send: .2 }); });
    [0, 4].forEach(e => N(b, e, .3, bass(hz(ch[0] - 12)), { gain: .45 })); N(b, 7, .2, bass(hz(ch[0])), { gain: .3 });
    for (let e = 1; e < 8; e += 2) N(b, e, .05, hat(b * 8 + e), { gain: .22, pan: .4 });
    if (sec === 'play2') [2, 6].forEach(e => N(b, e, .1, snare(b * 8 + e), { gain: .25 }));
  } else if (sec === 'fanfare') {   // mock-royal brass: ta-ta-taaa
    [[0, 67, .3], [1, 67, .3], [2, 72, .9], [5, 76, .3], [6, 79, 1.0]].forEach(([e, m, d]) => { N(b, e, d, brass(hz(m), d), { gain: .5, send: .4 }); N(b, e, d, brass(hz(m - 12), d), { gain: .3 }); });
    N(b, 0, 1.6, bass(hz(36), 1.6), { gain: .5 }); [0, 2, 4, 6].forEach(e => N(b, e, .1, snare(300 + b * 8 + e), { gain: .25 }));
  } else if (sec === 'lull') {
    for (let e = 0; e < 8; e++) N(b, e, 1.2, marimba(hz(ch[1 + e % 3] + (e >= 4 ? 12 : 0))), { gain: .27, pan: (e % 3 - 1) * .35, send: .45 });
    N(b, 0, 1.8, bass(hz(ch[0] - 12), 1.8), { gain: .38 });
  } else {   // jealous: low, slow, sneaky minor
    [0, 3, 6].forEach((e, k) => N(b, e, .5, pluck(hz([45, 48, 44][k]), .45, .2), { gain: .45, pan: -.2 }));
    N(b, 0, 1.6, bass(hz(33), 1.6), { gain: .35 });
  }
}
tr.reverb(.25, 1);
tr.write('out/audio/music.wav');
