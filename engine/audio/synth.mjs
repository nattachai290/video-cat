// synth.mjs: a tiny offline audio toolkit for the stories: every sound is synthesized from noise and waves (no
// samples, no rights issues). Pure functions of time; renders straight to 48 kHz stereo WAV.
//   import { Track, noise, Biquad, env, ... } from '../../engine/audio/synth.mjs';
//   const tr = new Track(52);  tr.put(1.2, 0.3, boing(220), { gain: .8, pan: -.2 });  tr.write('out/audio/sfx.wav');
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

export const SR = 48000, TAU = Math.PI * 2;
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export function rng(seed = 1) { let s = (Math.abs(seed | 0) % 2147483646) + 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
export const noise = seed => { const r = rng(seed); return () => r() * 2 - 1; };
export const env = (t, a, d) => t < 0 ? 0 : t < a ? t / a : Math.exp(-(t - a) / d);           // attack then exponential decay
export const fade = (t, len, a = .01, r = .05) => clamp(Math.min(t / a, (len - t) / r));       // gate with soft edges

// RBJ biquad filter: new Biquad().set('lp' | 'hp' | 'bp' | 'peak', freq, q, gainDb); call .run(x) per sample.
export class Biquad {
  constructor() { this.x1 = this.x2 = this.y1 = this.y2 = 0; }
  set(type, f, q = .707, db = 0) {
    const w = TAU * clamp(f, 10, SR * .45) / SR, c = Math.cos(w), s = Math.sin(w), a = s / (2 * q), A = Math.pow(10, db / 40);
    let b0, b1, b2, a0, a1, a2;
    if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; a0 = 1 + a; a1 = -2 * c; a2 = 1 - a; }
    else if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; a0 = 1 + a; a1 = -2 * c; a2 = 1 - a; }
    else if (type === 'bp') { b0 = a; b1 = 0; b2 = -a; a0 = 1 + a; a1 = -2 * c; a2 = 1 - a; }
    else { b0 = 1 + a * A; b1 = -2 * c; b2 = 1 - a * A; a0 = 1 + a / A; a1 = -2 * c; a2 = 1 - a / A; }
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0; this.a1 = a1 / a0; this.a2 = a2 / a0; return this;
  }
  run(x) { const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2; this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y; return y; }
}

// A stereo track of a fixed length. put(t0, len, gen) mixes gen(t) (t = seconds since t0, called once per sample in
// order, so generators may keep filter state) into the track with gain, constant-power pan and an optional reverb send.
export class Track {
  constructor(dur) { this.n = Math.ceil(dur * SR); this.L = new Float32Array(this.n); this.R = new Float32Array(this.n); this.sendL = new Float32Array(this.n); this.dur = dur; }
  put(t0, len, gen, { gain = 1, pan = 0, send = 0, loop = false } = {}) {
    const a = (clamp(pan, -1, 1) + 1) * Math.PI / 4, gl = Math.cos(a) * gain, gr = Math.sin(a) * gain;
    const i0 = Math.max(0, Math.round(t0 * SR)), i1 = Math.min(this.n, Math.round((t0 + len) * SR));
    for (let i = i0; i < i1; i++) {
      const v = gen((i - Math.round(t0 * SR)) / SR);
      if (!Number.isFinite(v)) continue;
      this.L[i] += v * gl; this.R[i] += v * gr; if (send) this.sendL[i] += v * gain * send;
    }
    if (loop && t0 + len > this.dur) {   // wrap the tail to the start (for seamless loops)
      const over = t0 + len - this.dur, off = this.dur - t0;
      for (let i = 0; i < Math.round(over * SR); i++) { const v = gen(off + i / SR); if (Number.isFinite(v)) { this.L[i] += v * gl; this.R[i] += v * gr; } }
    }
  }
  // A small room: a few comb filters on the send bus, mixed back in. Call once before write().
  reverb(wet = .25, size = 1) {
    const combs = [1557, 1617, 1491, 1422, 1277, 1356].map(d => Math.round(d * size * SR / 44100));
    const bufs = combs.map(d => new Float32Array(d)), idx = combs.map(() => 0), fb = .78, damp = .3, lp = combs.map(() => 0);
    for (let i = 0; i < this.n; i++) {
      const x = this.sendL[i]; let l = 0, r = 0;
      for (let c = 0; c < combs.length; c++) {
        const b = bufs[c], j = idx[c], y = b[j]; lp[c] = y * (1 - damp) + lp[c] * damp; b[j] = x + lp[c] * fb; idx[c] = (j + 1) % b.length;
        if (c % 2) l += y; else r += y;
      }
      this.L[i] += l * wet / 3; this.R[i] += r * wet / 3;
    }
  }
  normalize(peak = .89) { let m = 0; for (let i = 0; i < this.n; i++) m = Math.max(m, Math.abs(this.L[i]), Math.abs(this.R[i])); if (m > 0) { const g = peak / m; for (let i = 0; i < this.n; i++) { this.L[i] *= g; this.R[i] *= g; } } return this; }
  write(path) {
    mkdirSync(dirname(path), { recursive: true });
    const n = this.n, buf = Buffer.alloc(44 + n * 4);
    buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12); buf.writeUInt32LE(16, 16);
    buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
    buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
    for (let i = 0; i < n; i++) { buf.writeInt16LE(Math.round(clamp(this.L[i], -1, 1) * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(clamp(this.R[i], -1, 1) * 32767), 46 + i * 4); }
    writeFileSync(path, buf); console.log(`wrote ${path} (${this.dur.toFixed(2)} s)`);
  }
}

