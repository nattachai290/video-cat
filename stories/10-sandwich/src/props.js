// props.js: "The Sandwich": the series living room and shared bits from story 09 (cushion, speed lines, dizzy stars,
// cracker...), plus the coffee table, the plate, the sandwich tower and its layers, the fishing rod and the big mouth.
const ROOM = { floor: 1300, win: { x: 40, y: 420, w: 360, h: 560 }, sill: { x: 18, y: 980, w: 410, h: 42 },
               chair: { x: 640, y: 830, w: 420, seat: 1150 }, floorY: 1480, home: 480 };
const RC = { wall: '#CFE3D8', wall2: '#C2D9CD', base: '#A9C7B8', floor: '#C99A6B', floorDk: '#AD7F55', frame: '#FFF8EC',
             sky: '#AFE0F5', sun: '#FFE07A', roof: '#B5655A', roofDk: '#8E4A42', chair: '#E77F6A', chairDk: '#C2604E',
             rug: '#7FB3C8', rugDk: '#5E95AC', curtain: '#9B86CF', curtainDk: '#7A66AE', vac: '#3B3F4A', vacTop: '#565B68', vacDk: '#24272E' };

function livingRoom6(t, o = {}) {
  boilSeed('room6');
  paint(rectPts(-600, -600, W + 1200, ROOM.floor + 600), { wash: RC.wall, ink: null });
  for (let i = -6; i < 16; i++) paint(rectPts(i * 90 + 20, -600, 30, ROOM.floor + 600), { wash: RC.wall2, ink: null });
  paint(rectPts(-600, ROOM.floor - 36, W + 1200, 40), { wash: RC.base, ink: null });
  paint(rectPts(-600, ROOM.floor, W + 1200, 1400), { wash: RC.floor, ink: null });
  for (let i = 0; i < 9; i++) inkLine([[-600, ROOM.floor + 50 + i * 64 + i * i * 5], [W + 600, ROOM.floor + 50 + i * 64 + i * i * 5]], 1.5, RC.floorDk, 'ink', 0);
  paint(ellPts(560, 1560, 360, 110, 40), { wash: RC.rug, sw: 1.2 }); paint(ellPts(560, 1560, 300, 84, 40), { wash: RC.rugDk, ink: null }); paint(ellPts(560, 1560, 250, 66, 40), { wash: RC.rug, ink: null });
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
  // the charging dock, bottom right
  paint(rrPts(900, ROOM.floor - 70, 120, 110, 18), { wash: '#E8ECF0', sw: 1.2 }); paint(ellPts(960, ROOM.floor - 30, 10, 10, 10), { wash: Math.sin(t * 3) > 0 ? '#7FD18B' : '#C9D3DB', ink: null });
}
// The curtain hanging left of the window. drop 0..1: the rod snaps and the curtain falls in a heap. sway: a swing.
function curtain(t, drop = 0, sway = 0) {
  const rodY = 380 + drop * 900, x0 = -10, x1 = 250, len = 880 * (1 - drop * .75);
  push(); translate(x1 / 2, rodY); rotate(drop * .4 + sway * .05); translate(-x1 / 2, -rodY);
  const pts = [[x0, rodY], [x1, rodY], [x1 + 20 * sway + 10 * Math.sin(t * 2), rodY + len], [x0 + 20 * sway, rodY + len]];
  paint(pts, { wash: RC.curtain, sw: 1.3, shade: true, shadeK: .4 });
  for (let k = 1; k < 6; k++) inkLine([[x0 + k * 44, rodY + 10], [x0 + k * 42 + 16 * sway, rodY + len - 10]], 1.4, RC.curtainDk, 'ink', .3);
  paint(rrPts(x0 - 30, rodY - 14, x1 + 80, 18, 8), { wash: '#8E6A55', sw: 1 });   // rod
  pop();
}
// Crumbs Pip drops along the floor; a crumb at x disappears once the vacuum (at vx, going left) has passed it.
const CRUMBS = [640, 590, 540, 480, 420, 360, 300, 250, 200];
function crumbs(t, vx) { CRUMBS.forEach((x, i) => { if (t < 9.5 + i * .25 || x < vx + 20) return; paint(ellPts(x + (hash(i) - .5) * 20, ROOM.floorY + 10 + hash(i + 5) * 14, 9, 6, 8), { wash: '#E6B65F', sw: .6 }); }); }

