// props.js (long-video template): every set and prop made for the Shorts so far (living room, curtain, robot vacuum,
// crackers, cushion, speed lines, sandwich layers, Dusty the raccoon, shark hoods, coaster, portal, space, monster...).
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

// ---------- story 11 ----------
const FY11 = 1560;
const SHARK = { col: '#7E9DBF', dk: '#5B7A9C', belly: '#E6EEF5', tooth: '#FFFFFF' };
// a ring (outer CW, inner CCW) so the fill has a hole: the hood opening
function ringPts(cx, cy, rx, ry, ix, iy, icy, n = 32) { return [...ellPts(cx, cy, rx, ry, n), ellPts(cx, cy, rx, ry, n)[0], ...ellPts(cx, icy, ix, iy, n).reverse(), ellPts(cx, icy, ix, iy, n).reverse()[0]]; }
// Pumpkin's shark hood (front / 3/4 view), as a draw hook: fin on top, teeth round the face opening, fin "tail" ears hidden.
const sharkHood = (q = 0) => (u, sw) => {
  const cx = q * .55 * u, cy = -8.8 * u;
  paint([[cx - .9 * u, cy - 3.5 * u], [cx + .3 * u, cy - 6.0 * u], [cx + 1.3 * u, cy - 3.4 * u]], { wash: SHARK.dk, ink: PAL.ink, sw });   // dorsal fin
  paint(ringPts(cx, cy - .25 * u, 4.3 * u, 4.35 * u, 2.95 * u, 2.45 * u, cy + .45 * u), { wash: SHARK.col, ink: PAL.ink, sw, shade: true, shadeK: .5 });
  for (let i = 0; i < 9; i++) { const a = Math.PI + .25 + i * (Math.PI - .5) / 8, ex = cx + Math.cos(a) * 2.95 * u, ey = cy + .45 * u + Math.sin(a) * 2.45 * u, nx = -Math.cos(a), ny = -Math.sin(a);
    paint([[ex - ny * .28 * u, ey + nx * .28 * u], [ex + nx * .6 * u, ey + ny * .6 * u], [ex + ny * .28 * u, ey - nx * .28 * u]], { wash: SHARK.tooth, ink: PAL.ink, sw: sw * .5 }); }
  for (const s of [-1, 1]) paint(ellPts(cx + s * 3.6 * u, cy + .2 * u, .32 * u, .32 * u, 10), { wash: '#1E2533', ink: null });   // the shark's own eyes, on the sides
};
// Pip's tiny shark hood (front / 3/4), as a draw hook (his ears poke out of two holes).
const pipSharkHood = (q = 0) => (u, sw) => {
  const cx = q * .25 * u, cy = -4.7 * u;
  paint([[cx - .4 * u, cy - 1.6 * u], [cx + .1 * u, cy - 2.9 * u], [cx + .6 * u, cy - 1.55 * u]], { wash: SHARK.dk, ink: PAL.ink, sw });
  paint(ringPts(cx, cy, 1.95 * u, 1.75 * u, 1.35 * u, 1.1 * u, cy + .25 * u), { wash: SHARK.col, ink: PAL.ink, sw: sw * .9, shade: true, shadeK: .5 });
  for (let i = 0; i < 7; i++) { const a = Math.PI + .3 + i * (Math.PI - .6) / 6, ex = cx + Math.cos(a) * 1.35 * u, ey = cy + .25 * u + Math.sin(a) * 1.1 * u, nx = -Math.cos(a), ny = -Math.sin(a);
    paint([[ex - ny * .14 * u, ey + nx * .14 * u], [ex + nx * .3 * u, ey + ny * .3 * u], [ex + ny * .14 * u, ey - nx * .14 * u]], { wash: SHARK.tooth, ink: PAL.ink, sw: sw * .4 }); }
};

