// flat/core.js: the flat-cartoon engine. Same page contract as core.js (render.mjs drives it the same way), same helper
// names (paint, inkLine, ellPts, ribbon, camBegin, letter, ...), so scene and cast code runs on either engine. Instead
// of p5.brush watercolour it draws with plain Canvas2D: solid colour, a darker rim of the same hue instead of black ink,
// a soft shadow side on shapes marked shade: true, and clean (non-boiling) lines. Much faster, no GPU needed.
// Load order: config.js, flat/core.js, flat/timeline.js, (clawd.js for emote()), acting.js, cast, scenes.
const W = PROJECT.w || 1920, H = PROJECT.h || 1080;
const BPM = PROJECT.bpm, BEAT = 60 / BPM, OFF = PROJECT.offset || 0, BOIL = 12, DUR = PROJECT.duration;
const TAU = Math.PI * 2;
const PAL = {
  paper: '#F6EBDA', ink: '#2B2233', clay: '#E9865C', clayDk: '#B85A3A', clayLt: '#F6B08E',
  night: '#25285A', indigo: '#36438A', rose: '#EE7F98', ochre: '#F2B33E', sap: '#78B05E',
  teal: '#45A8A2', violet: '#8463B5', cream: '#FFF8EC', sky: '#9BD0F0'
};
// The flat look: how dark a shape's rim is (mixed toward RIM_DARK), and the shadow side.
const FLAT = { rim: .42, rimDark: '#2A1A30', rimW: 2.1, shade: .2, shadeDark: '#3B2340', lineInk: '#2B2233' };

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const backOut = x => { x = clamp(x); const s = 1.9; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const bpOf = t => (t - OFF) / BEAT;
// Seeded by the boil frame, so linework "boils" at BOIL fps like hand-drawn animation.
// Each boil drawing holds for several frames, so whatever isn't moving must draw the same until the next one. But a moving
// thing uses a different amount of randomness each frame, which shifts the stream for everything drawn after it and makes
// that re-boil every frame (jitter). boilSeed(key) restarts the stream from the boil frame and a key (any string or
// number) that's the same every frame: call it before each separate element. clawd() does this for itself and its parts.
let BOILN = 0, CLAWD_N = 0;
const boilSeed = key => { let h = 2166136261; for (const c of key + '|' + BOILN) h = Math.imul(h ^ c.charCodeAt(0), 16777619); randomSeed(h >>> 0); };

// ---------- timing helpers (everything is a pure function of t; no state survives between frames) ----------
const seg = (t, a, b) => clamp((t - a) / (b - a));                 // 0..1 progress of t through [a, b]
const frac = x => x - Math.floor(x);
const beatN = t => Math.floor(bpOf(t));                            // integer beat index
const pulse = (t, k = 6) => Math.exp(-frac(bpOf(t)) * k);          // 1 exactly on each beat, decays after
const pulse2 = (t, k = 6) => Math.exp(-frac(bpOf(t) * 2) * k);     // same on eighth notes
const wob = (t, f = 1, ph = 0) => Math.sin((t * f + ph) * TAU);
const easeIn = x => Math.pow(clamp(x), 3);
const elasticOut = x => { x = clamp(x); return x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (TAU / 3)) + 1; };
// keyframes: kf(t, [[t0, v0], [t1, v1], ...], easeFn). Values may be numbers or arrays of numbers.
function kf(t, keys, e = ease) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i][0]) {
      const [a, va] = keys[i - 1], [b, vb] = keys[i], k = e((t - a) / (b - a));
      return Array.isArray(va) ? va.map((v, j) => lerp(v, vb[j], k)) : lerp(va, vb, k);
    }
  }
  return keys[keys.length - 1][1];
}
// hex color mix
function mixCol(a, b, k) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), c = i => Math.round(lerp((pa >> i) & 255, (pb >> i) & 255, clamp(k)));
  return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1);
}
// small deterministic camera shake, changes at 24 fps
const shakeXY = (t, amt) => { const f = Math.floor(t * 24); return [(hash(f * 1.7) - .5) * 2 * amt, (hash(f * 2.3 + 9) - .5) * 2 * amt]; };

