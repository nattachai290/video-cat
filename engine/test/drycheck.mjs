// drycheck.mjs: runs a story's scene/cast code with p5 and p5.brush stubbed out, to catch NaN geometry and runtime
// errors without a browser. It draws nothing. Run from a story folder:
//   node ../../engine/test/drycheck.mjs [loopName ...] [--times=0,1.5,3]
// With loop names it checks those LOOPS; otherwise it checks the timeline at --times (default: every 0.5 s).
import fs from 'fs';
import vm from 'vm';

const args = process.argv.slice(2), loops = args.filter(a => !a.startsWith('--'));
const tArg = args.find(a => a.startsWith('--times='));
const html = fs.readFileSync('studio.html', 'utf8');
const srcs = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]).filter(s => !s.includes('node_modules'));
let bad = 0, calls = 0;
const check = (where, pts) => {
  calls++;
  for (const p of pts) if (!Array.isArray(p) || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) { if (bad++ < 12) console.log(`NaN/bad point in ${where}:`, JSON.stringify(p), new Error().stack.split('\n').slice(3, 6).join(' | ')); return; }
};
const noop = () => {};
let seed = 1; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const brush = new Proxy({}, { get: (_, k) => k === 'polygon' ? pts => check('polygon', pts) : k === 'spline' ? pts => check('spline', pts)
  : k === 'vertex' ? (x, y) => check('vertex', [[x, y]]) : noop });
const ctx = {
  console, Math, JSON, Array, Object, Number, String, Infinity, NaN, isNaN, performance: { now: () => 0 },
  location: { search: '?render' }, document: { fonts: { load: async () => {} }, getElementById: () => null, createElement: () => ({ getContext: () => ({}) }) },
  window: {}, brush, push: noop, pop: noop, translate: noop, rotate: noop, scale: noop, resetMatrix: noop, image: noop,
  random: (a, b) => b === undefined ? (a === undefined ? rnd() : rnd() * a) : a + rnd() * (b - a), randomSeed: s => { seed = (Math.abs(s | 0) % 2147483646) + 1; },
  noiseSeed: noop, noise: () => .5, createGraphics: () => ({ pixelDensity: noop, drawingContext: {}, clear: noop }), createCanvas: noop, pixelDensity: noop, noLoop: noop,
};
ctx.addEventListener = noop; ctx.window = ctx; vm.createContext(ctx);
// the flat engine draws with Canvas2D: give it a stub context whose path calls are checked for NaN
const ctx2d = new Proxy({}, { get: (_, k) => k === 'moveTo' || k === 'lineTo' ? (x, y) => check(k, [[x, y]])
  : (k === 'createRadialGradient' || k === 'createLinearGradient') ? () => ({ addColorStop: noop }) : k === 'measureText' ? () => ({ width: 10 }) : noop, set: () => true });
for (const s of srcs) {
  let code = fs.readFileSync(s, 'utf8');
  // top-level const/let are not visible across vm scripts: make them globals
  code = code.replace(/^(const|let) /gm, 'var ');
  try { vm.runInContext(code, ctx, { filename: s }); } catch (e) { console.log(`load error in ${s}: ${e.message}`); bad++; }
}
if (srcs.some(s => s.includes('flat/core.js'))) vm.runInContext('CTX = __ctx2d', Object.assign(ctx, { __ctx2d: ctx2d }));
const run = (label, fn, t) => { ctx.T = t; ctx.LETTERS = []; ctx.CAM = null; ctx.BOILN = Math.floor(t * 12); ctx.CLAWD_N = 0;
  try { fn(t); } catch (e) { bad++; console.log(`error at ${label} t=${t}: ${e.message}\n  ${e.stack.split('\n').slice(1, 4).join('\n  ')}`); } };
if (loops.length) for (const n of loops) {
  const L = ctx.LOOPS[n]; if (!L) { console.log('no loop', n); bad++; continue; }
  for (let t = 0; t < (L.len || 2); t += .25) run(n, L, t);
} else {
  const times = tArg ? tArg.slice(8).split(',').map(Number) : Array.from({ length: Math.ceil(ctx.DUR * 2) }, (_, i) => i / 2);
  for (const t of times) run('timeline', ctx.drawWorld, t);
}
console.log(`${calls} shapes checked, ${bad} problems`);
process.exit(bad ? 1 : 0);