// ---------- Dusty, the raccoon conductor (an original character) ----------
const DC = { col: '#9A9AA6', dk: '#6E6E7C', lt: '#E4E2E8', mask: '#2E2B36', cap: '#2E3A6E', capDk: '#1F2850', gold: '#F2C14E', bat: '#C9935A', batDk: '#9C6B3C', nose: '#2E2B36' };
// The bat, in arm space (held at the paw).
function batHook(u, sw) { paint([[-.2 * u, -.18 * u], [3.6 * u, -.42 * u], [3.9 * u, 0], [3.6 * u, .42 * u], [-.2 * u, .18 * u]], { wash: DC.bat, ink: PAL.ink, sw: sw * .7, curv: .3, shade: true, shadeK: .4 }); paint(ellPts(-.3 * u, 0, .25 * u, .25 * u, 8), { wash: DC.batDk, ink: PAL.ink, sw: sw * .5 }); }
// dusty(x, y, u, o): front / 3/4 view, ~11u tall. o: view 'front'|'q', flip, aL, aR (bat in the right paw unless noBat),
// face fields (eyes, lid, pupil, brow, mouth, talk, lookX, lookY), who: 'dusty', rot, dy, sq, noShadow, tailWag, boilKey.
function dusty(x, y, u, o = {}) {
  const id = o.boilKey ?? ('du' + (++CLAWD_N)), rs = p => boilSeed(`dusty ${id} ${p}`);
  const q = o.view === 'q' ? 1 : 0, sw = clamp(u / 15, .5, 3);
  const talk = o.talk ?? (o.who && typeof SPEAK === 'function' ? SPEAK(o.who, T) : 0);
  rs('shadow'); if (!o.noShadow) castShadow(x, y, u * 3.6, u, o.dy);
  push(); translate(x, y + (o.dy || 0) * u); if (o.rot) rotate(o.rot); scale((o.flip ? -1 : 1) * (1 + (o.sq || 0) * .6), 1 - (o.sq || 0));
  // ringed tail behind, curling up on the right
  rs('tail'); const tw = Math.sin(T * 1.6) * (.2 + (o.tailWag ?? .3) * .5);
  const TP = [[1.8, -1.6], [3.6, -2.0], [4.6 + tw * .5, -3.6], [4.4 + tw, -5.4]].map(([a, b]) => [(a + q * .6) * u, b * u]);
  paint(ribbon(TP, 1.5 * u, 1.0 * u), { wash: DC.col, ink: PAL.ink, sw: sw * .85 });
  for (let k = 0; k < 4; k++) { const f = .2 + k * .22, i = Math.min(2, Math.floor(f * 3)), g = f * 3 - i, A = TP[i], B = TP[i + 1]; const px = lerp(A[0], B[0], g), py = lerp(A[1], B[1], g); paint(ellPts(px, py, .62 * u, .3 * u, 10), { wash: DC.mask, ink: null }); }
  // feet, body, belly
  rs('body');
  for (const s of [-1, 1]) paint(ellPts((s * 1.3 + q * .3) * u, -.35 * u, .9 * u, .45 * u, 12), { wash: DC.dk, ink: PAL.ink, sw: sw * .8 });
  paint(ellPts(q * .3 * u, -3.2 * u, 2.9 * u, 3.0 * u, 26), { wash: DC.col, ink: PAL.ink, sw, shade: true });
  paint(ellPts(q * .6 * u, -2.7 * u, 1.8 * u, 2.1 * u, 20), { wash: DC.lt, washOp: 230, ink: null });
  // a little navy waistcoat with a gold button (the uniform)
  for (const s of [-1, 1]) paint(_P(u, [[s * .35 + q * .4, -5.9], [s * 2.5 + q * .4, -5.3], [s * 2.7 + q * .4, -3.6], [s * .5 + q * .4, -3.3]]), { wash: DC.cap, ink: PAL.ink, sw: sw * .8, curv: .3 });
  paint(ellPts((-.7 + q * .4) * u, -4.5 * u, .22 * u, .22 * u, 8), { wash: DC.gold, ink: PAL.ink, sw: sw * .4 });
  // arms
  rs('arms');
  castArm((-2.6 + q * .5) * u, -5.0 * u, o.aL ?? -1.1, -1, 2.4 * u, 1.1 * u, q ? DC.dk : DC.col, sw, o.armL, u);
  castArm((2.6 + q * .4) * u, -5.0 * u, o.aR ?? .9, 1, 2.4 * u, 1.1 * u, DC.col, sw, o.noBat ? o.armR : batHook, u);
  // head
  rs('head');
  push(); translate(q * .45 * u, -8.0 * u);
  const fx = q * .55 * u;
  for (const s of [-1, 1]) { const far = q && s < 0; paint(ellPts(s * 1.9 * u + fx * .3, -1.85 * u, .85 * u, .9 * u, 14), { wash: far ? DC.dk : DC.col, ink: PAL.ink, sw: sw * .8 }); paint(ellPts(s * 1.9 * u + fx * .3, -1.8 * u, .45 * u, .5 * u, 10), { wash: DC.mask, ink: null }); }
  paint(ellPts(0, 0, 2.7 * u, 2.3 * u, 24), { wash: DC.col, ink: PAL.ink, sw, shade: true, shadeK: .7 });
  paint([[fx - 2.5 * u, -.3 * u], [fx - 1.2 * u, -.9 * u], [fx, -.5 * u], [fx + 1.2 * u, -.9 * u], [fx + 2.5 * u, -.3 * u], [fx + 2.1 * u, .45 * u], [fx + 1.1 * u, .2 * u], [fx, .35 * u], [fx - 1.1 * u, .2 * u], [fx - 2.1 * u, .45 * u]], { wash: DC.mask, ink: null, curv: .4 });   // the bandit mask
  paint(ellPts(fx, 1.15 * u, 1.25 * u, .85 * u, 18), { wash: DC.lt, ink: null });   // muzzle
  for (const s of [-1, 1]) { const ex = fx + s * .95 * u * (q && s < 0 ? .8 : 1); push(); translate(ex, -.25 * u); castEye(o.eyes || 'open', s, .36 * u, .4 * u, { lid: .45, pupil: .6, ...o }, sw * .8, DC.mask, '#2E2B36', 'cat'); pop(); castBrow(ex, -.25 * u, .6 * u, .6 * u, s, o.brow ?? .2, o.browUp || 0, sw * .6); }
  paint(ellPts(fx, .62 * u, .32 * u, .22 * u, 10), { wash: DC.nose, ink: PAL.ink, sw: sw * .4 });
  push(); translate(fx, .85 * u); castMouth(o.mouth || 'flat', talk, .55 * u, sw * .8); pop();
  for (const s of [-1, 1]) castWhiskers(fx + s * .55 * u, 1.0 * u, s, 1.4 * u, sw * .7);
  // conductor's cap
  paint(rrPts(-1.9 * u + fx * .3, -3.3 * u, 3.8 * u, 1.5 * u, .5 * u), { wash: DC.cap, ink: PAL.ink, sw: sw * .9, shade: true, shadeK: .5 });
  paint([[-2.3 * u + fx * .3, -1.85 * u], [2.3 * u + fx * .3, -1.85 * u], [2.0 * u + fx * .4, -1.45 * u], [-2.0 * u + fx * .4, -1.45 * u]], { wash: DC.capDk, ink: PAL.ink, sw: sw * .8 });
  paint(ellPts(fx * .4, -2.5 * u, .35 * u, .3 * u, 10), { wash: DC.gold, ink: PAL.ink, sw: sw * .4 });
  pop();
  if (o.draw) o.draw(u, sw);
  pop(); rs('after');
}