// ---------- motion principles, as pure functions of t ----------
// Damped spring kicked at t0: 0 before, then a wobble that dies away. Use it for secondary motion and settles: a body
// after landing, a hat that jiggles, a stack that sways, a tail that drags. k = damping, w = wobble speed (rad/s).
const spring = (t, t0, k = 6, w = 18) => t < t0 ? 0 : Math.exp(-k * (t - t0)) * Math.sin(w * (t - t0));
const ring = (t, evs, k = 6, w = 18) => evs.reduce((s, e) => s + spring(t, e, k, w), 0);    // one kick per event time
// Hold each drawing for two frames (12 drawings a second), like hand-drawn animation "on twos". Wrap a shot's t in it.
const onTwos = t => Math.floor(t * 12 + 1e-6) / 12;
// Point on a thrown or jumping arc from p0 to p1, peaking h px above the straight line; k = 0..1 along the flight.
const arcPt = (p0, p1, h, k) => [lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k) - h * 4 * k * (1 - k)];
// A hop that takes off at t0 and lands at t1, h body units high: crouch (anticipation), stretch on takeoff,
// round at the top, squash on landing and spring back. Returns { dy, sq } to spread into clawd().
function jump(t, t0, t1, h = 3) {
  if (t < t0 - .12) return { dy: 0, sq: 0 };
  if (t < t0) return { dy: 0, sq: .18 * ease(seg(t, t0 - .12, t0)) };
  if (t < t1) { const k = (t - t0) / (t1 - t0); return { dy: -h * 4 * k * (1 - k), sq: -.16 * Math.abs(1 - 2 * k) }; }
  const a = t - t1; return { dy: 0, sq: .22 * Math.exp(-8 * a) * Math.cos(20 * a) };
}
// A surprise "take" peaking at t0: a quick squash, then a big stretch up that springs back. amt scales it.
function take(t, t0, amt = 1) {
  if (t < t0 - .1) return { sq: 0, dy: 0 };
  if (t < t0) return { sq: .12 * amt * ease(seg(t, t0 - .1, t0)), dy: 0 };
  const a = t - t0; return { sq: -.26 * amt * Math.exp(-6 * a) * Math.cos(16 * a), dy: -1.2 * amt * Math.exp(-7 * a) * Math.max(0, Math.cos(9 * a)) };
}
// Walk from x0 to x1 (px) between t0 and t1, for a character of unit u: eases in and out, faces the way it's
// going in 3/4 view, and faces front when it stops. Returns { x, walk, view, flip, dy } for clawd().
function stroll(t, t0, t1, x0, x1, u) {
  const x = lerp(x0, x1, ease(seg(t, t0, t1))), d = Math.abs(x - x0) / (4 * u), moving = t > t0 && t < t1;
  return { x, walk: d, view: moving ? 'q' : 'front', flip: x1 < x0, dy: moving ? -Math.abs(Math.sin(d * Math.PI)) * .5 : 0 };
}

// ---------- camera ----------
// camBegin(cx, cy, zoom, rot): world point (cx, cy) lands at screen centre. Letters queued while a camera is
// active are placed through it automatically (pass {screen:true} to opt out). One level only: always pair with camEnd().
// LAST_CAM stays set after camEnd(), until the next frame: renderSheet's crops that follow a world point use it.
let CAM = null, LAST_CAM = null;
function camBegin(cx = W / 2, cy = H / 2, zoom = 1, rot = 0) { push(); translate(W / 2, H / 2); rotate(rot); scale(zoom); translate(-cx, -cy); CAM = LAST_CAM = { cx, cy, zoom, rot }; }
function camEnd() { pop(); CAM = null; }
function toScreen(x, y, cam = CAM) {
  if (!cam) return [x, y];
  const c = Math.cos(cam.rot), s = Math.sin(cam.rot), dx = (x - cam.cx) * cam.zoom, dy = (y - cam.cy) * cam.zoom;
  return [W / 2 + dx * c - dy * s, H / 2 + dx * s + dy * c];
}

// ---------- full-frame effects (call outside a camera, in screen space) ----------

