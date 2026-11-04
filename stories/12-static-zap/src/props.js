// props.js: "Static Zap": the series' living room (stories 04, 06-09) plus a door with a brass knob off to the left,
// the balloon, static fur spikes, electric zaps and everything that sticks to a charged cat (sock, remote, yarn,
// pillow, cushion, crackers).
const ROOM = { floor: 1300, win: { x: 40, y: 420, w: 360, h: 560 }, sill: { x: 18, y: 980, w: 410, h: 42 },
               chair: { x: 640, y: 830, w: 420, seat: 1150 }, floorY: 1480, home: 480 };
const RC = { wall: '#CFE3D8', wall2: '#C2D9CD', base: '#A9C7B8', floor: '#C99A6B', floorDk: '#AD7F55', frame: '#FFF8EC',
             sky: '#AFE0F5', sun: '#FFE07A', roof: '#B5655A', roofDk: '#8E4A42', chair: '#E77F6A', chairDk: '#C2604E',
             rug: '#7FB3C8', rugDk: '#5E95AC', door: '#B98157', doorDk: '#94603C', brass: '#F2C14E', brassDk: '#B8862A' };
const FY = 1540, ZAP = '#7FE3FF';
const DOOR = { x: -560, y: 760, w: 440, knob: [-170, 1110] };

function livingRoom12(t) {
  boilSeed('room12');
  paint(rectPts(-900, -600, W + 1500, ROOM.floor + 600), { wash: RC.wall, ink: null });
  for (let i = -10; i < 16; i++) paint(rectPts(i * 90 + 20, -600, 30, ROOM.floor + 600), { wash: RC.wall2, ink: null });
  paint(rectPts(-900, ROOM.floor - 36, W + 1500, 40), { wash: RC.base, ink: null });
  paint(rectPts(-900, ROOM.floor, W + 1500, 1400), { wash: RC.floor, ink: null });
  for (let i = 0; i < 9; i++) inkLine([[-900, ROOM.floor + 50 + i * 64 + i * i * 5], [W + 600, ROOM.floor + 50 + i * 64 + i * i * 5]], 1.5, RC.floorDk, 'ink', 0);
  paint(ellPts(560, 1560, 360, 110, 40), { wash: RC.rug, sw: 1.2 }); paint(ellPts(560, 1560, 300, 84, 40), { wash: RC.rugDk, ink: null }); paint(ellPts(560, 1560, 250, 66, 40), { wash: RC.rug, ink: null });
  // the door (left, off the usual frame) with its brass knob
  const d = DOOR;
  paint(rectPts(d.x - 26, d.y - 26, d.w + 52, ROOM.floor - d.y + 26), { wash: RC.frame, sw: 1.4 });
  paint(rectPts(d.x, d.y, d.w, ROOM.floor - d.y), { wash: RC.door, sw: 1.3, shade: true, shadeK: .35 });
  for (const [py, ph] of [[d.y + 50, 200], [d.y + 300, 190]]) paint(rrPts(d.x + 50, py, d.w - 100, ph, 10), { wash: RC.doorDk, washOp: 120, sw: 1 });
  doorKnob(t);
  // window
  const w = ROOM.win, s = ROOM.sill;
  paint(rectPts(w.x - 18, w.y - 18, w.w + 36, w.h + 36), { wash: RC.frame, sw: 1.4 });
  paint(rectPts(w.x, w.y, w.w, w.h), { wash: RC.sky, ink: null });
  paint(ellPts(w.x + 250, w.y + 130, 58, 58, 28), { wash: RC.sun, ink: null });
  paint([[w.x, w.y + w.h], [w.x, w.y + 380], [w.x + 170, w.y + 300], [w.x + w.w, w.y + 380], [w.x + w.w, w.y + w.h]], { wash: RC.roof, ink: null });
  for (let i = 0; i < 6; i++) inkLine([[w.x, w.y + 410 + i * 26], [w.x + w.w, w.y + 410 + i * 26]], 1.4, RC.roofDk, 'ink', 0);
  inkLine([[w.x + w.w / 2, w.y], [w.x + w.w / 2, w.y + w.h]], 3, RC.frame, 'ink', 0);
  inkLine([[w.x, w.y + w.h / 2 - 60], [w.x + w.w, w.y + w.h / 2 - 60]], 3, RC.frame, 'ink', 0);
  paint(rectPts(s.x, s.y, s.w, s.h), { wash: RC.frame, sw: 1.3, shade: true, shadeK: .4 });
  // armchair
  const c = ROOM.chair;
  paint(rrPts(c.x + 40, c.y, c.w - 80, 360, 60), { wash: RC.chair, sw: 1.5, shade: true, shadeK: .5 });
  paint(rrPts(c.x + 20, c.seat - 40, c.w - 40, 200, 40), { wash: mixCol(RC.chair, '#FFFFFF', .12), sw: 1.4 });
  for (const sd of [0, 1]) paint(rrPts(sd ? c.x + c.w - 90 : c.x - 10, c.seat - 110, 100, 260, 40), { wash: RC.chairDk, sw: 1.4, shade: true, shadeK: .4 });
  for (const sd of [0, 1]) paint(rectPts(sd ? c.x + c.w - 60 : c.x + 30, c.seat + 150, 26, ROOM.floor + 20 - c.seat - 150), { wash: '#7A5236', ink: null });
  paint(rrPts(520, 520, 130, 160, 10), { wash: '#F6EBDA', sw: 1.2 }); paint(rrPts(538, 540, 94, 120, 6), { wash: '#9CC8E8', ink: null });
}
function doorKnob(t, glowK = 0) {
  const [x, y] = DOOR.knob;
  paint(rrPts(x - 26, y - 70, 52, 140, 20), { wash: RC.brassDk, sw: 1 });
  paint(ellPts(x, y, 40, 40, 20), { wash: RC.brass, sw: 1.3, shade: true, shadeK: .5 });
  paint(ellPts(x - 12, y - 14, 12, 9, 10), { wash: '#FFF2C4', ink: null });
  if (glowK > 0) glow(x, y, 120, ZAP, glowK);
}