// ---------- the coaster ----------
const CART = { len: 16, h: 3.8 };   // in u
// The cart in side view, facing +x (flip for -x), at (x, y) = rail contact point under its middle, angle rot.
// seats(): draw the riders (called between the back and front panels). Returns nothing.
function coasterCart(x, y, u, o = {}) {
  push(); translate(x, y); rotate(o.rot || 0); if (o.flip) scale(-1, 1);
  const L = CART.len * u, Hh = CART.h * u, sw = clamp(u / 15, .5, 3);
  paint(rrPts(-L / 2, -Hh - 1.2 * u, L, Hh, 1.2 * u), { wash: '#B8343C', ink: PAL.ink, sw });   // back panel (inside)
  for (const sx of [-.25, .22]) paint(rrPts(L * sx - 2.6 * u, -Hh - 3.4 * u, 5.2 * u, 3.0 * u, 1.2 * u), { wash: '#C73E45', ink: PAL.ink, sw: sw * .8, shade: true, shadeK: .4 });
  if (o.seats) clipRects([[-L, -60 * u, 2 * L, 60 * u - 1.2 * u]], () => o.seats(u, L, Hh));   // riders, hidden below the cart floor   // riders, in cart space (front = +x, the panel top at y = -Hh - .4u)
  paint([[-L / 2, -Hh - .4 * u], [L / 2 - 1.6 * u, -Hh - .4 * u], [L / 2 + .6 * u, -Hh * .45 - .8 * u], [L / 2, -1.0 * u], [-L / 2, -1.0 * u]], { wash: '#E2463F', ink: PAL.ink, sw, curv: .3, shade: true, shadeK: .5 });
  inkLine([[-L / 2 + .3 * u, -Hh * .55 - .8 * u], [L / 2 - .6 * u, -Hh * .55 - .8 * u]], 7 * sw, '#F7D154', 'ink', 0);
  if (o.bar != null) { const by = -Hh - .4 * u - (1 - o.bar) * 2.2 * u; inkLine([[-L * .4, by], [L * .05, by]], 8 * sw, '#F7D154', 'ink', 0); }   // the lap bar
  paint(ellPts(L / 2 - 1.0 * u, -Hh * .75 - .8 * u, .45 * u, .45 * u, 12), { wash: '#FFF3B0', ink: PAL.ink, sw: sw * .6 });   // headlight
  if (o.light) glow(L / 2 + 1.5 * u, -Hh * .75 - .8 * u, 3 * u, '#FFF3B0', .5);
  for (const s of [-1, 1]) { paint(ellPts(s * L * .32, -.55 * u, .75 * u, .75 * u, 14), { wash: '#3B3F4A', ink: PAL.ink, sw: sw * .7 }); paint(ellPts(s * L * .32, -.55 * u, .3 * u, .3 * u, 8), { wash: '#B9C2CC', ink: null }); }
  pop();
}
// A rail along a polyline P (world points), with ties.
function rail(P, u, col = '#F2C14E') {
  const sw = clamp(u / 15, .5, 3);
  for (let i = 0; i < P.length - 1; i += 2) { const [a, b] = [P[i], P[i + 1]], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l; inkLine([[a[0] - nx * .2 * u, a[1] - ny * .2 * u], [a[0] + nx * .9 * u, a[1] + ny * .9 * u]], 4 * sw, '#8E6A55', 'ink', 0); }
  inkLine(P, 6 * sw, col, 'ink', 0); inkLine(P.map(([a, b]) => [a, b + .5 * u]), 2 * sw, mixCol(col, '#000000', .3), 'ink', 0);
}
// The portal: a spinning spiral of purple/cyan rings at (x, y), radius r, open 0..1.
function portal(x, y, r, open, t) {
  if (open <= .01) return;
  const R = r * open;
  glow(x, y, R * 1.6, '#B98CFF', .6);
  for (let i = 0; i < 7; i++) { const k = 1 - i / 7; paint(ellPts(x, y, R * k, R * k * 1.15, 30), { wash: i % 2 ? '#6A3FC9' : '#3FC9E8', washOp: 230, ink: i === 0 ? PAL.ink : null, sw: 2 }); }
  for (let s = 0; s < 4; s++) { const pts = []; for (let k = 0; k <= 20; k++) { const f = k / 20, a = t * 4 + s * TAU / 4 + f * 4; pts.push([x + Math.cos(a) * R * f, y + Math.sin(a) * R * f * 1.15]); } inkLine(pts, 3, '#FFFFFF', 'ink', 0); }
}
// Space: a dark gradient, stars (drifting by speed), a ringed planet.
function space(t, drift = 0, o = {}) {
  paint(rectPts(-2000, -2000, 6000, 6000), { wash: '#1B1638', ink: null });
  for (let i = 0; i < 6; i++) paint(ellPts(300 + i * 300, 800 + (i % 3) * 400, 700, 420, 30), { wash: ['#2B1F55', '#1E2A5C', '#33205A'][i % 3], washOp: 120, ink: null });
  for (let i = 0; i < 140; i++) { const x = ((hash(i) * 3000 - drift * (.3 + hash(i + 7) * .7)) % 3000 + 3000) % 3000 - 900, y = hash(i + 3) * 2600 - 300, r = 1.5 + hash(i + 5) * 3.5, tw = .6 + .4 * Math.sin(t * 3 + i);
    if (drift > 400 && hash(i + 9) > .6) inkLine([[x, y], [x + 60 * (.3 + hash(i + 7)), y]], r * .8, '#FFFFFF', 'ink', 0); else paint(ellPts(x, y, r * tw, r * tw, 6), { wash: '#FFFFFF', ink: null }); }
  if (o.planet !== false) { const [px, py, pr] = o.planet || [830, 520, 170]; paint(ellPts(px, py, pr, pr, 30), { wash: '#F2A65A', sw: 2, shade: true, shadeK: .6 }); inkLine(arcPts(px, py, pr * 1.9, pr * .45, -.2, Math.PI + .2, 24), 10, '#F7D9A8', 'ink', 0); }
}
// The giant monster (original): a purple blob with three eyes, horns, two clawed arms and a big toothy mouth.
// (x, y) = middle of its base, s = scale (1 = ~1000 px tall). o: mouth 0..1, armUp 0..1 (the right arm raised), cough.
function monster(x, y, s, t, o = {}) {
  push(); translate(x, y); scale(s, s);
  const br = Math.sin(t * 1.5) * 8, sw = 3;
  for (const d of [-1, 1]) paint([[d * 150, -880], [d * 230, -1040], [d * 250, -860]], { wash: '#F2E6C8', ink: PAL.ink, sw });   // horns
  paint(ellPts(0, -500 + br, 420, 520 - br, 36), { wash: '#7B4FC9', ink: PAL.ink, sw: sw * 1.4, shade: true, shadeK: .6 });
  paint(ellPts(0, -300, 260, 260, 28), { wash: '#9D7AE0', washOp: 200, ink: null });
  // arms (the right one raised to grab/squeeze the star)
  const up = o.armUp || 0;
  paint(ribbon([[-380, -560], [-560, -420], [-600, -200]], 120, 90), { wash: '#6A3FB8', ink: PAL.ink, sw });
  paint(ribbon([[380, -560], [lerp(560, 520, up), lerp(-420, -900, up)], [lerp(600, 480, up), lerp(-200, -1200, up)]], 120, 90), { wash: '#6A3FB8', ink: PAL.ink, sw });
  // eyes
  [[-170, -720, 70], [0, -800, 90], [170, -720, 70]].forEach(([ex, ey, r], i) => { paint(ellPts(ex, ey, r, r, 20), { wash: '#FFF7D6', ink: PAL.ink, sw }); paint(ellPts(ex + Math.sin(t + i) * 12, ey + 10, r * .45, r * .55, 14), { wash: '#E2343F', ink: null }); paint(ellPts(ex + Math.sin(t + i) * 12, ey + 10, r * .2, r * .3, 10), { wash: '#1B1638', ink: null }); });
  // mouth
  const m = o.mouth ?? .3, mh = 60 + 220 * m;
  paint(ellPts(0, -430, 300, mh, 30), { wash: '#2A1238', ink: PAL.ink, sw });
  for (let i = -4; i <= 4; i++) { paint([[i * 62 - 26, -430 - mh * .92], [i * 62, -430 - mh * .92 + 60], [i * 62 + 26, -430 - mh * .92]], { wash: '#FFFFFF', ink: PAL.ink, sw: 1.5 }); paint([[i * 62 - 26, -430 + mh * .92], [i * 62, -430 + mh * .92 - 50], [i * 62 + 26, -430 + mh * .92]], { wash: '#FFFFFF', ink: PAL.ink, sw: 1.5 }); }
  pop();
}
// A star (glowing, spiky), and its explosion (age 0..1): flash, rings, sparks.
function starBall(x, y, r, t) { glow(x, y, r * 3, '#FFE38F', .9); paint(starPts(x, y, r * 1.4, .55, 8, t), { wash: '#FFF3B0', ink: null }); paint(ellPts(x, y, r, r, 20), { wash: '#FFFFFF', ink: null }); }
function starBlast(x, y, age) {
  if (age < 0 || age > 1.6) return;
  const k = easeOut(clamp(age / 1.2));
  glow(x, y, 300 + 1400 * k, '#FFE38F', 1 - clamp(age / 1.6));
  for (let i = 0; i < 3; i++) { const r = (200 + 900 * k) * (1 - i * .2); inkLine(ellPts(x, y, r, r, 40).concat([ellPts(x, y, r, r, 40)[0]]), 14 * (1 - k) + 2, ['#FFFFFF', '#FFD24A', '#FF7A3A'][i], 'ink', 0); }
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + hash(i) * .3, d = (120 + 900 * hash(i + 2)) * k; paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d, 18 * (1 - k) + 4, 18 * (1 - k) + 4, 8), { wash: i % 2 ? '#FFB347' : '#FFF3B0', ink: null }); }
}
function fireball(x, y, r, t) { glow(x, y, r * 2.4, '#FF8A3A', .8); paint(ellPts(x, y, r, r, 18), { wash: '#FF7A3A', sw: 2 }); paint(ellPts(x - r * .2, y - r * .2, r * .55, r * .55, 14), { wash: '#FFE38F', ink: null }); for (let i = 0; i < 3; i++) paint(ellPts(x + r * (1.2 + i * .5), y + Math.sin(t * 20 + i) * r * .3, r * (.5 - i * .12), r * (.4 - i * .1), 10), { wash: '#FFB347', washOp: 200, ink: null }); }

