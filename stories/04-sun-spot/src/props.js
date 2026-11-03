// props.js: the living room of "The Sun Spot" (flat style, 1080 x 1920 world), seen face-on.
// Window on the LEFT (Pip stands on its sill), armchair on the RIGHT, floor below y = ROOM.floor.
// The sun spot is the silent star: SUN(t) says where it is (floor, chair seat or wall), how bright, and whether it
// comes from the window or from Pip's mirror.
// The lid propped on the sill: at the start (and again at the end) the spot is its reflection.
const LID = [348, 954];
const ROOM = { floor: 1300, win: { x: 40, y: 420, w: 360, h: 560 }, sill: { x: 18, y: 980, w: 410, h: 42 },
               chair: { x: 640, y: 830, w: 420, seat: 1150 }, spot0: 380, floorY: 1480 };
const RC = { wall: '#CFE3D8', wall2: '#C2D9CD', base: '#A9C7B8', floor: '#C99A6B', floorDk: '#AD7F55', frame: '#FFF8EC',
             sky: '#AFE0F5', sun: '#FFE07A', roof: '#B5655A', roofDk: '#8E4A42', chair: '#E77F6A', chairDk: '#C2604E',
             rug: '#7FB3C8', rugDk: '#5E95AC', light: '#FFD54F', lightCore: '#FFF3B0', lid: '#D9E2EA', lidDk: '#9AA9B6' };

// ---------- where the sun spot is ----------
// Steps of the spot along the floor in shots 01-02 (it moves in little jumps as the afternoon passes).
const SUN_STEPS = [[3.0, 3.6, 470], [5.5, 6.2, 560], [7.5, 8.1, 650], [10.0, 10.4, 760]];
function SUN(t) {
  const L = (a, b) => ease(seg(t, a, b));
  if (t < 12) {   // the floor, stepping right
    let x = ROOM.spot0; for (const [a, b, to] of SUN_STEPS) x = lerp(x, to, L(a, b));
    return { on: 'floor', x, y: ROOM.floorY, a: 1, src: 'lid' };
  }
  if (t < 18) {   // time-lapse: across the rug and up onto the chair seat
    const k = L(12.3, 15.0);
    return { on: k < .98 ? 'floor' : 'seat', x: lerp(760, 850, k), y: lerp(ROOM.floorY, ROOM.chair.seat + 10, k), a: 1, src: 'window', warm: seg(t, 12, 18) };
  }
  if (t < 25.4) {   // up the wall above the chair, in steps
    let y = ROOM.chair.seat - 70; for (const [a, b, to] of [[18.6, 19.4, 980], [20.2, 21.2, 860], [22.0, 23.0, 760], [23.8, 24.8, 660]]) y = lerp(y, to, L(a, b));
    return { on: 'wall', x: 850, y, a: 1, src: 'window', warm: 1 };
  }
  if (t < 32.0) return { on: 'wall', x: 850, y: 660, a: 1 - L(25.4, 26.0), src: 'window', warm: 1 };
  // Pip's reflection: lands mid-floor, wobbles as his arm tires, then drifts back to where the film began (loop)
  const tire = seg(t, 43.6, 46), wob = Math.sin(t * 9) * 8 * tire + Math.sin(t * 23) * 3 * tire;
  const x = lerp(480, ROOM.spot0, L(46.2, 49.2)) + wob;
  return { on: 'floor', x, y: ROOM.floorY + wob * .3, a: L(32.0, 32.35), src: t > 47.2 ? 'lid' : 'mirror', warm: 0 };
}