// ---------- p5-style transforms and randomness (the cast and scene code calls these) ----------
let CTX = null;
const push = () => CTX.save(), pop = () => CTX.restore();
const translate = (x, y) => CTX.translate(x, y), rotate = a => CTX.rotate(a);
const scale = (x, y = x) => CTX.scale(x, y);
let _seed = 1;
const randomSeed = s => { _seed = (Math.abs(Math.floor(s)) % 2147483646) + 1; };
const random = (a, b) => { _seed = (_seed * 16807) % 2147483647; const r = (_seed - 1) / 2147483646; return b === undefined ? (a === undefined ? r : r * a) : a + r * (b - a); };
// Flat style does not boil: jitter is off (set FLAT.boil > 0 to bring a little wobble back).
FLAT.boil = 0;
const jit = a => FLAT.boil ? (random() * 2 - 1) * a * FLAT.boil : 0;

// ---------- geometry ----------
function rectPts(x, y, w, h, j = 0) {
  return [[x + jit(j), y + jit(j)], [x + w / 2 + jit(j), y + jit(j) * .5], [x + w + jit(j), y + jit(j)],
          [x + w + jit(j) * .5, y + h / 2], [x + w + jit(j), y + h + jit(j)], [x + w / 2 + jit(j), y + h + jit(j) * .5],
          [x + jit(j), y + h + jit(j)], [x + jit(j) * .5, y + h / 2]];
}
function ellPts(cx, cy, rx, ry, n = 28, j = 0, rot = 0) {
  const p = []; for (let i = 0; i < n; i++) { const a = rot + i / n * TAU; p.push([cx + Math.cos(a) * rx + jit(j), cy + Math.sin(a) * ry + jit(j)]); } return p;
}
function rrPts(x, y, w, h, r, j = 0) {
  const p = [], seg = 5, corner = (cx, cy, a0) => { for (let i = 0; i <= seg; i++) { const a = a0 + i / seg * Math.PI / 2; p.push([cx + Math.cos(a) * r + jit(j), cy + Math.sin(a) * r + jit(j)]); } };
  corner(x + w - r, y + r, -Math.PI / 2); corner(x + w - r, y + h - r, 0); corner(x + r, y + h - r, Math.PI / 2); corner(x + r, y + r, Math.PI);
  return p;
}
function starPts(cx, cy, r, inner = .38, n = 4, rot = -Math.PI / 2) {
  const p = []; for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, q = i % 2 ? r * inner : r; p.push([cx + Math.cos(a) * q, cy + Math.sin(a) * q]); } return p;
}
function through(P, n = 6) {
  if (P.length < 3) return P.slice();
  const out = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const u = k / n, u2 = u * u, u3 = u2 * u;
      out.push([0, 1].map(d => .5 * (2 * p1[d] + (p2[d] - p0[d]) * u + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * u3)));
    }
  }
  out.push(P[P.length - 1]);
  return out;
}
function ribbon(P, w0, w1 = w0) {
  const C = through(P), n = C.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = lerp(w0, w1, i / Math.max(1, n - 1)) / 2;
    L.push([C[i][0] - dy / d * w, C[i][1] + dx / d * w]); R.push([C[i][0] + dy / d * w, C[i][1] - dx / d * w]);
  }
  return L.concat(R.reverse());
}
function heartPts(cx, cy, r, n = 22) {
  const p = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; p.push([cx + r * .06 * 16 * Math.pow(Math.sin(a), 3), cy - r * .06 * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a))]); } return p;
}

