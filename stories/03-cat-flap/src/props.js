// props.js: the sets and props of "The Cat Flap" (flat style, 1080 x 1920 world = screen at zoom 1).
// Two sets:
//   kitchenFront(): the kitchen seen face-on: wallpaper, floor, the back door with the cat flap in the middle.
//   sideWall():      the same door seen edge-on: kitchen on the LEFT, garden on the RIGHT, the wall a band at x = SW.x.
// Geography never flips: in side views the kitchen is always left and the garden right.
const KF = { doorX: 270, doorY: 470, doorW: 540, doorH: 900, floor: 1370,
             flap: { x: 400, y: 1062, w: 280, h: 300 }, dish: { x: 335, y: 1470 }, hole: { x: 930, y: 1370 }, bucket: { x: 110, y: 1580 } };
const SW = { x: 430, w: 86, floor: 1450, top: 560, holeTop: 1080 };
const KC = { wall: '#F2D9B8', wall2: '#EACB9F', base: '#D9B27F', floor: '#C09062', floorDk: '#A27650', door: '#7FB3A8', doorDk: '#5E9086',
             flap: '#CFE6F0', knob: '#EEC35A', sky: '#BFE6F5', sky2: '#E4F4F7', grass: '#8CC66B', grassDk: '#6FA854', fence: '#F6E8CC',
             brick: '#E2B488', wallCut: '#CF9E70', bucket: '#7FA6C9', bucketDk: '#5D84A8', water: '#A9DCEC', pie: '#E7B868', pieDk: '#B9833F', dish: '#DCE8EE' };

function kitchenFront(t, o = {}) {
  boilSeed('kitchen');
  paint(rectPts(-400, -400, W + 800, KF.floor + 400), { wash: KC.wall, ink: null });
  for (let i = -3; i < 14; i++) paint(rectPts(i * 100 + 25, -400, 42, KF.floor + 400), { wash: KC.wall2, ink: null });
  paint(rectPts(-400, KF.floor - 40, W + 800, 44), { wash: KC.base, ink: null });
  paint(rectPts(-400, KF.floor, W + 800, 1200), { wash: KC.floor, ink: null });
  for (let i = 0; i < 8; i++) inkLine([[-400, KF.floor + 60 + i * 70 + i * i * 6], [W + 400, KF.floor + 60 + i * 70 + i * i * 6]], 1.6, KC.floorDk, 'ink', 0);
  // the door, its window and the knob
  const d = KF;
  paint(rectPts(d.doorX - 24, d.doorY - 24, d.doorW + 48, d.doorH + 24), { wash: mixCol(KC.door, '#FFFFFF', .25), ink: null });
  paint(rectPts(d.doorX, d.doorY, d.doorW, d.doorH), { wash: KC.door, sw: 1.6, shade: true, shadeK: .4 });
  paint(rectPts(d.doorX + 50, d.doorY + 50, d.doorW - 100, 300), { wash: '#D8F0F6', sw: 1.2 });
  inkLine([[d.doorX + d.doorW / 2, d.doorY + 50], [d.doorX + d.doorW / 2, d.doorY + 350]], 1.5, KC.doorDk, 'ink', 0);
  inkLine([[d.doorX + 50, d.doorY + 200], [d.doorX + d.doorW - 50, d.doorY + 200]], 1.5, KC.doorDk, 'ink', 0);
  paint(ellPts(d.doorX + d.doorW - 60, d.doorY + 470, 18, 18, 18), { wash: KC.knob, sw: 1 });
  catFlapHole(o.flapOpen ?? 0);
  // the mouse hole in the skirting board, right
  paint([...arcPts(d.hole.x, d.hole.y, 34, 46, Math.PI, TAU, 10)], { wash: '#3A2A2E', ink: null });
  if (o.dish !== false) pieDish(d.dish.x, d.dish.y, 1, o.pie ?? 0);
  if (o.bucket !== false) mopBucket(d.bucket.x, d.bucket.y, 1, o.bucketWob || 0);
}
// The cat-flap opening (dark: the garden is in shade) and its frame. open 0..1 swings the plastic flap up.
function catFlapHole(open = 0, dark = '#2E3B36') {
  const f = KF.flap;
  paint(rrPts(f.x - 18, f.y - 18, f.w + 36, f.h + 18, 22), { wash: KC.doorDk, sw: 1.4 });
  paint(rrPts(f.x, f.y, f.w, f.h, 14), { wash: dark, ink: null });
  if (open < .98) { const h = f.h * (1 - open); paint(rrPts(f.x + 6, f.y + 4, f.w - 12, Math.max(4, h - 4), 10), { wash: KC.flap, washOp: 200, sw: .9 }); }
}
function catFlapFrame() {   // the frame alone, drawn over a stuck cat so the fur sits behind its top edge
  const f = KF.flap;
  paint(rrPts(f.x - 18, f.y - 18, f.w + 36, 30, 12), { wash: KC.doorDk, sw: 1.2 });
  paint(rectPts(f.x - 18, f.y - 6, 18, f.h + 6), { wash: KC.doorDk, ink: null });
  paint(rectPts(f.x + f.w, f.y - 6, 18, f.h + 6), { wash: KC.doorDk, ink: null });
}