// ---------- the room ----------
function livingRoom(t, o = {}) {
  boilSeed('room');
  paint(rectPts(-600, -600, W + 1200, ROOM.floor + 600), { wash: RC.wall, ink: null });
  for (let i = -6; i < 16; i++) paint(rectPts(i * 90 + 20, -600, 30, ROOM.floor + 600), { wash: RC.wall2, ink: null });
  paint(rectPts(-600, ROOM.floor - 36, W + 1200, 40), { wash: RC.base, ink: null });
  paint(rectPts(-600, ROOM.floor, W + 1200, 1400), { wash: RC.floor, ink: null });
  for (let i = 0; i < 9; i++) inkLine([[-600, ROOM.floor + 50 + i * 64 + i * i * 5], [W + 600, ROOM.floor + 50 + i * 64 + i * i * 5]], 1.5, RC.floorDk, 'ink', 0);
  paint(ellPts(560, 1560, 360, 110, 40), { wash: RC.rug, sw: 1.2 });
  paint(ellPts(560, 1560, 300, 84, 40), { wash: RC.rugDk, ink: null });
  paint(ellPts(560, 1560, 250, 66, 40), { wash: RC.rug, ink: null });
  windowView(t);
  armchair(t);
  // a little picture frame and a plant, so the wall reads as a home
  paint(rrPts(520, 520, 130, 160, 10), { wash: '#F6EBDA', sw: 1.2 }); paint(rrPts(538, 540, 94, 120, 6), { wash: '#9CC8E8', ink: null });
  paint(ellPts(585, 640, 40, 18, 16), { wash: '#7FBF7A', ink: null });
}
function windowView(t) {
  const w = ROOM.win, s = ROOM.sill;
  paint(rectPts(w.x - 18, w.y - 18, w.w + 36, w.h + 36), { wash: RC.frame, sw: 1.4 });
  paint(rectPts(w.x, w.y, w.w, w.h), { wash: RC.sky, ink: null });
  // the sun sinks behind the neighbour's roof between 18 s and 25.4 s
  const sy = lerp(w.y + 120, w.y + 470, ease(seg(t, 12, 25.4))), dusk = seg(t, 12, 25.4);
  if (dusk > 0) paint(rectPts(w.x, w.y, w.w, w.h), { wash: '#FFC98A', washOp: 120 * dusk, ink: null });
  paint(ellPts(w.x + 250, sy, 58, 58, 28), { wash: RC.sun, ink: null });
  paint([[w.x, w.y + w.h], [w.x, w.y + 380], [w.x + 170, w.y + 300], [w.x + w.w, w.y + 380], [w.x + w.w, w.y + w.h]], { wash: RC.roof, ink: null });
  for (let i = 0; i < 6; i++) inkLine([[w.x, w.y + 410 + i * 26], [w.x + w.w, w.y + 410 + i * 26]], 1.4, RC.roofDk, 'ink', 0);
  inkLine([[w.x + w.w / 2, w.y], [w.x + w.w / 2, w.y + w.h]], 3, RC.frame, 'ink', 0);
  inkLine([[w.x, w.y + w.h / 2 - 60], [w.x + w.w, w.y + w.h / 2 - 60]], 3, RC.frame, 'ink', 0);
  paint(rectPts(s.x, s.y, s.w, s.h), { wash: RC.frame, sw: 1.3, shade: true, shadeK: .4 });
  // after the sun hides, its last light still lies along the sill (Pip catches it there)
  if (t > 25.4) paint(rectPts(s.x + 20, s.y + 2, s.w - 40, 10), { wash: RC.light, washOp: 220, ink: null });
  // the shiny cracker-tin lid, set up on the sill from the start
  if (t < 30.6 || t > 47.2) crackerLid(LID[0], LID[1], 26, -.2, t);
}
function crackerLid(x, y, r, rot, t) {
  push(); translate(x, y); rotate(rot);
  paint(ellPts(0, 0, r, r * .96, 28), { wash: RC.lid, sw: 1.2, shade: true, shadeK: .5 });
  paint(ellPts(0, 0, r * .72, r * .7, 24), { wash: '#EEF3F7', ink: null });
  inkLine([[-r * .45, -r * .2], [-r * .1, -r * .5]], 2.2, '#FFFFFF', 'ink', 0);
  const tw = Math.max(0, Math.sin(t * 2.3) - .7) * 3;   // a glint now and then
  if (tw > 0) paint(starPts(r * .4, -r * .45, r * .6 * tw, .25, 4), { wash: '#FFFFFF', ink: null });
  pop();
}
function armchair(t) {
  const c = ROOM.chair;
  paint(rrPts(c.x + 40, c.y, c.w - 80, 360, 60), { wash: RC.chair, sw: 1.5, shade: true, shadeK: .5 });          // back
  paint(rrPts(c.x + 20, c.seat - 40, c.w - 40, 200, 40), { wash: mixCol(RC.chair, '#FFFFFF', .12), sw: 1.4 }); // seat cushion
  for (const s of [0, 1]) paint(rrPts(s ? c.x + c.w - 90 : c.x - 10, c.seat - 110, 100, 260, 40), { wash: RC.chairDk, sw: 1.4, shade: true, shadeK: .4 });   // arms
  for (const s of [0, 1]) paint(rectPts(s ? c.x + c.w - 60 : c.x + 30, c.seat + 150, 26, ROOM.floor + 20 - c.seat - 150), { wash: '#7A5236', ink: null });   // legs
}

