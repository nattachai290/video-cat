// props.js: "Bath Time": the series' living room (stories 04, 06, 07) plus a floor lamp, a wider curtain Pumpkin
// hides behind, rug lumps, a wooden bubble tub, Pip's bath kit (shower cap, scrub brush, rubber duck) and bubbles.
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

// ---------- story 08 ----------
const BC8 = { cap: '#F49AC1', capDk: '#D46A9A', dot: '#FFFFFF', wood: '#C98B52', woodDk: '#9C6435', band: '#8D96A3', water: '#BFE6F5',
              foam: '#FFFFFF', foamSh: '#DCEBF5', duck: '#FFD23F', duckDk: '#E0A825', beak: '#F28C28', shade: '#F3E3B5', shadeDk: '#D7C08A', brass: '#C9A44C' };
const LAMP = { x: 260, base: 1310 }, BACK = 1310, TUB = { x: 500, y: 1590, rx: 220, h: 230 }, FY8 = 1560;
const tubRim = () => TUB.y - TUB.h;

// The floor lamp by the window. on 0..1: lit. tug 0..1: the pull chain pulled down.
function floorLamp(t, on = 0, tug = 0) {
  const { x, base } = LAMP;
  if (on > 0) glow(x, 720, 300, '#FFE7A0', .55 * on);
  paint(ellPts(x, base - 6, 70, 16, 20), { wash: '#6B5A4E', sw: 1.1 });
  paint(rectPts(x - 7, 770, 14, base - 776), { wash: BC8.brass, sw: 1 });
  const ch = 1110 + tug * 45;
  inkLine([[x + 52, 770], [x + 52, ch]], 2, BC8.brass, 'ink', 0);
  paint(ellPts(x + 52, ch + 8, 9, 11, 10), { wash: BC8.brass, sw: .8 });
  paint([[x - 62, 640], [x + 62, 640], [x + 100, 775], [x - 100, 775]], { wash: on > 0 ? mixCol(BC8.shade, '#FFF6CF', on) : BC8.shade, sw: 1.3, shade: true, shadeK: .35 });
  inkLine([[x - 100, 775], [x + 100, 775]], 3, BC8.shadeDk, 'ink', 0);
}
// A lampshade alone (on Pumpkin's head, or flying). At (x, y) = middle of its bottom rim, size s, rotation rot.
function lampShade(x, y, s = 1, rot = 0) {
  push(); translate(x, y); rotate(rot); scale(s, s);
  paint([[-70, -150], [70, -150], [112, 0], [-112, 0]], { wash: BC8.shade, sw: 1.4, shade: true, shadeK: .35 });
  inkLine([[-112, 0], [112, 0]], 3.4, BC8.shadeDk, 'ink', 0); inkLine([[-70, -150], [70, -150]], 2.4, BC8.shadeDk, 'ink', 0);
  pop();
}
// Pumpkin's draw-hook: the shade over his head and ears (eyes still peeking out underneath). Body space, u units.
const shadeHook = (q = 0) => (u, sw) => lampShade(q * .55 * u, -9.75 * u, u / 40 * 1.55);

// Pip's shower cap (frilly, pink, polka dots), as a draw hook. view 'front' | 'q' | 'side'.
function capHook(view = 'front') {
  return (u, sw) => {
    const q = view === 'q' ? 1 : 0, side = view === 'side';
    const cx = side ? 1.75 * u : q * .25 * u, cy = side ? -4.35 * u : -5.45 * u, rx = side ? 1.3 * u : 1.62 * u, ry = side ? .75 * u : .9 * u;
    paint([...arcPts(cx, cy + ry * .55, rx, ry * 1.5, Math.PI, TAU, 18)], { wash: BC8.cap, sw: sw * .8, shade: true, shadeK: .4 });
    for (const [a, b] of [[-.5, -.4], [.1, -.75], [.55, -.3], [-.1, -.1]]) paint(ellPts(cx + a * rx, cy + ry * .55 + b * ry, .13 * u, .11 * u, 8), { wash: BC8.dot, ink: null });
    const fr = []; for (let i = 0; i <= 14; i++) { const k = i / 14, xx = cx - rx * 1.06 + k * rx * 2.12; fr.push([xx, cy + ry * .55 + (i % 2 ? .22 : .02) * u]); }
    inkLine(fr, sw * 2.4, BC8.capDk, 'ink', 0);
  };
}
// Pip's right-paw hook: the long scrub brush (handle along the arm, bristles out the end).
function brushHook(u, sw) {
  paint(rrPts(.1 * u, -.14 * u, 2.6 * u, .28 * u, .12 * u), { wash: BC8.woodDk, sw: sw * .6 });
  paint(ellPts(3.1 * u, 0, .7 * u, .42 * u, 16), { wash: BC8.wood, sw: sw * .7, shade: true, shadeK: .5 });
  for (let k = -3; k <= 3; k++) inkLine([[3.1 * u + k * .17 * u, .3 * u], [3.1 * u + k * .2 * u, .72 * u]], sw * .9, '#F2E6C8', 'ink', 0);
}
// The brush lying on the floor (or leaning): at (x, y), angle rot, size u.
function brushProp(x, y, u, rot = 0) { push(); translate(x, y); rotate(rot); brushHook(u, clamp(u / 17, .45, 2.6)); pop(); }
// Pip's left-paw hook: the rubber duck. squeeze 0..1.
function duckHook(sq = 0) {
  return (u, sw) => {
    push(); translate(.75 * u, 0); scale(1 + sq * .15, 1 - sq * .2);
    paint(ellPts(0, 0, .72 * u, .5 * u, 16), { wash: BC8.duck, sw: sw * .7, shade: true, shadeK: .5 });
    paint(ellPts(.35 * u, -.62 * u, .38 * u, .38 * u, 14), { wash: BC8.duck, sw: sw * .7 });
    paint([[.68 * u, -.66 * u], [1.05 * u, -.56 * u], [.68 * u, -.46 * u]], { wash: BC8.beak, sw: sw * .5 });
    paint(ellPts(.45 * u, -.72 * u, .07 * u, .07 * u, 6), { wash: '#2B2233', ink: null });
    inkLine([[-.3 * u, -.05 * u], [.1 * u, .12 * u]], sw * .8, BC8.duckDk, 'ink', .3);
    pop();
  };
}
// The duck floating on its own (on the foam).
function duckProp(x, y, u, t = 0) { push(); translate(x - .75 * u, y + Math.sin(t * 3) * .1 * u); rotate(Math.sin(t * 2) * .08); duckHook(0)(u, clamp(u / 17, .45, 2.6)); pop(); }