// The door edge-on: the kitchen (left) and garden (right) on either side of the wall band at SW.x.
function sideWall(t, o = {}) {
  boilSeed('side');
  // kitchen side
  paint(rectPts(-600, -600, SW.x + 600, SW.floor + 600), { wash: KC.wall, ink: null });
  for (let i = -6; i < 5; i++) paint(rectPts(i * 100 + 25, -600, 42, SW.floor + 600), { wash: KC.wall2, ink: null });
  paint(rectPts(-600, SW.floor - 40, SW.x + 600, 44), { wash: KC.base, ink: null });
  paint(rectPts(-600, SW.floor, SW.x + 600, 1200), { wash: KC.floor, ink: null });
  // garden side
  paint(rectPts(SW.x, -600, W + 800, SW.floor - 120 + 600), { wash: KC.sky, ink: null });
  paint(ellPts(SW.x + 520, 420, 320, 120, 30), { wash: KC.sky2, ink: null });
  paint(ellPts(W + 120, 330, 260, 90, 30), { wash: KC.sky2, ink: null });
  for (let i = 0; i < 12; i++) { const x = SW.x + 40 + i * 92; paint([[x, SW.floor - 120], [x, SW.floor - 380], [x + 32, SW.floor - 420], [x + 64, SW.floor - 380], [x + 64, SW.floor - 120]], { wash: KC.fence, sw: .9 }); }
  inkLine([[SW.x, SW.floor - 330], [W + 600, SW.floor - 330]], 3, mixCol(KC.fence, '#2A1A30', .25), 'ink', 0);
  paint(rectPts(SW.x, SW.floor - 130, W + 800, 1300), { wash: KC.grass, ink: null });
  for (let i = 0; i < 30; i++) { const x = SW.x + 30 + hash(i) * 1200, y = SW.floor - 100 + hash(i + 50) * 500; inkLine([[x, y], [x + 6, y - 22], [x + 12, y]], 1.4, KC.grassDk, 'ink', .3); }
  // the wall cut: brick above the door, the door itself edge-on (teal, with its frame), the mouse hole at its garden foot
  paint(rectPts(SW.x - SW.w / 2 - 14, SW.top - 1200, SW.w + 28, 1200), { wash: KC.wallCut, sw: 1.2 });
  for (let i = 0; i < 14; i++) inkLine([[SW.x - SW.w / 2 - 14, SW.top - 30 - i * 80], [SW.x + SW.w / 2 + 14, SW.top - 30 - i * 80]], 1, mixCol(KC.wallCut, '#2A1A30', .3), 'ink', 0);
  sideDoor(SW.floor + 30);
  paint([...arcPts(SW.x + SW.w / 2 + 2, SW.floor, 26, 36, Math.PI * 1.5, TAU, 6), [SW.x + SW.w / 2 + 2, SW.floor]], { wash: '#3A2A2E', ink: null });
}
// The parts of the wall band in FRONT of a cat passing through: above the hole (pressing on the back) and the sill.
function sideDoor(bottom) {
  paint(rectPts(SW.x - SW.w / 2, SW.top, SW.w, bottom - SW.top), { wash: KC.door, sw: 1.3 });
  for (const dx of [-SW.w / 2 + 12, SW.w / 2 - 12]) inkLine([[SW.x + dx, SW.top + 10], [SW.x + dx, bottom - 10]], 1.1, KC.doorDk, 'ink', 0);
  paint(rectPts(SW.x - SW.w / 2 - 10, SW.top - 16, SW.w + 20, 22), { wash: KC.doorDk, sw: 1 });
}
// squeeze: 0..1, how hard the frame bites into a stuck cat (fold marks either side of the door).
function sideWallOver(holeTop = SW.holeTop, squeeze = 0) {
  sideDoor(holeTop);
  paint(rectPts(SW.x - SW.w / 2 - 8, holeTop - 14, SW.w + 16, 22), { wash: KC.doorDk, sw: 1 });
  paint([[SW.x - SW.w / 2 + 6, holeTop + 4], [SW.x + SW.w / 2 - 6, holeTop + 4], [SW.x + SW.w / 2 + 10, holeTop + 40], [SW.x - SW.w / 2 - 10, holeTop + 40]], { wash: KC.flap, washOp: 190, sw: .8 });
  paint(rectPts(SW.x - SW.w / 2 - 8, SW.floor - 8, SW.w + 16, 16), { wash: KC.doorDk, sw: 1 });
  if (squeeze > .05) for (const s of [-1, 1]) for (let k = 0; k < 2; k++) {
    const x = SW.x + s * (SW.w / 2 + 16 + k * 16), y = holeTop + 20;
    inkLine([[x, y], [x + s * 10, y + 22 * squeeze], [x, y + 44 * squeeze]], 1.6, '#B4572A', 'ink', .5);
  }
}