// ---------- painting ----------
const _rgba = (hex, a) => { const p = parseInt(hex.slice(1), 16); return `rgba(${(p >> 16) & 255},${(p >> 8) & 255},${p & 255},${clamp(a)})`; };
function _path(pts, close = true, curv = 0) {
  const P = curv ? through(close ? pts.concat([pts[0], pts[1]]) : pts, 4) : pts;
  CTX.beginPath(); P.forEach(([x, y], i) => i ? CTX.lineTo(x, y) : CTX.moveTo(x, y)); if (close) CTX.closePath();
}
// paint(pts, o): one flat shape.
//   wash / washOp (0-255)  solid colour (the main fill)       fill / fillOp  a translucent tint (shading, blush, glows)
//   ink (null = no rim)    rim: a darker tone of the shape's own colour; ink: '#hex' other than PAL.ink forces that colour
//   sw                     rim weight (as in the brush engine)  shade: true   adds the shadow side (big shapes)
//   curv                   smooth the outline                  hatch          ignored in flat style
function paint(pts, o = {}) {
  if (!pts || pts.length < 2) return;
  const base = o.wash || o.fill;
  if (o.wash) { _path(pts, true, o.curv); CTX.fillStyle = _rgba(o.wash, (o.washOp ?? 255) / 255); CTX.fill(); }
  if (o.fill) { _path(pts, true, o.curv); CTX.fillStyle = _rgba(o.fill, (o.fillOp ?? 170) / 255 * .75); CTX.fill(); }
  if (o.shade && o.wash) {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    CTX.save(); _path(pts, true, o.curv); CTX.clip();
    CTX.beginPath(); CTX.rect(x0 - 50, y0 - 50, x1 - x0 + 100, y1 - y0 + 100);
    CTX.ellipse((x0 + x1) / 2 - (x1 - x0) * .16, (y0 + y1) / 2 - (y1 - y0) * .12, (x1 - x0) * .6, (y1 - y0) * .6, 0, 0, TAU, true);
    CTX.fillStyle = _rgba(FLAT.shadeDark, FLAT.shade * (o.shadeK ?? 1)); CTX.fill(); CTX.restore();
  }
  if (o.ink !== null && o.ink !== undefined || (o.ink === undefined && !o.fill)) {
    const col = o.ink && o.ink !== PAL.ink ? o.ink : base ? mixCol(base, FLAT.rimDark, FLAT.rim) : FLAT.lineInk;
    _path(pts, true, o.curv); CTX.strokeStyle = col; CTX.lineWidth = (o.sw ?? 1) * FLAT.rimW; CTX.lineJoin = 'round'; CTX.stroke();
  }
}
// inkLine(pts, sw, col, brush, curvature): a clean line (face features, whiskers, stripes). Brush names are ignored.
function inkLine(pts, sw = 1, col = PAL.ink, br = 'ink', curv = .5) {
  if (!pts || pts.length < 2) return;
  _path(pts, false, pts.length > 2 && curv > 0 ? curv : 0);
  CTX.strokeStyle = col === PAL.ink ? FLAT.lineInk : col; CTX.lineWidth = sw * FLAT.rimW * (br === 'inkfine' ? .8 : 1); CTX.lineCap = 'round'; CTX.lineJoin = 'round'; CTX.stroke();
}
function flushBrush() {}

// ---------- light and full-frame effects ----------
function glow(x, y, r, col = '#FFC766', a = 1) {
  if (a <= 0 || r < 1) return;
  const g = CTX.createRadialGradient(x, y, 0, x, y, r);
  [[0, .9], [.2, .65], [.5, .25], [1, 0]].forEach(([s, k]) => g.addColorStop(s, _rgba(col, k * clamp(a))));
  CTX.save(); CTX.globalCompositeOperation = 'lighter'; CTX.fillStyle = g; CTX.fillRect(x - r, y - r, 2 * r, 2 * r); CTX.restore();
}
function flash(k, col = '#FFFDF6') { if (k > .01) { CTX.save(); CTX.setTransform(1, 0, 0, 1, 0, 0); CTX.fillStyle = _rgba(col, k); CTX.fillRect(0, 0, W, H); CTX.restore(); } }
function irisShape(pts, col = PAL.ink) {
  CTX.save(); CTX.beginPath(); CTX.rect(-W, -H, W * 3, H * 3); pts.forEach(([x, y], i) => i ? CTX.lineTo(x, y) : CTX.moveTo(x, y)); CTX.closePath();
  CTX.fillStyle = col; CTX.fill('evenodd'); CTX.restore();
}
function iris(cx, cy, r, col = PAL.ink) { if (r < 4) { CTX.save(); CTX.fillStyle = col; CTX.fillRect(-W, -H, W * 3, H * 3); CTX.restore(); } else irisShape(ellPts(cx, cy, r, r, 48), col); }