// A red balloon at (x, y) (its centre), with a string trailing down to (sx, sy). sq squashes it while being rubbed.
function balloon(x, y, s = 1, o = {}) {
  const sq = o.sq || 0, rot = o.rot || 0;
  if (o.string !== false) {
    const sx = o.sx ?? x + 20, sy = o.sy ?? y + 300 * s;
    inkLine([[x, y + 118 * s], [lerp(x, sx, .4) + 20 * s, lerp(y, sy, .5)], [sx, sy]], 2, '#6E5A66', 'ink', .4);
  }
  push(); translate(x, y); rotate(rot); scale(s * (1 + sq * .4), s * (1 - sq * .3));
  paint(ellPts(0, 0, 92, 110, 30), { wash: '#E2343F', sw: 1.6, shade: true, shadeK: .45 });
  paint([[-12, 108], [12, 108], [0, 124]], { wash: '#B8242E', sw: 1 });
  paint(ellPts(-36, -44, 18, 30, 14), { wash: '#FF9AA0', ink: null });
  paint(ellPts(-22, -78, 7, 7, 8), { wash: '#FFE0E2', ink: null });
  pop();
}
// The pieces of a popped balloon flying apart from (x, y), age 0..1.
function balloonBits(x, y, age) {
  if (age < 0 || age > 1) return;
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + .3, k = easeOut(age), r = 60 + 340 * k;
    push(); translate(x + Math.cos(a) * r, y + Math.sin(a) * r + 400 * age * age); rotate(a + age * 9);
    paint([[-22, -10], [24, -16], [14, 14], [-18, 8]], { wash: '#E2343F', sw: 1 }); pop(); }
}

