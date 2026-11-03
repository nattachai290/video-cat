// props.js: "The Robot Vacuum": the living room from story 04 (same layout and colours), plus a curtain by the window,
// the vacuum's charging dock under the armchair, the cracker-crumb trail and the robot vacuum itself.
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

// ---------- story 07: the big box, the royal bed, the tiny cracker box ----------
const BOX = { x: 560, y: 1560, w: 300, h: 230, d: 70 }, BED = { x: 80, y: 1560, s: 1.2 }, TINY = { x: 840, y: 1560, w: 120, h: 96 };
const BC = { card: '#D9A86A', cardDk: '#B8864C', cardIn: '#7A5A36', tape: '#E9D7A8', bed: '#8E63C9', bedDk: '#6A47A0', bedIn: '#C7B3EC', gold: '#F2C14E' };
// The big box. open: 0 shut .. 1 flaps open; wig: a wiggle angle; inside(): draw what's in it (between back and front).
function bigBox(t, o = {}) {
  const { x, y, w, h, d } = BOX, open = o.open || 0, top = y - h;
  push(); translate(x, y); rotate(o.wig || 0); translate(-x, -y);
  // the back and the inside (dark) when open
  if (open > .02) paint([[x - w / 2, top], [x - w / 2 + d * .6, top - d * .5], [x + w / 2 + d * .6, top - d * .5], [x + w / 2, top]], { wash: BC.cardIn, sw: 1.2 });
  if (o.inside) o.inside();
  // front face and side
  paint([[x + w / 2, y], [x + w / 2 + d * .6, y - d * .5], [x + w / 2 + d * .6, top - d * .5], [x + w / 2, top]], { wash: BC.cardDk, sw: 1.3 });
  paint(rectPts(x - w / 2, top, w, h), { wash: BC.card, sw: 1.4, shade: true, shadeK: .35 });
  inkLine([[x - w / 2 + 30, top + 60], [x - w / 2 + 110, top + 60]], 2.5, BC.cardDk, 'ink', 0);
  paint([[x - 18, top], [x + 18, top], [x + 18, top + 70], [x - 18, top + 70]], { wash: BC.tape, ink: null });
  // flaps: shut = a lid on top; open = four flaps folded out
  if (open <= .02) { paint([[x - w / 2, top], [x - w / 2 + d * .6, top - d * .5], [x + w / 2 + d * .6, top - d * .5], [x + w / 2, top]], { wash: mixCol(BC.card, '#FFFFFF', .1), sw: 1.2 }); inkLine([[x - w / 2 + d * .3, top - d * .25], [x + w / 2 + d * .3, top - d * .25]], 1.4, BC.cardDk, 'ink', 0); }
  else {
    const k = open;
    paint([[x - w / 2, top], [x + w / 2, top], [x + w / 2 - 10, top + 8 - 90 * k], [x - w / 2 + 10, top + 8 - 90 * k]].map(([a, b]) => [a, b]), { wash: mixCol(BC.card, '#FFFFFF', .08), sw: 1.2 });   // front flap up
    paint([[x - w / 2, top], [x - w / 2 - 80 * k, top - 40 * k], [x - w / 2 - 70 * k + d * .6, top - 40 * k - d * .5], [x - w / 2 + d * .6, top - d * .5]], { wash: BC.cardDk, sw: 1.1 });       // left flap
    paint([[x + w / 2, top], [x + w / 2 + 80 * k, top - 40 * k], [x + w / 2 + 90 * k + d * .6, top - 40 * k - d * .5], [x + w / 2 + d * .6, top - d * .5]], { wash: BC.cardDk, sw: 1.1 });   // right flap
  }
  pop();
  return [x, top];   // where something sits on (or pops out of) the box
}
// The royal bed (a purple velvet donut with gold trim and a crown pillow). Draw back(), the sleeper, then front().
function royalBedBack(x, y, s = 1, t = 0) {
  paint(ellPts(x, y - 30 * s, 175 * s, 66 * s, 32), { wash: BC.bedDk, sw: 1.4 });
  paint(ellPts(x, y - 34 * s, 130 * s, 42 * s, 28), { wash: BC.bedIn, ink: null });
  // the crown pillow at the back
  paint([[x - 70 * s, y - 70 * s], [x - 60 * s, y - 120 * s], [x - 30 * s, y - 90 * s], [x, y - 130 * s], [x + 30 * s, y - 90 * s], [x + 60 * s, y - 120 * s], [x + 70 * s, y - 70 * s]], { wash: BC.gold, sw: 1.2 });
  for (const dx of [-60, 0, 60]) paint(ellPts(x + dx * s, y - (dx ? 120 : 130) * s, 9 * s, 9 * s, 10), { wash: '#E2476E', ink: null });
}
function royalBedFront(x, y, s = 1, t = 0, glint = 0) {
  paint([...arcPts(x, y - 30 * s, 175 * s, 66 * s, 0, Math.PI, 18), ...arcPts(x, y - 22 * s, 120 * s, 34 * s, Math.PI, 0, 18)], { wash: BC.bed, sw: 1.4, shade: true, shadeK: .4 });
  inkLine(arcPts(x, y - 26 * s, 172 * s, 62 * s, .1, Math.PI - .1, 18), 3 * s, BC.gold, 'ink', .4);
  if (glint > 0) for (let i = 0; i < 4; i++) { const k = Math.max(0, Math.sin(t * 4 + i * 1.7)); if (k > .3) paint(starPts(x - 150 * s + i * 100 * s, y - 120 * s - (i % 2) * 40 * s, 22 * s * k * glint, .22, 4), { wash: '#FFFFFF', ink: null }); }
}
// A velvet blanket tucked over someone in the bed: from rim to rim, its top edge bulging over the sleeper at px, up to
// chest height (top). Draw it after the sleeper, then royalBedFront().
function royalBedBlanket(x, y, s, px, top) {
  const L = [x - 150 * s, y - 34 * s], R = [x + 150 * s, y - 34 * s];
  const edge = through([L, [px - 95, top + 26], [px - 40, top + 2], [px + 40, top + 2], [px + 95, top + 26], R], 6);
  paint([...edge, ...arcPts(x, y - 30 * s, 150 * s, 44 * s, 0, Math.PI, 16)], { wash: '#B9A0E6', sw: 1.3, shade: true, shadeK: .4 });
  inkLine(edge, 3.2 * s, BC.gold, 'ink', .3);
  inkLine([[px - 30, top + 40], [px - 10, top + 70]], 1.4, '#8E73C4', 'ink', 0); inkLine([[px + 30, top + 42], [px + 12, top + 72]], 1.4, '#8E73C4', 'ink', 0);
}
function royalBed(x, y, s = 1, t = 0, glint = 0) { royalBedBack(x, y, s, t); royalBedFront(x, y, s, t, glint); }
// Pip's cracker box (the "tiny" box; same drawing as the one Pumpkin crams into). s = 1.5 is its size in the film.
function tinyBox(x, y, s = 1, rot = 0) {
  const w = 160 * s, h = 133 * s, rim = y - h;
  push(); translate(x, y); rotate(rot); translate(-x, -y);
  paint([[x - w / 2, rim], [x - w / 2 + 26, rim - 18], [x + w / 2 + 26, rim - 18], [x + w / 2, rim]], { wash: '#C99A55', sw: 1.2 });
  crackerFront(x, y, w, h, 0, false);
  paint([[x - 20, rim], [x + 20, rim], [x + 20, rim + 60], [x - 20, rim + 60]], { wash: '#E9D7A8', ink: null });
  pop();
}

