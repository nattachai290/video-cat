// music.mjs: the score of "The Cat Flap", written as code and synthesized (plucked strings, marimba, bass, light
// percussion). 24 bars at 110.77 bpm = exactly 52 s, so it loops with the picture.
// Sections follow the shots: groove | flashback (marimba, no drums) | groove | push (tense ostinato) | tiptoe run-up |
// drum roll | silence for the POP | bouncy groove to the end (which leads back into bar 0).
// Run from stories/03-cat-flap:  node scripts/music.mjs  ->  out/audio/music.wav
import { Track, SR, TAU, rng, noise, Biquad, env, fade, sweep } from '../../../engine/audio/synth.mjs';

const BPM = 110.77, BEAT = 60 / BPM, BAR = 4 * BEAT, E8 = BEAT / 2, DUR = 52;
const tr = new Track(DUR), r = rng(7);
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const at = (bar, eighth = 0) => bar * BAR + eighth * E8;

// ---------- instruments ----------
function pluck(f, dur = .6, bright = .5) {   // Karplus-Strong string (pizzicato)
  const n = Math.max(2, Math.round(SR / f)), buf = new Float32Array(n), rr = rng(Math.round(f * 13));
  for (let i = 0; i < n; i++) buf[i] = rr() * 2 - 1;
  let i = 0; const damp = .5 + bright * .45;
  return t => { const a = buf[i], b = buf[(i + 1) % n]; buf[i] = (a * damp + b * (1 - damp)) * .996; i = (i + 1) % n; return a * fade(t, dur, .001, .15); };
}
const marimba = (f, dur = .9) => t => (Math.sin(TAU * f * t) * env(t, .002, .45) + Math.sin(TAU * f * 3.99 * t) * env(t, .001, .05) * .35 + Math.sin(TAU * f * 10 * t) * env(t, .001, .012) * .15) * fade(t, dur, .001, .2);
const bass = (f, dur = .4) => t => (Math.sin(TAU * f * t) + .35 * Math.sin(TAU * 2 * f * t) + .15 * Math.sin(TAU * 3 * f * t)) * env(t, .005, .22) * fade(t, dur, .002, .08) * .9;
const kick = () => sweep(t => 50 + 120 * Math.exp(-t * 30), t => env(t, .001, .12));
const shaker = seed => { const n = noise(seed), hp = new Biquad().set('hp', 6000, .7); return t => hp.run(n()) * env(t, .004, .03) * .6; };
const bongo = f => sweep(t => f * (1 + .3 * Math.exp(-t * 40)), t => env(t, .001, .09));
const snare = seed => { const n = noise(seed), bp = new Biquad().set('bp', 1800, .8); return t => bp.run(n()) * env(t, .001, .06) * 1.2; };

const CH = [[48, 60, 64, 67], [45, 57, 60, 64], [41, 57, 60, 65], [43, 55, 59, 62]];   // C  Am  F  G
const MEL = [[72, 0, 76, 0, 79, 76, 0, 74], [72, 0, 71, 0, 67, 0, 0, 0], [69, 0, 72, 0, 76, 74, 72, 0], [71, 0, 67, 0, 74, 0, 0, 0]];
const N = (bar, e, len, gen, o) => tr.put(at(bar, e), len, gen, o);

for (let b = 0; b < 24; b++) {
  const ch = CH[b % 4], mel = MEL[b % 4];
  const section = b <= 3 ? 'groove' : b <= 6 ? 'flash' : b <= 10 ? 'groove' : b <= 13 ? 'push' : b === 14 ? 'tiptoe' : b === 15 ? 'roll' : b === 16 ? 'rest' : 'groove';
  if (section === 'rest') continue;
  if (section === 'groove') {
    N(b, 0, .5, bass(hz(ch[0] - 12)), { gain: .55 }); N(b, 4, .5, bass(hz(ch[0] - 12)), { gain: .5 }); N(b, 7, .3, bass(hz(ch[0])), { gain: .35 });
    mel.forEach((m, e) => { if (m) N(b, e, .5, pluck(hz(m), .5, .6), { gain: .5, pan: .2, send: .25 }); });
    [1, 3, 5, 7].forEach(e => N(b, e, .35, pluck(hz(ch[1 + (e >> 1) % 3]), .3, .3), { gain: .22, pan: -.3 }));
    [0, 4].forEach(e => N(b, e, .2, kick(), { gain: .55 }));
    for (let e = 0; e < 8; e++) N(b, e, .05, shaker(b * 8 + e), { gain: e % 2 ? .25 : .15, pan: .4 });
    [3, 6].forEach(e => N(b, e, .15, bongo(e === 3 ? 320 : 240), { gain: .3, pan: -.4 }));
  } else if (section === 'flash') {   // dreamy marimba arpeggios, no drums
    for (let e = 0; e < 8; e++) N(b, e, .9, marimba(hz(ch[1 + e % 3] + (e >= 4 ? 12 : 0))), { gain: .35, pan: (e % 3 - 1) * .4, send: .4 });
    N(b, 0, 1.2, bass(hz(ch[0] - 12), 1.2), { gain: .35 });
  } else if (section === 'push') {   // tense: low C pulse every eighth, chromatic creeping line
    for (let e = 0; e < 8; e++) N(b, e, .25, bass(hz(36 + (e % 4 === 3 ? 1 : 0)), .25), { gain: .45 });
    const line = [72, 73, 74, 73][b - 11] ?? 72;
    [0, 2, 4, 6].forEach((e, k) => N(b, e, .3, pluck(hz(line + (k % 2)), .25, .7), { gain: .4, pan: .2 }));
    for (let e = 0; e < 8; e++) N(b, e, .05, shaker(900 + b * 8 + e), { gain: .2, pan: .4 });
  } else if (section === 'tiptoe') {   // big exaggerated steps: staccato low pizz, high answers
    [0, 2, 4, 6].forEach((e, k) => { N(b, e, .2, pluck(hz([48, 52, 55, 59][k]), .18, .2), { gain: .5, pan: -.2 }); N(b, e + 1, .15, pluck(hz([72, 76, 79, 83][k]), .12, .8), { gain: .3, pan: .3 }); });
  } else if (section === 'roll') {   // snare roll building, a rising run
    for (let k = 0; k < 32; k++) N(b, k / 4, .1, snare(2000 + k), { gain: .1 + .5 * k / 32, pan: .1 });
    for (let k = 0; k < 8; k++) N(b, k, .3, pluck(hz(60 + k * 2), .25, .8), { gain: .25 + .3 * k / 8, pan: .2 });
  }
}
tr.reverb(.3, 1);
tr.write('out/audio/music.wav');