// The robot vacuum at (x, y) on the floor (y = where its bottom touches), scale s. led: 'red' | 'green' | 'blue'.
// Returns the point on its top where a rider stands.
function robotVac(x, y, s = 1, t = 0, o = {}) {
  const led = { red: '#FF4A4A', green: '#5FE07A', blue: '#8FD3F0' }[o.led || 'red'];
  push(); translate(x, y); rotate(o.rot || 0); scale(s, s); if (o.shake) translate(Math.sin(t * 70) * o.shake, 0);
  paint(ellPts(0, 6, 165, 26, 28), { fill: '#3A2A2E', fillOp: 70, ink: null });
  paint([...arcPts(0, -48, 155, 42, 0, Math.PI, 16), ...arcPts(0, -12, 155, 40, Math.PI, 0, 16)], { wash: RC.vac, sw: 1.6 });   // the side band
  paint(ellPts(0, -50, 155, 42, 32), { wash: RC.vacTop, sw: 1.6, shade: true, shadeK: .5 });
  paint(ellPts(-20, -56, 70, 18, 24), { wash: mixCol(RC.vacTop, '#FFFFFF', .12), ink: null });
  inkLine([[-120, -30], [120, -30]], 2, RC.vacDk, 'ink', .4);
  // the "eye" LED, blinking (and a little glow)
  const blink = o.blink === false ? 1 : (Math.sin(t * 6) > -.2 ? 1 : .25);
  glow(70, -26, 40, led, .5 * blink);
  paint(ellPts(70, -26, 22, 12, 16), { wash: led, washOp: 255 * blink, sw: .9 });
  // the spinning side brush
  for (let k = 0; k < 3; k++) { const a = t * 14 + k * TAU / 3; inkLine([[-110, -6], [-110 + Math.cos(a) * 44, -6 + Math.sin(a) * 10]], 2, '#B9C2CC', 'ink', 0); }
  pop();
  return [x, y - 62 * s];
}
// from story 03's props
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