// Pumpkin crammed into the tiny box (option B, chosen by the user): only his head (and dangling paws) stick out of a
// swollen box; the tape pops. sink 0..1: from sitting on top of it to all the way in. o: extra pumpkin() options.
const TINYS = 1.5;
function crammed(t, sink, o = {}) {
  const cx = TINY.x, floor = TINY.y, w = 240, h = 200, rim = floor - h, U = 40, k = clamp(sink);
  paint([[cx - w / 2, rim], [cx - w / 2 + 26, rim - 18], [cx + w / 2 + 26, rim - 18], [cx + w / 2, rim]], { wash: '#7A5A36', sw: 1.2 });
  const feetY = lerp(rim + 10, rim + 8.2 * U - 10, ease(k));
  clipRects([[-600, -600, 2400, rim + 600 - 2]], () => pumpkin(cx, feetY, U, { sq: -.05 * k, aL: -1.4, aR: -1.4, noShadow: true, noTail: true, boilKey: 'pk', ...o }));
  crackerFront(cx, floor, w, h, 1.6 * ease(k), k > .7);
  if (k > .7) paint([[cx + w / 2 - 50, rim + 2], [cx + w / 2 - 14, rim + 2], [cx + w / 2 + 6, rim - 34], [cx + w / 2 - 34, rim - 42]], { wash: '#E9D7A8', sw: 1 });   // the tape, popped
  else paint([[cx - 20, rim], [cx + 20, rim], [cx + 20, rim + 60], [cx - 20, rim + 60]], { wash: '#E9D7A8', ink: null });
  if (k > .6) for (const s of [-1, 1]) { const px = cx + s * 70; paint(ellPts(px, rim + 34, 30, 40, 18), { wash: PUMPKIN_COL.col, sw: 1.4, shade: true, shadeK: .5 }); for (const kk of [-1, 0, 1]) inkLine([[px + kk * 9, rim + 52], [px + kk * 10, rim + 68]], 1.2, '#8A4A22', 'inkfine', 0); }
  paint(ribbon([[cx + w / 2 + 6, floor - 30], [cx + w / 2 + 60, floor - 50], [cx + w / 2 + 50 + Math.sin(t * 3) * 10, floor - 120]], 30, 22), { wash: PUMPKIN_COL.col, sw: 1.4 });   // the tail
}