// ---------- light ----------
// The beam (from the window, or from Pip's mirror at mx, my) and the spot itself. Draw before the characters.
function sunLight(t, mirror) {
  const S = SUN(t); if (S.a <= .01) return;
  const col = S.warm ? mixCol(RC.light, '#FFB870', S.warm * .6) : RC.light;
  const spot = S.on === 'wall' ? rrPts(S.x - 130, S.y - 150, 260, 300, 40) : ellPts(S.x, S.y, 190, 60, 32);
  // beam: from the window glass (or the mirror) to the spot
  const M = S.src === 'lid' ? LID : S.src === 'mirror' ? mirror : null;
  const src = M ? [[M[0] - 24, M[1]], [M[0] + 24, M[1]]] : [[ROOM.win.x + 120, ROOM.win.y + 160], [ROOM.win.x + ROOM.win.w - 20, ROOM.win.y + 300]];
  const ends = S.on === 'wall' ? [[S.x - 130, S.y + 150], [S.x + 130, S.y - 150]] : [[S.x - 190, S.y], [S.x + 190, S.y]];
  paint([src[0], src[1], ends[1], ends[0]], { wash: RC.lightCore, washOp: 95 * S.a, ink: null });
  glow(S.x, S.y - (S.on === 'wall' ? 0 : 40), S.on === 'wall' ? 260 : 300, '#FFC94D', .55 * S.a);
  paint(spot, { wash: col, washOp: 215 * S.a, ink: null });
  paint(S.on === 'wall' ? rrPts(S.x - 90, S.y - 110, 180, 220, 30) : ellPts(S.x, S.y, 130, 38, 28), { wash: RC.lightCore, washOp: 150 * S.a, ink: null });
  // dust floating in the beam
  for (let i = 0; i < 12; i++) {
    const k = frac(hash(i) + t * .03 * (1 + hash(i + 7))), p0 = src[i % 2], p1 = ends[i % 2];
    const x = lerp(p0[0], p1[0], k) + Math.sin(t * .7 + i) * 18, y = lerp(p0[1], p1[1], k) + Math.cos(t * .5 + i) * 14;
    paint(ellPts(x, y, 3.2, 3.2, 8), { wash: '#FFFFFF', washOp: 180 * S.a, ink: null });
  }
}
function coolOverlay(k) { if (k > .01) { push(); CTX.setTransform(1, 0, 0, 1, 0, 0); paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#5A6FA8', washOp: 55 * k, ink: null }); pop(); } }
function warmOverlay(k) { if (k > .01) { push(); CTX.setTransform(1, 0, 0, 1, 0, 0); paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#FFB060', washOp: 40 * k, ink: null }); pop(); } }
// "zzz" drawn as three little Z shapes (no lettering needed)
function zzz(x, y, s, t) {
  for (let i = 0; i < 3; i++) {
    const k = frac(t * .45 + i / 3), zx = x + k * 60 * s + Math.sin(k * 6 + i) * 8, zy = y - k * 170 * s, r = (12 + 10 * k) * s;
    inkLine([[zx - r, zy - r], [zx + r, zy - r], [zx - r, zy + r], [zx + r, zy + r]], 2.4 * s, '#5A6FA8', 'ink', 0);
  }
}
function shiver(x, y, s, t) { for (const d of [-1, 1]) for (let k = 0; k < 3; k++) inkLine([[x + d * (180 + k * 22) * s, y - 60 + k * 50], [x + d * (196 + k * 22) * s, y - 40 + k * 50 + Math.sin(t * 40 + k) * 6]], 2.5 * s, '#5A6FA8', 'ink', 0); }

// from story 03's props
function burst(x, y, r, age, n = 10, col = '#FFF4D6', seed = 1) {
  if (age < 0 || age > 1) return;
  const k = easeOut(age), a = 1 - age;
  for (let i = 0; i < n; i++) {
    const ang = i / n * TAU + hash(i + seed) * .4, r0 = r * (.45 + .35 * k), r1 = r * (.7 + .7 * k);
    inkLine([[x + Math.cos(ang) * r0, y + Math.sin(ang) * r0], [x + Math.cos(ang) * r1, y + Math.sin(ang) * r1]], 4 * a + .5, col, 'ink', 0);
  }
}