// ---------- story 09 ----------
const FY9 = 1540, DOCK = [960, 1300];
// The red dot (on the floor, a wall or a character). s = size, k = 0..1 fade in.
function redDot(x, y, s = 1, k = 1) {
  if (k <= 0) return;
  glow(x, y, 46 * s, '#FF3A3A', .85 * k);
  paint(ellPts(x, y, 10 * s * k, 8 * s * k, 12), { wash: '#FF2E2E', ink: null });
  paint(ellPts(x - 2 * s, y - 2 * s, 4 * s * k, 3 * s * k, 8), { wash: '#FFE0E0', ink: null });
}
// Pip's right-paw hook: the laser pointer. lit: the little red tip light.
function laserHook(lit = 0) {
  return (u, sw) => {
    paint(rrPts(.05 * u, -.2 * u, 1.55 * u, .4 * u, .16 * u), { wash: '#59606E', sw: sw * .6, shade: true, shadeK: .5 });
    paint(rectPts(.55 * u, -.27 * u, .3 * u, .1 * u), { wash: '#E2464E', ink: null });
    paint(ellPts(1.62 * u, 0, .13 * u, .16 * u, 8), { wash: lit ? '#FF3A3A' : '#8A2A30', ink: null });
    if (lit) glow(1.62 * u, 0, .5 * u, '#FF3A3A', .6 * lit);
  };
}
// The armchair's seat cushion (it gets knocked off, then sucked into the tornado).
function cushion(x, y, rot = 0, s = 1) {
  push(); translate(x, y); rotate(rot); scale(s, s);
  paint(rrPts(-85, -36, 170, 72, 30), { wash: '#F2C14E', sw: 1.4, shade: true, shadeK: .45 });
  paint(ellPts(0, 0, 9, 9, 10), { wash: '#C9932F', ink: null });
  for (const d of [-1, 1]) inkLine([[d * 60, -20], [d * 30, -4]], 1.4, '#C9932F', 'ink', .3);
  pop();
}
// Speed lines trailing behind (x, y): dir = +1 when moving right (lines to the left).
function speedLines(x, y, dir, t, n = 5, len = 160, h = 220) {
  for (let i = 0; i < n; i++) { const yy = y - h / 2 + h * (i + .5) / n, k = frac(t * 3 + hash(i) * 2), l = len * (.5 + .5 * hash(i + 3)); const x0 = x - dir * (40 + k * 60);
    inkLine([[x0, yy], [x0 - dir * l, yy]], 3, '#FFFFFF', 'ink', 0); }
}
// The cartoon scramble: legs blurred into a spinning wheel under a running body at (x, y).
function legWheel(x, y, r, t) {
  paint(ellPts(x, y - r * .5, r, r * .55, 18), { wash: PUMPKIN_COL.col, washOp: 160, ink: null });
  for (let k = 0; k < 3; k++) { const a = t * 40 + k * TAU / 3; inkLine(arcPts(x, y - r * .5, r * .9, r * .5, a, a + 1.4, 8), 2.6, '#B4572A', 'ink', 0); }
}
function dust(x, y, age, seed = 1) { if (age < 0 || age > .6) return; const k = age / .6; for (let i = 0; i < 4; i++) paint(ellPts(x - 40 * i * k - 20 * hash(i + seed), y - 10 - 30 * k * hash(i), 22 * (1 - k) + 6, 18 * (1 - k) + 5, 10), { wash: '#EFE3CF', washOp: 220 * (1 - k), ink: null }); }
// The orange tornado: Pumpkin spinning so fast he becomes a whirl. (x, y) = its tip on the floor, k 0..1 grows it.
function tornado(x, y, t, k = 1) {
  const C = PUMPKIN_COL, hgt = 560 * k;
  for (let i = 0; i < 9; i++) {
    const f = i / 8, yy = y - f * hgt, w = (40 + 190 * f) * k, wob = Math.sin(t * 9 + f * 5) * 26 * f;
    paint(ellPts(x + wob, yy, w, w * .28 + 6, 22), { wash: i % 2 ? C.col : mixCol(C.col, '#FFFFFF', .12), sw: 1.2 });
    for (let s = 0; s < 3; s++) { const a = t * 14 + s * 2.1 + f * 3; const px = x + wob + Math.cos(a) * w * .8; if (Math.sin(a) > 0) inkLine([[px - 10, yy - 6], [px + 10, yy + 6]], 3, C.stripe, 'ink', 0); }
  }
  // ears on top, the tail whipping round, a blur of eyes
  const top = y - hgt, tw = x + Math.sin(t * 9 + 5) * 26;
  for (const s of [-1, 1]) paint([[tw + s * 60, top - 10], [tw + s * 95, top - 90 * k], [tw + s * 130, top]], { wash: C.col, sw: 1.2 });
  const ta = t * 14; paint(ribbon([[tw + Math.cos(ta) * 170 * k, top + 120], [tw + Math.cos(ta) * 260 * k, top + 60], [tw + Math.cos(ta) * 300 * k, top - 20]], 26 * k, 14 * k), { wash: C.col, sw: 1.2 });
  for (let i = 0; i < 5; i++) { const a = t * 6 + i * 1.3, r = 260 * k, yy = y - hgt * (.2 + .15 * i); inkLine(arcPts(x, yy, r, r * .3, a, a + 1.1, 8), 2.5, '#FFFFFF', 'ink', 0); }
}
// Stars / tweety dots circling a dizzy head.
function dizzy(x, y, r, t) { for (let i = 0; i < 4; i++) { const a = t * 4 + i * TAU / 4; paint(starPts(x + Math.cos(a) * r, y + Math.sin(a) * r * .3, 16, .4, 5), { wash: '#FFE27A', sw: 1 }); } }
// A cracker (thrown).
function crackerProp(x, y, rot = 0) { push(); translate(x, y); rotate(rot); paint(rrPts(-22, -16, 44, 32, 6), { wash: '#E6B65F', sw: 1.1 }); for (const [a, b] of [[-10, -6], [8, -6], [-10, 6], [8, 6]]) paint(ellPts(a, b, 2.5, 2.5, 6), { wash: '#B8813A', ink: null }); pop(); }