// Model sheet for review: studio.html?loop=models  (render: --loop=models --still=0.5)
LOOPS.models = t => {
  paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#F3EBDC', ink: null });
  pumpkin(300, 800, 46, { ...face('smug'), aL: .6, aR: .6, draw: sharkHood(0), boilKey: 'm1' });
  pip(300, 800 - 13.1 * 46 + 30, 46 * .8, { ...face('smug'), aL: .6, aR: .6, draw: pipSharkHood(0), noShadow: true, boilKey: 'm2' });
  dusty(800, 800, 46, { boilKey: 'm3' });
  pumpkin(250, 1600, 40, { ...face('happy'), view: 'q', draw: sharkHood(1), boilKey: 'm4' });
  dusty(560, 1600, 40, { view: 'q', aR: 1.4, mouth: 'smirk', boilKey: 'm5' });
  pip(880, 1600, 40, { ...face('surprised'), view: 'q', draw: pipSharkHood(1), boilKey: 'm6' });
};
LOOPS.models.len = 2;

// ---------- this story: The Midnight Fridge ----------
const FY1 = 1560, KIT = { floor: 1310, fridge: [1480, 1310], counter: [300, 1310], clock: [700, 520], door: [0, 240] };
const NC = { wall: '#E9DFB8', tile: '#DDD1A3', floor: '#C8B48A', floorDk: '#A8946C', cab: '#7FA7B5', cabDk: '#5F8796', top: '#EDEDED', fridge: '#F4F6F8', fridgeDk: '#C9D0D8', inside: '#EAF6FF' };
// The night: a deep-blue veil over the whole frame (screen space). k 0..1.
function night(k = 1) { if (k <= 0) return; CTX.save(); CTX.setTransform(1, 0, 0, 1, 0, 0); CTX.fillStyle = `rgba(12,16,52,${.72 * k})`; CTX.fillRect(0, 0, W, H); CTX.restore(); }
// A pool of light (drawn after night()) at (x, y) world, radius r.
function lightPool(x, y, r, col = '#FFE9A8', a = .7) { glow(x, y, r, col, a); }
// The kitchen, face-on: doorway to the living room LEFT, counter + cupboards, wall clock, the fridge RIGHT.
function kitchen(t, o = {}) {
  boilSeed('kitchen1');
  paint(rectPts(-800, -600, 3600, KIT.floor + 600), { wash: NC.wall, ink: null });
  for (let i = 0; i < 12; i++) inkLine([[-800, 700 + i * 50], [2800, 700 + i * 50]], 1, NC.tile, 'ink', 0);
  for (let j = -16; j < 56; j++) inkLine([[j * 50, 700], [j * 50, 1290]], 1, NC.tile, 'ink', 0);
  paint(rectPts(-800, KIT.floor, 3600, 1000), { wash: NC.floor, ink: null });
  for (let i = -16; i < 40; i++) for (let k = 0; k < 6; k++) if ((i + k) % 2) paint(rectPts(i * 120, KIT.floor + k * 70 * (1 + k * .15), 120, 70 * (1 + k * .15)), { wash: NC.floorDk, washOp: 120, ink: null });
  // doorway (dark living room beyond)
  paint(rectPts(KIT.door[0] - 20, 520, KIT.door[1] + 40, KIT.floor - 520), { wash: '#F6F0DA', sw: 1.4 });
  paint(rectPts(KIT.door[0], 540, KIT.door[1], KIT.floor - 540), { wash: '#3A3550', ink: null });
  // counter + cupboards
  const [cx, cy] = KIT.counter;
  paint(rectPts(cx, cy - 380, 760, 380), { wash: NC.cab, sw: 1.4, shade: true, shadeK: .4 });
  for (let i = 0; i < 4; i++) { paint(rrPts(cx + 20 + i * 185, cy - 340, 165, 300, 10), { wash: mixCol(NC.cab, '#FFFFFF', .1), sw: 1 }); paint(ellPts(cx + 85 + i * 185 + (i % 2) * 40, cy - 190, 8, 8, 8), { wash: '#E9D7A8', ink: null }); }
  paint(rrPts(cx - 20, cy - 410, 800, 40, 8), { wash: NC.top, sw: 1.3 });
  paint(rectPts(cx, 420, 760, 200), { wash: NC.cab, sw: 1.2 });   // wall cupboards
  // wall clock (hands at t-driven time, midnight at the start)
  const [kx, ky] = KIT.clock;
  paint(ellPts(kx, ky - 140, 64, 64, 30), { wash: '#FFFFFF', sw: 2 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; inkLine([[kx + Math.sin(a) * 52, ky - 140 - Math.cos(a) * 52], [kx + Math.sin(a) * 58, ky - 140 - Math.cos(a) * 58]], 2, '#2B2233', 'ink', 0); }
  const mins = o.minutes ?? 0, am = mins / 60 * TAU, ah = mins / 720 * TAU;
  inkLine([[kx, ky - 140], [kx + Math.sin(ah) * 30, ky - 140 - Math.cos(ah) * 30]], 6, '#2B2233', 'ink', 0);
  inkLine([[kx, ky - 140], [kx + Math.sin(am) * 46, ky - 140 - Math.cos(am) * 46]], 4, '#2B2233', 'ink', 0);
  fridge(t, o.fridgeOpen || 0, o);
}
// The fridge at KIT.fridge (x = middle, y = floor). open 0..1 swings the door right; the inside glows.
function fridge(t, open = 0, o = {}) {
  const [x, y] = KIT.fridge, w = 360, h = 820, top = y - h;
  paint(rrPts(x - w / 2, top, w, h, 30), { wash: NC.fridge, sw: 2, shade: true, shadeK: .3 });
  if (open > .01) {
    // the inside: shelves, the cake on the top shelf
    paint(rrPts(x - w / 2 + 16, top + 250, w - 32, h - 270, 16), { wash: NC.inside, sw: 1.4 });
    for (const sy of [top + 470, top + 650]) inkLine([[x - w / 2 + 20, sy], [x + w / 2 - 20, sy]], 5, '#B9D3E8', 'ink', 0);
    if (o.cake !== false) cakeSlice(x - 20, top + 465, 1, o.label !== false);
    paint(rectPts(x + 90, top + 520, 50, 120), { wash: '#FFFFFF', sw: 1 }); paint(rectPts(x + 90, top + 500, 50, 24), { wash: '#4F9BD9', sw: 1 });   // a milk carton
    glow(x, top + 400, 360 * open, '#DDF2FF', .6 * open);
    // the door, swung open (a narrowing panel to the right)
    const dw = w * (1 - open * .85);
    paint([[x + w / 2, top + 240], [x + w / 2 + dw * .25 + 40 * open, top + 240 - 20 * open], [x + w / 2 + dw * .25 + 40 * open, y + 10 * open], [x + w / 2, y - 6]], { wash: NC.fridgeDk, sw: 1.4 });
  } else {
    inkLine([[x - w / 2 + 10, top + 240], [x + w / 2 - 10, top + 240]], 3, NC.fridgeDk, 'ink', 0);
    paint(rrPts(x - w / 2 + 26, top + 300, 18, 200, 8), { wash: '#B9C2CC', sw: 1 });
  }
  paint(rrPts(x - w / 2 + 26, top + 60, 18, 120, 8), { wash: '#B9C2CC', sw: 1 });   // freezer handle
  if (o.note) { paint(rectPts(x - 60, top + 320, 110, 90), { wash: '#FFF6A8', sw: 1 }); }
}
// The last slice of strawberry cake (with its DO NOT EAT flag). (x, y) = bottom middle.
function cakeSlice(x, y, s = 1, label = true, shine = 0) {
  push(); translate(x, y); scale(s, s);
  paint([[-80, 0], [70, 0], [70, -80], [-80, -95]], { wash: '#F6E3C6', sw: 1.4 });   // sponge side
  for (const yy of [-28, -56]) inkLine([[-78, yy], [68, yy - 4]], 7, '#F49AC1', 'ink', 0);   // cream + jam layers
  paint([[-80, -95], [70, -80], [40, -110], [-100, -122]], { wash: '#FFF7F0', sw: 1.3 });   // icing top
  paint(ellPts(-20, -122, 22, 18, 14), { wash: '#E2343F', sw: 1.2 }); paint([[-26, -138], [-20, -150], [-12, -138]], { wash: '#4FA060', ink: null });   // strawberry
  if (label) { inkLine([[40, -100], [40, -190]], 3, '#8E6A55', 'ink', 0); paint(rectPts(40, -190, 120, 52), { wash: '#FFFFFF', sw: 1.2 }); }
  if (shine) for (let i = 0; i < 4; i++) paint(starPts(-120 + i * 80, -170 - (i % 2) * 40, 18 * shine, .22, 4), { wash: '#FFFFFF', ink: null });
  pop();
  // letter() works in world (camera) coordinates, not in the local transform: place the label text by hand
  if (label) { letter('DO NOT', x + 100 * s, y - 175 * s, 20 * s, '#E2343F', { font: `800 ${20 * s}px "Baloo 2", sans-serif` }); letter('EAT', x + 100 * s, y - 152 * s, 22 * s, '#E2343F', { font: `800 ${22 * s}px "Baloo 2", sans-serif` }); }
}
// Pip's flashlight (right paw hook) and the glow it throws up his face when held under his chin.
function flashHook(on = 1) { return (u, sw) => { paint(rrPts(-.1 * u, -.22 * u, 1.3 * u, .44 * u, .15 * u), { wash: '#3B3F4A', sw: sw * .6 }); paint(ellPts(1.25 * u, 0, .14 * u, .3 * u, 10), { wash: on ? '#FFF3B0' : '#888', sw: sw * .4 }); }; }
// The crayon plan: a sheet of paper (in Pip's paws, or full-screen in the fantasy).
function planPaper(x, y, w, h, rot = 0) {
  push(); translate(x, y); rotate(rot);
  paint(rectPts(-w / 2, -h / 2, w, h), { wash: '#FBF6E8', sw: 1.4 });
  for (let i = 1; i < 8; i++) inkLine([[-w / 2, -h / 2 + i * h / 8], [w / 2, -h / 2 + i * h / 8]], 1, '#BFD6EA', 'ink', 0);
  crayon([[-w * .35, h * .25], [-w * .1, -h * .05], [w * .15, h * .2]], '#E2463F', w / 120);   // an arrow-ish squiggle
  crayon([[w * .15, -h * .3], [w * .35, -h * .3], [w * .35, h * .3], [w * .15, h * .3], [w * .15, -h * .3]], '#4F7FC9', w / 120);   // the "fridge"
  crayon([[w * .2, -h * .05], [w * .3, -h * .05]], '#E2463F', w / 100);
  letter('CAKE!', w * .25, -h * .38, h * .14, '#E2463F', { font: `800 ${h * .14}px "Baloo 2", sans-serif` });
  pop();
}
// a wobbly crayon stroke (thick, slightly jittered, deterministic)
function crayon(P, col, wdt = 6, seed = 1) {
  const pts = []; for (let i = 0; i < P.length - 1; i++) { const [a, b] = [P[i], P[i + 1]]; for (let k = 0; k < 8; k++) { const f = k / 8; pts.push([lerp(a[0], b[0], f) + (hash(i * 9 + k + seed) - .5) * wdt * .8, lerp(a[1], b[1], f) + (hash(i * 7 + k + seed + 3) - .5) * wdt * .8]); } }
  pts.push(P[P.length - 1]); inkLine(pts, wdt, col, 'ink', 0); inkLine(pts.map(([a, b]) => [a + wdt * .3, b + wdt * .2]), wdt * .4, mixCol(col, '#FFFFFF', .35), 'ink', 0);
}
// Spy outfits (draw hooks). Pip: his scarf tied as a ninja mask across his eyes. Pumpkin: a too-small black sweater + war paint.
const ninjaMask = (q = 0) => (u, sw) => { const cx = q * .25 * u, cy = -4.75 * u; paint(rrPts(cx - 1.6 * u, cy - .45 * u, 3.2 * u, .7 * u, .3 * u), { wash: '#2E3A34', sw: sw * .7 }); for (const s of [-1, 1]) paint(ellPts(cx + s * .58 * u + q * .3 * u, cy - .1 * u, .32 * u, .26 * u, 10), { wash: '#FFFFFF', ink: null }); paint(ribbon([[cx + 1.5 * u, cy - .1 * u], [cx + 2.4 * u, cy + .3 * u], [cx + 2.8 * u, cy + .1 * u]], .3 * u, .2 * u), { wash: '#2E3A34', sw: sw * .5 }); };
const blackSweater = (rip = 0) => (u, sw) => {
  const pts = [[-3.6, -5.6], [3.6, -5.6], [4.3, -4.6], [3.7, -2.9], [-3.7, -2.9], [-4.3, -4.6]].map(([a, b]) => [a * u, b * u]);
  paint(pts, { wash: '#262A33', sw, curv: .3, shade: true, shadeK: .4 });
  if (rip > 0) { for (let i = 0; i < 3; i++) paint(ellPts((-1 + i) * 1.3 * u, -4.2 * u + (i % 2) * .3 * u, .45 * u * rip, .7 * u * rip, 10), { wash: PUMPKIN_COL.lt, sw: sw * .5 }); }
  for (const s of [-1, 1]) for (const k of [0, 1]) inkLine([[s * 1.1 * u - .4 * u, -8.1 * u + k * .35 * u], [s * 1.1 * u + .4 * u, -8.1 * u + k * .35 * u]], sw * 2.2, '#262A33', 'ink', 0);   // war paint under the eyes
};
// A potted plant (Pip hides behind it).
function pottedPlant(x, y, s = 1) { push(); translate(x, y); scale(s, s); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .32; paint(ribbon([[0, -150], [Math.cos(a) * 110, -150 + Math.sin(a) * 160], [Math.cos(a) * 170, -150 + Math.sin(a) * 200]], 40, 10), { wash: i % 2 ? '#4FA060' : '#3E8A50', sw: 1.2 }); } paint([[-80, -150], [80, -150], [60, 0], [-60, 0]], { wash: '#C66A4A', sw: 1.4, shade: true, shadeK: .4 }); pop(); }
// The vacuum's searchlight: a cone from (x, y) at angle a (radians, 0 = right), length L, half-width spread.
function searchlight(x, y, a, L = 900, spread = .22, k = 1) {
  if (k <= 0) return;
  const p1 = [x + Math.cos(a - spread) * L, y + Math.sin(a - spread) * L], p2 = [x + Math.cos(a + spread) * L, y + Math.sin(a + spread) * L];
  paint([[x, y], p1, p2], { wash: '#FFF3B0', washOp: 70 * k, ink: null });
  glow(lerp(p1[0], p2[0], .5), lerp(p1[1], p2[1], .5), L * .35, '#FFF3B0', .45 * k);
}
// The lampshade (from story 08) and Pumpkin's lampshade hook.
function lampShade(x, y, s = 1, rot = 0) {
  push(); translate(x, y); rotate(rot); scale(s, s);
  paint([[-70, -150], [70, -150], [112, 0], [-112, 0]], { wash: '#F3E3B5', sw: 1.4, shade: true, shadeK: .35 });
  inkLine([[-112, 0], [112, 0]], 3.4, '#D7C08A', 'ink', 0); inkLine([[-70, -150], [70, -150]], 2.4, '#D7C08A', 'ink', 0);
  pop();
}
const shadeHook = (q = 0) => (u, sw) => lampShade(q * .55 * u, -10.3 * u, u / 40 * 1.75);