// The pie dish on the floor, k = how much pie is left (1 full, 0 crumbs).
function pieDish(x, y, s = 1, k = 1) {
  boilSeed('dish');
  paint(ellPts(x, y + 8 * s, 120 * s, 26 * s, 26), { fill: '#3A2A2E', fillOp: 60, ink: null });
  paint(ellPts(x, y, 115 * s, 34 * s, 28), { wash: KC.dish, sw: 1.2 });
  paint(ellPts(x, y - 4 * s, 92 * s, 24 * s, 28), { wash: mixCol(KC.dish, '#7A8C99', .2), ink: null });
  if (k > .02) {
    const a0 = -Math.PI / 2, a1 = a0 + TAU * clamp(k);
    const wedge = [[x, y - 20 * s], ...arcPts(x, y - 20 * s, 88 * s, 26 * s, a0, a1, 20)];
    paint(wedge.map(([a, b]) => [a, b + 14 * s]), { wash: KC.pieDk, ink: null });
    paint(wedge, { wash: KC.pie, sw: 1 });
    for (let i = 0; i < 5; i++) { const a = a0 + (i + .5) / 5 * TAU; if ((i + .5) / 5 < k) inkLine([[x + Math.cos(a) * 30 * s, y - 20 * s + Math.sin(a) * 8 * s], [x + Math.cos(a) * 66 * s, y - 20 * s + Math.sin(a) * 19 * s]], 1.2, KC.pieDk, 'ink', 0); }
    if (k > .5) {   // a fish tail sticking out of the crust
      const fx = x + 20 * s, fy = y - 34 * s;
      paint([[fx, fy], [fx + 30 * s, fy - 34 * s], [fx + 42 * s, fy - 20 * s], [fx + 26 * s, fy + 4 * s]], { wash: '#9BC7D8', sw: .9 });
    }
  } else for (let i = 0; i < 6; i++) paint(ellPts(x - 50 * s + hash(i) * 100 * s, y - 6 * s + hash(i + 9) * 12 * s, 5 * s, 3 * s, 8), { wash: KC.pieDk, ink: null });
}