// ---------- story 10 ----------
const FY10 = 1560, TABLE = { x: 520, top: 1430, w: 380 }, PLATE = [560, 1428];
// the layers of the tower, bottom to top: [kind, height]
const LAYERS = [['bread', 34], ['lettuce', 16], ['tomato', 16], ['cheese', 14], ['ham', 16], ['bread', 30], ['lettuce', 16], ['cheese', 14], ['tomato', 16], ['bread', 30], ['cheese', 14], ['cracker', 20]];
const STACK_H = LAYERS.reduce((s, l) => s + l[1], 0);
// One layer centred at (x, y) = middle of its bottom edge. slime 0..1 tints it green-wet.
function layer(kind, x, y, s = 1, rot = 0, slime = 0) {
  push(); translate(x, y); rotate(rot); scale(s, s);
  const w = kind === 'cracker' ? 64 : kind === 'cheese' ? 170 : 150, sl = c => mixCol(c, '#9DC85A', slime * .35);
  if (kind === 'bread') { const h = 32; paint(rrPts(-w / 2, -h, w, h, 12), { wash: sl('#E9B96E'), sw: 1.3 }); paint(rrPts(-w / 2 + 8, -h + 6, w - 16, h - 12, 8), { wash: sl('#F6DDA8'), ink: null }); }
  else if (kind === 'cheese') { paint([[-w / 2, -14], [w / 2, -14], [w / 2 - 6, 0], [w / 4 + 10, 0], [w / 4, 14], [w / 4 - 10, 0], [-w / 3 + 10, 0], [-w / 3, 10], [-w / 3 - 10, 0], [-w / 2 + 6, 0]], { wash: sl('#F7D154'), sw: 1.2 }); for (const d of [-40, 20]) paint(ellPts(d, -7, 5, 4, 8), { wash: '#E2B53A', ink: null }); }
  else if (kind === 'tomato') { for (const d of [-38, 38]) { paint(ellPts(d, -8, 40, 9, 16), { wash: sl('#E2463F'), sw: 1.1 }); paint(ellPts(d, -8, 28, 5, 12), { wash: '#F27A6E', ink: null }); } }
  else if (kind === 'lettuce') { const pts = []; for (let i = 0; i <= 12; i++) pts.push([-w / 2 - 10 + i * (w + 20) / 12, -16 + (i % 2) * 6]); for (let i = 12; i >= 0; i--) pts.push([-w / 2 - 10 + i * (w + 20) / 12, (i % 2) * 6]); paint(pts, { wash: sl('#7CC35A'), sw: 1.1 }); }
  else if (kind === 'ham') { paint(rrPts(-w / 2 - 4, -16, w + 8, 16, 8), { wash: sl('#F2A1A8'), sw: 1.1 }); }
  else { paint(rrPts(-w / 2, -20, w, 20, 5), { wash: sl('#E6B65F'), sw: 1.1 }); for (const d of [-18, 0, 18]) paint(ellPts(d, -10, 2.5, 2.5, 6), { wash: '#B8813A', ink: null }); }
  pop();
}
// The tower on the plate at (x, y): n layers (fractional: the next one is dropping in), wobble, slime.
function sandwich(x, y, n, t = 0, o = {}) {
  let yy = y - 6;
  const full = Math.floor(n), k = n - full;
  for (let i = 0; i < Math.min(full, LAYERS.length); i++) {
    const [kind, h] = LAYERS[i], wob = (o.wobble || 0) * Math.sin(t * 9 + i * .5) * i * 1.4;
    layer(kind, x + wob, yy, 1, (o.wobble || 0) * Math.sin(t * 9 + i * .5) * .01 * i, o.slime || 0); yy -= h;
  }
  if (k > 0 && full < LAYERS.length) { const [kind] = LAYERS[full], fall = easeIn(clamp(k * 1.4)); layer(kind, x, yy - 140 * (1 - fall) + (k > .72 ? -8 * Math.sin((k - .72) / .28 * Math.PI) : 0), 1); }
  if (o.slime) for (let i = 0; i < 5; i++) { const f = frac(t * .5 + i * .23), dx = -60 + i * 30; paint(ellPts(x + dx, y - 40 - i * 37 + f * 50, 5, 8 + f * 6, 8), { wash: '#B6DE6E', washOp: 220, sw: .7 }); }
  return yy;   // top of the stack
}
function plate(x, y) { paint(ellPts(x, y + 2, 112, 18, 26), { wash: '#FFFFFF', sw: 1.2 }); paint(ellPts(x, y, 80, 11, 22), { wash: '#EEF2F6', ink: null }); }
function coffeeTable(x = TABLE.x) {
  const { top, w } = TABLE;
  for (const d of [-1, 1]) paint(rectPts(x + d * (w / 2 - 40) - 12, top + 10, 24, FY10 - top - 6), { wash: '#8A5A3C', sw: 1.1 });
  paint(rrPts(x - w / 2, top - 4, w, 26, 8), { wash: '#B07A50', sw: 1.4, shade: true, shadeK: .4 });
  inkLine([[x - w / 2 + 10, top + 4], [x + w / 2 - 10, top + 4]], 1.4, '#C99470', 'ink', 0);
}
// Pumpkin's draw hooks (front view, body space). The huge mouth, k 0..1 (a gaping cartoon jaw under the eyes).
const bigMouth = k => (u, sw) => {
  if (k <= .02) return;
  const cy = -6.2 * u, rx = (.6 + 3.0 * k) * u, ry = (.4 + 2.3 * k) * u;
  paint(ellPts(0, cy, rx, ry, 28), { wash: '#4A1F2A', ink: PAL.ink, sw });
  paint(ellPts(0, cy + ry * .55, rx * .6, ry * .32, 16), { wash: PAL.rose, ink: null });
  for (const d of [-1, 1]) paint([[d * rx * .45, cy - ry * .9], [d * rx * .3, cy - ry * .9], [d * rx * .38, cy - ry * .55]], { wash: '#FFFFFF', sw: sw * .5 });
};
// The sandwich-shaped body after the gulp: a rounded box with the layers showing through. k 0..1 how square.
const squareBody = (k, col) => (u, sw) => {
  if (k <= .02) return;
  const w = 4.7 * u, top = -6.1 * u, bot = -.55 * u;
  paint(rrPts(-w, top, 2 * w, bot - top, 1.3 * u), { wash: col, ink: PAL.ink, sw, shade: true, shadeK: .5 });
  const bands = ['#F6DDA8', '#7CC35A', '#E2463F', '#F7D154', '#F2A1A8', '#F6DDA8'];
  bands.forEach((c, i) => { const y = top + .6 * u + i * .8 * u; paint(rrPts(-w + .6 * u, y, 2 * w - 1.2 * u, .55 * u, .25 * u), { wash: c, washOp: 200 * k, ink: null }); });
  for (const d of [-1, 1]) castArm(d * 4.6 * u, -4.9 * u, -1.0, d, 2.6 * u, 1.3 * u, col, sw, null, u);
};
// The fishing rod: from the paw (px, py) to the tip (tx, ty), line down to (hx, hy) with a hook.
function fishingRod(px, py, tx, ty, hx, hy) {
  inkLine([[px, py], [tx, ty]], 6, '#7A5236', 'ink', 0); paint(ellPts(px + 6, py - 6, 12, 12, 12), { wash: '#B9C2CC', sw: 1 });
  inkLine([[tx, ty], [hx, hy]], 1.6, '#4A4A55', 'ink', 0);
  inkLine([[hx, hy], [hx, hy + 18], [hx + 8, hy + 26], [hx + 16, hy + 18]], 3, '#8E96A3', 'ink', 0);
}
// Drool: a wobbling blue string from (x, y), length len.
function drool(x, y, len, t) { if (len <= 0) return; paint(ribbon([[x, y], [x + Math.sin(t * 5) * 6, y + len * .5], [x + Math.sin(t * 5 + 1) * 8, y + len]], 9, 13), { wash: '#BFE6F5', sw: 1 }); }
// Pip's right-paw hook: holding a slice of bread up.
const breadHook = (u, sw) => { push(); translate(.9 * u, .2 * u); rotate(Math.PI / 2); layer('bread', 0, 0, .55); pop(); };