// Static spikes: a halo of fur standing straight out round an ellipse (cx, cy, rx, ry). k 0..1 = how charged.
// Drawn BEHIND the character, so the body covers the spike roots.
function staticFur(cx, cy, rx, ry, k, t, col = PUMPKIN_COL.col, n = 34, seed = 1) {
  if (k <= .01) return;
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = i / (n * 2) * TAU, out = i % 2 ? 1 + k * (.22 + .2 * hash(i * 3.1 + seed)) + .03 * Math.sin(t * 30 + i) * k : .9;
    pts.push([cx + Math.cos(a) * rx * out, cy + Math.sin(a) * ry * out]);
  }
  paint(pts, { wash: col, ink: PAL.ink, sw: 1.6 });
}
// A crackle of electricity: a jagged blue bolt from (x0, y0) to (x1, y1). Re-jags 12 times a second.
function zapBolt(x0, y0, x1, y1, t, w = 4, seed = 1) {
  const n = 7, f = Math.floor(t * 12), pts = [];
  const nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny) || 1;
  for (let i = 0; i <= n; i++) { const k = i / n, j = i === 0 || i === n ? 0 : (hash(i * 7 + f * 13 + seed) - .5) * .35 * L;
    pts.push([lerp(x0, x1, k) + nx / L * j, lerp(y0, y1, k) + ny / L * j]); }
  inkLine(pts, w * 2.4, ZAP, 'ink', 0); inkLine(pts, w, '#FFFFFF', 'ink', 0);
}
// Little sparks crawling over a charged body (cx, cy, rx, ry).
function sparks(cx, cy, rx, ry, t, n = 3, size = 70, seed = 1) {
  for (let i = 0; i < n; i++) {
    const f = Math.floor(t * 6 + i * .37), a = hash(f * 3.3 + i + seed) * TAU, p = [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
    const b = a + (hash(f + i * 9 + seed) - .5) * 1.4;
    zapBolt(p[0], p[1], p[0] + Math.cos(b) * size, p[1] + Math.sin(b) * size, t, 2.5, i + seed);
  }
}
// One white flash frame (in world space; pass a big rectangle round the camera).
function flash(k, cx = 540, cy = 1200) { if (k > 0) paint(rectPts(cx - 1600, cy - 1800, 3200, 3600), { wash: '#FFFFFF', washOp: 255 * clamp(k), ink: null }); }

// ---------- the things that stick ----------
function sock(x, y, rot = 0, s = 1) {
  push(); translate(x, y); rotate(rot); scale(s, s);
  paint([[-26, -70], [26, -70], [26, 10], [64, 26], [66, 56], [-10, 56], [-26, 30]], { wash: '#F6F1E6', sw: 1.3, curv: .4 });
  for (const yy of [-56, -42]) inkLine([[-26, yy], [26, yy]], 5, '#5E95AC', 'ink', 0);
  paint(ellPts(50, 42, 16, 13, 10), { wash: '#E2464E', ink: null });
  pop();
}
function remote(x, y, rot = 0, s = 1) {
  push(); translate(x, y); rotate(rot); scale(s, s);
  paint(rrPts(-28, -80, 56, 160, 16), { wash: '#3B3F4A', sw: 1.3, shade: true, shadeK: .4 });
  paint(ellPts(0, -54, 11, 11, 10), { wash: '#E2464E', ink: null });
  for (let r = 0; r < 3; r++) for (const c of [-1, 1]) paint(ellPts(c * 12, -20 + r * 26, 7, 6, 8), { wash: '#C9D3DB', ink: null });
  pop();
}
function yarn(x, y, rot = 0, s = 1) {
  push(); translate(x, y); rotate(rot); scale(s, s);
  paint(ellPts(0, 0, 52, 52, 22), { wash: '#9B86CF', sw: 1.3, shade: true, shadeK: .4 });
  for (let k = -2; k <= 2; k++) inkLine(arcPts(0, 0, 50, 22 + Math.abs(k) * 6, Math.PI + k * .3, TAU + k * .3, 10).map(([a, b]) => [a, b + k * 12]), 1.6, '#7A66AE', 'ink', .2);
  inkLine([[40, 30], [70, 60], [60, 90]], 2.4, '#9B86CF', 'ink', .4);
  pop();
}
function pillow(x, y, rot = 0, s = 1) {
  push(); translate(x, y); rotate(rot); scale(s, s);
  paint([[-90, -50], [0, -40], [90, -54], [80, 0], [92, 52], [0, 44], [-92, 54], [-80, 0]], { wash: '#8FD3B0', sw: 1.4, curv: .5, shade: true, shadeK: .4 });
  for (const [a, b] of [[-40, -10], [20, 14], [44, -18]]) paint(ellPts(a, b, 10, 10, 10), { wash: '#FFF8EC', ink: null });
  pop();
}
function cushion(x, y, rot = 0, s = 1) {
  push(); translate(x, y); rotate(rot); scale(s, s);
  paint(rrPts(-85, -36, 170, 72, 30), { wash: '#F2C14E', sw: 1.4, shade: true, shadeK: .45 });
  paint(ellPts(0, 0, 9, 9, 10), { wash: '#C9932F', ink: null });
  for (const d of [-1, 1]) inkLine([[d * 60, -20], [d * 30, -4]], 1.4, '#C9932F', 'ink', .3);
  pop();
}
function crackerProp(x, y, rot = 0, s = 1) { push(); translate(x, y); rotate(rot); scale(s, s); paint(rrPts(-22, -16, 44, 32, 6), { wash: '#E6B65F', sw: 1.1 }); for (const [a, b] of [[-10, -6], [8, -6], [-10, 6], [8, 6]]) paint(ellPts(a, b, 2.5, 2.5, 6), { wash: '#B8813A', ink: null }); pop(); }
// A plate of crackers by Pip's spot on the floor.
function plate(x, y, n = 3) { paint(ellPts(x, y, 90, 24, 22), { wash: '#FFF8EC', sw: 1.2 }); for (let i = 0; i < n; i++) crackerProp(x - 40 + i * 40, y - 14 - (i % 2) * 6, (i - 1) * .3); }

// ---------- reused from story 09 ----------
function burst(x, y, r, age, n = 10, col = '#FFF4D6', seed = 1) {
  if (age < 0 || age > 1) return;
  const k = easeOut(age), a = 1 - age;
  for (let i = 0; i < n; i++) { const ang = i / n * TAU + hash(i + seed) * .4, r0 = r * (.45 + .35 * k), r1 = r * (.7 + .7 * k);
    inkLine([[x + Math.cos(ang) * r0, y + Math.sin(ang) * r0], [x + Math.cos(ang) * r1, y + Math.sin(ang) * r1]], 4 * a + .5, col, 'ink', 0); }
}
function puffCloud(x, y, r, age) {
  if (age < 0 || age > .7) return;
  const k = easeOut(age / .7), a = 1 - age / .7;
  for (let i = 0; i < 7; i++) { const ang = i / 7 * TAU; paint(ellPts(x + Math.cos(ang) * r * k, y + Math.sin(ang) * r * k * .7, r * .45 * a + 2, r * .4 * a + 2, 16), { wash: '#FFFFFF', washOp: 230 * a, ink: null }); }
}
function zzz(x, y, s, t) { for (let i = 0; i < 3; i++) { const k = frac(t * .45 + i / 3), zx = x + k * 60 * s, zy = y - k * 170 * s, r = (12 + 10 * k) * s; inkLine([[zx - r, zy - r], [zx + r, zy - r], [zx - r, zy + r], [zx + r, zy + r]], 2.4 * s, '#5A6FA8', 'ink', 0); } }
function speedLines(x, y, dir, t, n = 5, len = 160, h = 220) {
  for (let i = 0; i < n; i++) { const yy = y - h / 2 + h * (i + .5) / n, k = frac(t * 3 + hash(i) * 2), l = len * (.5 + .5 * hash(i + 3)); const x0 = x - dir * (40 + k * 60);
    inkLine([[x0, yy], [x0 - dir * l, yy]], 3, '#FFFFFF', 'ink', 0); }
}
function dizzy(x, y, r, t) { for (let i = 0; i < 4; i++) { const a = t * 4 + i * TAU / 4; paint(starPts(x + Math.cos(a) * r, y + Math.sin(a) * r * .3, 16, .4, 5), { wash: '#FFE27A', sw: 1 }); } }

// ---------- charged characters ----------
// Pumpkin with his fur standing on end: k 0..1 (puff + spike halo + crawling sparks). Same options as pumpkin().
function chargedPumpkin(x, y, u, o, k, t) {
  const q = o.view === 'q' ? 1 : 0, dy = (o.dy || 0) * u, rot = o.rot || 0;
  push(); translate(x, y + dy); rotate(rot); if (o.flip) scale(-1, 1);
  staticFur(q * .4 * u, -3.9 * u, 5.3 * u, 4.0 * u, k, t, PUMPKIN_COL.col, 30, 1);
  staticFur(q * .55 * u, -8.9 * u, 4.5 * u, 3.7 * u, k, t, PUMPKIN_COL.col, 28, 2);
  pop();
  pumpkin(x, y, u, { ...o, puff: Math.max(o.puff || 0, k) });
  if (k > .3 && o.sparks !== false) { push(); translate(x, y + dy); rotate(rot); sparks(0, -6.5 * u, 5.6 * u, 6.2 * u, t, 2, 1.8 * u, 3); pop(); }
}
// Pip as a puffball: a round ragged ball of grey fur with his face, ears and tail poking out. k 0..1 (2 = super puffed).
function puffPip(x, y, u, o, k, t) {
  const r = 1 + .35 * Math.max(0, k - 1), dy = (o.dy || 0) * u;
  push(); translate(x, y + dy); rotate(o.rot || 0);
  staticFur(0, -3.0 * u, 3.0 * u * r, 3.3 * u * r, Math.min(k, 1.6), t, PIP_COL.col, 30, 7);
  paint(ellPts(0, -3.0 * u, 2.75 * u * r, 3.0 * u * r, 26), { wash: PIP_COL.col, ink: null, shade: true });
  pop();
  pip(x, y, u, o);
  if (o.sparks !== false) { push(); translate(x, y + dy); sparks(0, -3.0 * u, 3.1 * u * r, 3.4 * u * r, t, 2, 1.2 * u, 9); pop(); }
}