// The rug, raised into a lump over a hidden cat at x (height k 0..1), with the tail sticking out to the right.
function rugLump(t, x, k = 1, tail = true) {
  if (k <= 0) return;
  const y = 1575, w = 170, h = 200 * k, br = 1 + .02 * Math.sin(t * 3);
  const pts = through([[x - w - 30, y + 10], [x - w * .8, y - h * .55 * br], [x - w * .3, y - h * br], [x + w * .3, y - h * br], [x + w * .8, y - h * .55 * br], [x + w + 30, y + 10]], 6);
  paint([...pts, [x + w + 30, y + 26], [x - w - 30, y + 26]], { wash: RC.rug, sw: 1.4, shade: true, shadeK: .45 });
  inkLine(through([[x - w * .7, y - h * .3], [x, y - h * .62], [x + w * .7, y - h * .3]], 5), 2.2, RC.rugDk, 'ink', .2);
  if (tail && k > .6) { const w2 = Math.sin(t * 5) * 14; paint(ribbon([[x + w + 10, y + 4], [x + w + 70, y - 6], [x + w + 104 + w2, y - 50], [x + w + 92 + w2 * 1.4, y - 92]], 30, 18), { wash: PUMPKIN_COL.col, sw: 1.3 }); }
}

// The wider curtain left of the window (rod at 380, down to the floor). bulge(): draw what's behind it first (Pumpkin).
// gone: the curtain has run off, only the rod is left.
function curtain8(t, o = {}) {
  const rodY = 380, x0 = -40, x1 = 250, bot = BACK - 4;
  if (!o.gone) {
    const lift = o.lift || 0, pts = [[x0, rodY], [x1, rodY], [x1 + 6 * Math.sin(t * 2), bot - lift], [x0, bot - lift]];
    paint(pts, { wash: RC.curtain, sw: 1.3, shade: true, shadeK: .4 });
    if (o.cat) {   // the cat-shaped bulge: body, head and two ear points pushing the cloth out
      const cx = o.cat, sh = mixCol(RC.curtain, '#FFFFFF', .14);
      paint(ellPts(cx, bot - 170 - lift, 150, 165, 24), { wash: sh, ink: null });
      paint(ellPts(cx, bot - 345 - lift, 125, 105, 22), { wash: sh, ink: null });
      for (const s of [-1, 1]) paint([[cx + s * 50, bot - 430 - lift], [cx + s * 95, bot - 520 - lift], [cx + s * 115, bot - 400 - lift]], { wash: sh, ink: null });
    }
    for (let k = 1; k < 7; k++) inkLine([[x0 + k * 42, rodY + 10], [x0 + k * 42, bot - lift - 10]], 1.4, RC.curtainDk, 'ink', .3);
  }
  paint(rrPts(x0 - 30, rodY - 14, x1 - x0 + 80, 18, 8), { wash: '#8E6A55', sw: 1 });   // rod
}
// The curtain running away with a cat in it: a purple blob with orange feet, at (x, y) floor point, running left.
function curtainGhost(t, x, y) {
  const b = Math.abs(Math.sin(t * 16)) * 14;
  for (const s of [-1, 1]) paint(ellPts(x + s * 60 + Math.sin(t * 16 + s) * 20, y - 14, 46, 22, 12), { wash: PUMPKIN_COL.col, sw: 1.2 });
  const pts = through([[x - 190, y - 20], [x - 170, y - 260 - b], [x - 70, y - 470 - b], [x + 60, y - 480 - b], [x + 170, y - 300 - b], [x + 210, y - 30], [x + 120, y - 50], [x + 30, y - 20], [x - 80, y - 46]], 6);
  paint(pts, { wash: RC.curtain, sw: 1.4, shade: true, shadeK: .4 });
  for (let k = -2; k <= 2; k++) inkLine([[x + k * 50, y - 400 - b], [x + k * 60 + 30, y - 60]], 1.4, RC.curtainDk, 'ink', .3);
  for (const s of [-1, 1]) paint(ellPts(x - 70 + s * 30, y - 380 - b, 14, 20, 10), { wash: '#FFFFFF', sw: 1 });   // his eyes, peeking out
  for (const s of [-1, 1]) paint(ellPts(x - 76 + s * 30, y - 376 - b, 6, 8, 8), { wash: "#2B2233", ink: null });
}

