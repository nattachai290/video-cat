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