// ---------- lettering (subtitles, sheet labels) ----------
let LETTERS = [];
function letter(txt, x, y, size, color, o = {}) {
  if (CAM && !o.screen) { [x, y] = toScreen(x, y); size *= CAM.zoom; o = { ...o, rot: (o.rot || 0) + CAM.rot }; if (o.font) o.font = o.font.replace(/(\d+(\.\d+)?)px/, (m, v) => (v * CAM.zoom) + 'px'); }
  LETTERS.push({ txt, x, y, size, color, ...o });
}
function sfx(txt, x, y, size, color, age, o = {}) {
  const life = o.life ?? 1.2; if (age < 0 || age > life) return;
  letter(txt, x, y, size, color, { pop: age * 5, rot: (o.rot ?? -.08) + Math.sin(age * 20) * .03 * (1 - age / life), alpha: 1 - seg(age, life - .25, life), ...o });
}
function drawLetters(c) {
  for (const L of LETTERS) {
    const k = L.pop != null ? backOut(L.pop) : 1; if (k <= .01) continue;
    c.save(); c.translate(L.x, L.y); c.rotate(L.rot || 0); c.scale(k, k); c.globalAlpha = L.alpha ?? 1;
    c.font = L.font || `${L.size}px "Baloo 2", "Permanent Marker", "Comic Sans MS", sans-serif`;
    c.textAlign = L.align || 'center'; c.textBaseline = 'middle';
    if (L.stroke) { c.lineJoin = 'round'; c.lineWidth = L.size * .14; c.strokeStyle = L.stroke; c.strokeText(L.txt, 0, 0); }
    if (L.ink !== false && !L.stroke) { c.fillStyle = FLAT.lineInk; c.fillText(L.txt, L.size * .04, L.size * .05); }
    c.fillStyle = L.color; c.fillText(L.txt, 0, 0);
    c.restore();
  }
}
function flushLetters() { if (!LETTERS.length) return; CTX.save(); CTX.setTransform(1, 0, 0, 1, 0, 0); drawLetters(CTX); CTX.restore(); LETTERS = []; }

// ---------- frame ----------
let T = 0, outC = null;
function frame(t) {
  T = t; LETTERS = []; CAM = LAST_CAM = null; BOILN = Math.floor(t * BOIL); CLAWD_N = 0; boilSeed('frame');
  CTX.setTransform(1, 0, 0, 1, 0, 0); CTX.globalAlpha = 1; CTX.globalCompositeOperation = 'source-over';
  CTX.fillStyle = PAL.paper; CTX.fillRect(0, 0, W, H);
  drawWorld(t);
  CTX.setTransform(1, 0, 0, 1, 0, 0);
}
window.renderAt = async (t, type = 'image/png', q = .92) => { frame(t); return outC.toDataURL(type, q); };
window.renderSheet = async (times, cols = 3, w = 640, crop = null, at = null) => {
  if (at) at = at.map(v => typeof v === 'string' ? (0, eval)(v) : v);
  const [, , cw, ch] = at || crop || [0, 0, W, H], h = Math.round(w * ch / cw), rows = Math.ceil(times.length / cols), sc = document.createElement('canvas');
  sc.width = cols * w; sc.height = rows * h; const c = sc.getContext('2d'), ms = [];
  for (let i = 0; i < times.length; i++) {
    const t0 = performance.now(); frame(times[i]); ms.push(Math.round(performance.now() - t0));
    const x = (i % cols) * w, y = Math.floor(i / cols) * h;
    const [cx, cy] = at ? toScreen(at[0], at[1], LAST_CAM).map((v, j) => v - (j ? ch : cw) / 2) : crop || [0, 0];
    c.drawImage(outC, cx, cy, cw, ch, x, y, w, h); c.fillStyle = 'rgba(0,0,0,.65)'; c.fillRect(x, y, 84, 24); c.fillStyle = '#fff'; c.font = '15px sans-serif'; c.fillText(times[i].toFixed(2) + 's', x + 6, y + 17);
  }
  return { url: sc.toDataURL('image/jpeg', .9), ms };
};
window.gpuInfo = () => 'canvas2d (flat engine)';

window.addEventListener('load', async () => {
  outC = document.getElementById('out'); outC.width = W; outC.height = H; outC.style.aspectRatio = `${W} / ${H}`;
  CTX = outC.getContext('2d');
  try { await document.fonts.load('100px "Baloo 2"'); } catch (e) {}
  window.ready = true;
  if (!location.search.includes('render')) devUI();
});
function devUI() {
  const s = document.getElementById('scrub'), lab = document.getElementById('tt'); if (!s) return; s.max = window.LOOP ? window.LOOP.len : DUR;
  const go = t => { const t0 = performance.now(); frame(t); lab.textContent = `${t.toFixed(2)}s  ·  ${Math.round(performance.now() - t0)} ms/frame`; };
  s.addEventListener('input', () => go(+s.value));
  const t = +(new URLSearchParams(location.search).get('t') || 0); s.value = t; go(t);
}