// The wooden bath tub: back (inside + water + back foam), then whoever is in it (clip with tubClip), then front.
function tubBack(x, y, foam = 1, t = 0) {
  const rim = y - TUB.h, rx = TUB.rx;
  paint(ellPts(x, rim, rx, 52, 32), { wash: BC8.woodDk, sw: 1.4 });
  paint(ellPts(x, rim + 4, rx - 18, 40, 28), { wash: BC8.water, ink: null });
  if (foam > 0) for (let i = 0; i < 9; i++) { const a = i / 8, r = (34 + 16 * hash(i + 3)) * foam; paint(ellPts(x - rx * .8 + a * rx * 1.6, rim - 8 - 26 * foam * hash(i + 9) + Math.sin(t * 2 + i) * 3, r, r * .85, 14), { wash: BC8.foam, sw: .8 }); }
}
const tubClip = (x, y, fn) => clipRects([[x - TUB.rx - 400, -800, TUB.rx * 2 + 800, y - TUB.h + 800 + 24]], fn);
function tubFront(x, y, foam = 1, t = 0) {
  const rim = y - TUB.h, rx = TUB.rx;
  const body = [...arcPts(x, rim, rx, 52, 0, Math.PI, 20), ...arcPts(x, y - 40, rx - 22, 46, Math.PI, 0, 20)];
  paint(body, { wash: BC8.wood, sw: 1.5, shade: true, shadeK: .45 });
  for (let k = -3; k <= 3; k++) { const xx = x + k * rx * .27; inkLine([[xx, rim + 48 * Math.sqrt(1 - (k * .27) ** 2)], [xx * .97 + x * .03, y - 40 + 44 * Math.sqrt(1 - (k * .27) ** 2)]], 1.6, BC8.woodDk, 'ink', .2); }
  for (const f of [.25, .75]) inkLine(arcPts(x, lerp(rim, y - 40, f), lerp(rx, rx - 22, f) + 3, lerp(52, 46, f) + 2, .05, Math.PI - .05, 18), 7, BC8.band, 'ink', 0);
  if (foam > 0) for (let i = 0; i < 8; i++) { const a = i / 7, r = (30 + 14 * hash(i + 21)) * foam; paint(ellPts(x - rx * .9 + a * rx * 1.8, rim + 34 - 10 * Math.sin(a * Math.PI) + Math.sin(t * 2.4 + i) * 3, r, r * .8, 14), { wash: BC8.foam, sw: .8 }); }
}
// The tub on the move (dragged in): same drawing, empty.
function tub(x, y, foam = 0, t = 0) { tubBack(x, y, foam, t); tubFront(x, y, foam, t); }

// One soap bubble.
function bubble(x, y, r, a = 1) {
  paint(ellPts(x, y, r, r, 18), { wash: '#E8F6FF', washOp: 90 * a, ink: '#9CC8E8', sw: 1.1 * a });
  inkLine(arcPts(x, y, r * .7, r * .7, -2.6, -1.7, 6), Math.max(1, r * .14), '#FFFFFF', 'ink', 0);
}
// A splash: drops flying out of (x, y), age 0..1.
function splash8(x, y, r, age, n = 14, seed = 3) {
  if (age < 0 || age > 1) return;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI * (.08 + .84 * i / (n - 1)) + (hash(i + seed) - .5) * .3, v = r * (.6 + .6 * hash(i + seed * 7));
    const px = x + Math.cos(a) * v * age, py = y + Math.sin(a) * v * age + 900 * age * age, s = (16 + 10 * hash(i)) * (1 - age * .6);
    paint(ellPts(px, py, s * .8, s, 10), { wash: i % 3 ? BC8.water : BC8.foam, sw: .8 });
  }
}