// The mop bucket, front view: back rim and water, then (draw the cat here), then the front. wob: a slosh 0..1.
function mopBucketBack(x, y, s = 1, wob = 0) {
  boilSeed('bucketB');
  paint(ellPts(x, y - 230 * s, 120 * s, 30 * s, 28), { wash: KC.bucketDk, sw: 1.2 });
  paint(ellPts(x, y - 226 * s + Math.sin(T * 14) * 4 * wob, 108 * s, 24 * s, 28), { wash: KC.water, ink: null });
}
function mopBucketFront(x, y, s = 1, wob = 0) {
  boilSeed('bucketF');
  const r = Math.sin(T * 16) * .04 * wob;
  push(); translate(x, y); rotate(r); translate(-x, -y);
  paint(ellPts(x, y + 6 * s, 120 * s, 22 * s, 24), { fill: '#3A2A2E', fillOp: 60, ink: null });
  paint([[x - 120 * s, y - 230 * s], [x + 120 * s, y - 230 * s], [x + 96 * s, y], [x - 96 * s, y]], { wash: KC.bucket, sw: 1.4, shade: true, shadeK: .6 });
  for (const yy of [-170, -70]) inkLine([[x - (114 - (230 + yy) * .1) * s, (y + yy * s)], [x + (114 - (230 + yy) * .1) * s, (y + yy * s)]], 1.4, KC.bucketDk, 'ink', 0);
  inkLine(arcPts(x, y - 230 * s, 118 * s, 150 * s, Math.PI * 1.08, Math.PI * 1.92, 14), 2, '#5A6A7A', 'ink', .5);
  paint(ellPts(x, y - 230 * s, 120 * s, 30 * s, 28), { ink: PAL.ink, sw: 1.2 });
  pop();
}
function mopBucket(x, y, s = 1, wob = 0) { mopBucketBack(x, y, s, wob); mopBucketFront(x, y, s, wob); }

// Effects ------------------------------------------------------------------------------------------------
// A burst of speed/impact lines around (x, y): age 0..1 grows and fades them.
function burst(x, y, r, age, n = 10, col = '#FFF4D6', seed = 1) {
  if (age < 0 || age > 1) return;
  const k = easeOut(age), a = 1 - age;
  for (let i = 0; i < n; i++) {
    const ang = i / n * TAU + hash(i + seed) * .4, r0 = r * (.45 + .35 * k), r1 = r * (.7 + .7 * k);
    inkLine([[x + Math.cos(ang) * r0, y + Math.sin(ang) * r0], [x + Math.cos(ang) * r1, y + Math.sin(ang) * r1]], 4 * a + .5, col, 'ink', 0);
  }
}
// Water drops flying out of a splash at (x, y): age in seconds.
function splash(x, y, s, age, n = 12) {
  if (age < 0 || age > 1.1) return;
  for (let i = 0; i < n; i++) {
    const dir = (hash(i * 3.1) - .5) * 2, sp = .6 + hash(i * 7.7) * .7, k = age / (.9 + hash(i) * .2);
    if (k > 1) continue;
    const p = arcPt([x, y], [x + dir * 260 * s * sp, y + 120 * s], (170 + 160 * hash(i * 5)) * s, k);
    paint(ellPts(p[0], p[1], 12 * s * (1 - k * .5), 16 * s * (1 - k * .5), 10), { wash: KC.water, sw: .6 });
  }
}
function bubbles(x, y, s, t0, n = 5) {
  for (let i = 0; i < n; i++) {
    const a = T - t0 - i * .25; if (a < 0 || a > 1.4) continue;
    const r = (9 + hash(i) * 10) * s;
    paint(ellPts(x + (hash(i * 3) - .5) * 120 * s + Math.sin(a * 6 + i) * 8, y - a * 160 * s, r, r, 14), { wash: '#E9F7FC', washOp: 220, sw: .6 });
  }
}
// A comic "POP" / "BOING" puff cloud behind a point (no letters: the shape and the burst carry it).
function puffCloud(x, y, r, age) {
  if (age < 0 || age > .7) return;
  const k = easeOut(age / .7), a = 1 - age / .7;
  for (let i = 0; i < 7; i++) { const ang = i / 7 * TAU; paint(ellPts(x + Math.cos(ang) * r * k, y + Math.sin(ang) * r * k * .7, r * .45 * a + 2, r * .4 * a + 2, 16), { wash: '#FFFFFF', washOp: 230 * a, ink: null }); }
}
// clip(rects, fn): draw fn() only inside the union of [x, y, w, h] rectangles (in the current camera's world space).
function clipRects(rects, fn) {
  push(); CTX.beginPath(); for (const [x, y, w, h] of rects) CTX.rect(x, y, w, h); CTX.clip(); fn(); pop();
}