// ---------- cartoon sound kit (each returns gen(t)) ----------
// Pitch-swept sine: f(t) given as a function; phase is integrated so sweeps stay smooth.
export function sweep(fOf, ampOf) { let ph = 0, last = 0; return t => { ph += TAU * fOf(t) * (t - last); last = t; return Math.sin(ph) * ampOf(t); }; }
// A cartoon spring "boing": a wobbling pitch that settles, with a twangy second partial.
export const boing = (f = 180, len = .7) => { const a = sweep(t => f * (1 + .35 * Math.exp(-t * 5) * Math.sin(t * 38)), t => env(t, .004, len * .35)), b = sweep(t => f * 2.01 * (1 + .3 * Math.exp(-t * 5) * Math.sin(t * 38)), t => .3 * env(t, .004, len * .2)); return t => a(t) + b(t); };
// A low thud (body hits something soft).
export const thud = (f = 70, dec = .12, seed = 3) => { const n = noise(seed), lp = new Biquad().set('lp', 600, .7); return t => Math.sin(TAU * f * t * (1 + .6 * Math.exp(-t * 30))) * env(t, .002, dec) + lp.run(n()) * env(t, .001, .03) * .6; };
// Cork pop: a sharp click and a hollow "pok" that drops in pitch.
export const pop = (f = 900, seed = 5) => { const n = noise(seed), bp = new Biquad().set('bp', 2500, 1.5); const s = sweep(t => f * Math.exp(-t * 9) + 180, t => env(t, .001, .05)); return t => s(t) + bp.run(n()) * env(t, .0005, .012) * 1.4; };
// Whoosh: band-passed noise sweeping up (or down) in pitch and level.
export const whoosh = (len = .5, f0 = 300, f1 = 2400, seed = 7) => { const n = noise(seed), bp = new Biquad(); return t => { const k = clamp(t / len); bp.set('bp', f0 * Math.pow(f1 / f0, k), 1.2); return bp.run(n()) * Math.sin(Math.PI * k) ** 1.5 * 1.6; }; };
// Splash: a noisy burst with a low body, then fizz.
export const splash = (seed = 9) => { const n = noise(seed), lp = new Biquad().set('lp', 1800, .7), hp = new Biquad().set('hp', 3000, .7); return t => lp.run(n()) * env(t, .003, .18) * 1.3 + hp.run(n()) * env(t, .01, .5) * .35 + Math.sin(TAU * 90 * t) * env(t, .002, .08) * .7; };
// Bucket clang: inharmonic metal partials.
export const clang = (f = 420) => { const P = [[1, 1], [2.76, .5], [5.4, .3], [8.93, .18]]; return t => P.reduce((s, [r, a]) => s + Math.sin(TAU * f * r * t) * a * env(t, .001, .6 / r), 0) * .5; };
// One water bubble ("blup"): a short sine chirp upward.
export const blub = (f = 300) => sweep(t => f * (1 + 4 * t), t => env(t, .003, .05));
// Drip: a high plink rising in pitch.
export const drip = (f = 1200) => sweep(t => f * (1 + 2.5 * t), t => env(t, .001, .04) * .7);
// Tiny footstep tap (mouse) or a soft paw (cat): a filtered click with a low body.
export const tap = (f = 2200, body = 180, seed = 11) => { const n = noise(seed), bp = new Biquad().set('bp', f, 2); return t => bp.run(n()) * env(t, .0005, .012) + Math.sin(TAU * body * t) * env(t, .001, .02) * .4; };
// Squelch: a wet footstep.
export const squish = (seed = 13) => { const n = noise(seed), bp = new Biquad(); return t => { bp.set('bp', 500 + 1500 * clamp(t / .12), 2); return bp.run(n()) * env(t, .01, .06) * 1.4; }; };
// Crunch: a cracker bite: grainy bursts.
export const crunch = (seed = 17) => { const n = noise(seed), r = rng(seed + 1), hp = new Biquad().set('hp', 1500, .7); let g = 0; return t => { if (r() < .004) g = 1; g *= .995; return hp.run(n()) * g * env(t, .002, .08) * 1.5; }; };
// Chomp: a big bite (pie).
export const chomp = (seed = 19) => { const c = crunch(seed), th = thud(110, .06, seed); return t => c(t) * .8 + th(t) * .7; };
// Inflate: a rubbery rising tone (belly swelling).
export const inflate = (f0 = 160, f1 = 320, len = .25) => { const s = sweep(t => f0 + (f1 - f0) * clamp(t / len), t => fade(t, len, .01, .06) * .6), s2 = sweep(t => (f0 + (f1 - f0) * clamp(t / len)) * 1.5, t => fade(t, len, .01, .06) * .2); return t => s(t) + s2(t); };
// Burp: a low growl, rough.
export const burp = (len = .45, seed = 23) => { const n = noise(seed), lp = new Biquad().set('lp', 500, 2); return t => { const f = 95 + 25 * Math.sin(t * 9); return (Math.sign(Math.sin(TAU * f * t)) * .5 + lp.run(n()) * .8) * fade(t, len, .03, .12) * (.7 + .3 * Math.sin(t * 60)) * .55; }; };
// Squeak: a rubbery stick-slip squeal (a flap straining, fur against a frame).
export const squeak = (f = 900, len = .3, seed = 29) => { const s = sweep(t => f * (1 + .25 * Math.sin(t * 22)), t => fade(t, len, .02, .08) * (.5 + .5 * Math.abs(Math.sin(t * 70)))); return s; };
// Poof: soft airy burst (fur fluffing up).
export const poof = (seed = 31) => { const n = noise(seed), bp = new Biquad(); return t => { bp.set('bp', 400 + 3000 * clamp(t / .25), .8); return bp.run(n()) * env(t, .02, .25) * 1.6; }; };
// Mouse squeak (Pip's little "eep"): two quick high chirps.
export const eep = (f = 2600) => sweep(t => f * (1 + .3 * Math.sin(Math.min(t, .06) / .06 * Math.PI)), t => (t < .07 ? fade(t, .07, .005, .02) : t > .1 && t < .16 ? fade(t - .1, .06, .005, .02) : 0) * .5);
// A bird chirp (garden ambience).
export const chirp = (f = 3200, n = 3) => sweep(t => f * (1 + .25 * Math.sin(t * 90)), t => { const k = t / .09, i = Math.floor(k); return i < n ? Math.sin(Math.PI * (k - i)) * .35 : 0; });
// Brown-ish noise bed for room tone / breeze, filtered.
export const bed = (lpF = 400, seed = 37, level = .3) => { const n = noise(seed), lp = new Biquad().set('lp', lpF, .5); let y = 0; return t => { y = (y + .02 * n()) * .995; return lp.run(y * 4) * level; }; };
