// props.js: the kitchen of "The Last Cookie" (flat style, 1080 x 1920 world), seen face-on.
// Counter on the LEFT (the tower pieces wait on it; Pip sits there), fridge on the RIGHT with the cookie jar on top.
// The tower is built against the fridge's left side at TOWER.x.
const K5 = { floor: 1560, counter: { x: -40, y: 1080, w: 420 }, fridge: { x: 610, y: 820, w: 430 },
             jar: { x: 775, bottom: 820, w: 240, h: 260 } };
const KC5 = { wall: '#F6E3C6', tile: '#EAD2AE', floor: '#B88A5E', floorDk: '#9C7049', counter: '#7FB3A8', counterTop: '#F4EEE4',
              fridge: '#EEF2F5', fridgeDk: '#C9D3DB', handle: '#9AA9B6', glass: '#D9F0F7', lid: '#E77F6A', cookie: '#D9A066', chip: '#6B3E26',
              box: '#D9A86A', boxDk: '#B8864C', pot: '#5E7FA8', potDk: '#47648A', book: '#C8363F', bookDk: '#8A222B', tin: '#DCE8EE' };
// The tower pieces: their size and where they sit, on the counter (start) and in the tower (stacked against the fridge).
const PIECES = [
  { id: 'box',  w: 230, h: 220, counter: [110, 1560], tower: [505, 1560], col: '#D9A86A', dk: '#B8864C' },
  { id: 'pot',  w: 200, h: 150, counter: [250, 1560], tower: [505, 1340], col: '#5E7FA8', dk: '#47648A' },
  { id: 'book', w: 220, h: 80,  counter: [130, 880],  tower: [505, 1190], col: '#C8363F', dk: '#8A222B' },
  { id: 'tin',  w: 210, h: 34,  counter: [250, 880],  tower: [505, 1110], col: '#DCE8EE', dk: '#9AA9B6' },
];
const TOWER_TOP = 1076;   // the pie tin's top: where Pumpkin stands

function kitchen5(t, o = {}) {
  boilSeed('k5');
  paint(rectPts(-600, -600, W + 1200, K5.floor + 600), { wash: KC5.wall, ink: null });
  for (let y = 400; y < K5.counter.y; y += 90) for (let x = -540; x < W + 540; x += 90) paint(rrPts(x + 6, y + 6, 78, 78, 8), { wash: KC5.tile, ink: null });
  paint(rectPts(-600, K5.floor, W + 1200, 1400), { wash: KC5.floor, ink: null });
  for (let i = 0; i < 6; i++) inkLine([[-600, K5.floor + 60 + i * 80 + i * i * 6], [W + 600, K5.floor + 60 + i * 80 + i * i * 6]], 1.5, KC5.floorDk, 'ink', 0);
  // counter (left) with a shelf above it
  const c = K5.counter;
  paint(rectPts(c.x, c.y, c.w, K5.floor - c.y), { wash: KC5.counter, sw: 1.4, shade: true, shadeK: .4 });
  paint(rectPts(c.x - 10, c.y - 24, c.w + 20, 30), { wash: KC5.counterTop, sw: 1.2 });
  for (const dx of [30, 220]) { paint(rrPts(c.x + dx, c.y + 70, 160, 300, 10), { wash: mixCol(KC5.counter, '#FFFFFF', .12), sw: 1 }); paint(ellPts(c.x + dx + 140, c.y + 220, 8, 8, 10), { wash: '#EEC35A', ink: null }); }
  paint(rectPts(c.x + 40, 880, c.w - 60, 22), { wash: KC5.counterTop, sw: 1.1 });   // shelf (book + tin start here)
  fridge5(t);
}
function fridge5(t) {
  const f = K5.fridge;
  paint(rrPts(f.x, f.y, f.w, K5.floor - f.y, 26), { wash: KC5.fridge, sw: 1.6, shade: true, shadeK: .45 });
  inkLine([[f.x + 10, f.y + 250], [f.x + f.w - 10, f.y + 250]], 1.6, KC5.fridgeDk, 'ink', 0);
  for (const [y0, y1] of [[f.y + 70, f.y + 200], [f.y + 300, f.y + 560]]) paint(rrPts(f.x + 40, y0, 22, y1 - y0, 10), { wash: KC5.handle, ink: null });
  // a few fridge magnets
  paint(ellPts(f.x + 300, f.y + 380, 22, 22, 14), { wash: '#F2B33E', sw: .8 }); paint(rrPts(f.x + 230, f.y + 470, 70, 50, 8), { wash: '#8EE39B', sw: .8 });
}
// A piece at (cx, bottom) rotated by rot (pivot at its centre).
function piece(p, cx, bottom, rot = 0) {
  push(); translate(cx, bottom - p.h / 2); rotate(rot);
  if (p.id === 'pot') {
    paint(rrPts(-p.w / 2, -p.h / 2 + 10, p.w, p.h - 10, 26), { wash: p.col, sw: 1.4, shade: true, shadeK: .5 });
    paint(rrPts(-p.w / 2 - 12, -p.h / 2 + 4, p.w + 24, 22, 10), { wash: p.dk, sw: 1.2 });
    for (const s of [-1, 1]) paint(rrPts(s * (p.w / 2 + 4) - 18, -p.h / 2 + 34, 36, 18, 8), { wash: p.dk, sw: 1 });
  } else if (p.id === 'book') {
    paint(rrPts(-p.w / 2, -p.h / 2, p.w, p.h, 8), { wash: p.col, sw: 1.4 });
    paint(rectPts(-p.w / 2 + 10, -p.h / 2 + 12, p.w - 30, p.h - 24), { wash: '#FFF8EC', ink: null });
    paint(rectPts(-p.w / 2, -p.h / 2, 26, p.h), { wash: p.dk, ink: null });
  } else if (p.id === 'tin') {
    paint([[-p.w / 2, p.h / 2], [-p.w / 2 + 22, -p.h / 2], [p.w / 2 - 22, -p.h / 2], [p.w / 2, p.h / 2]], { wash: p.col, sw: 1.3 });
    inkLine([[-p.w / 2 + 30, -p.h / 2 + 10], [p.w / 2 - 30, -p.h / 2 + 10]], 1.2, '#FFFFFF', 'ink', 0);
  } else {
    paint(rectPts(-p.w / 2, -p.h / 2, p.w, p.h), { wash: p.col, sw: 1.4, shade: true, shadeK: .4 });
    inkLine([[-p.w / 2, -p.h / 2 + 40], [p.w / 2, -p.h / 2 + 40]], 1.4, p.dk, 'ink', 0);
    inkLine([[-30, -p.h / 2], [-30, -p.h / 2 + 40]], 1.4, p.dk, 'ink', 0); inkLine([[30, -p.h / 2], [30, -p.h / 2 + 40]], 1.4, p.dk, 'ink', 0);
  }
  pop();
}

// The cookie jar on the fridge. inside(): draws what's in it (clipped to the glass). lid: 0 shut .. 1 lifted off.
function cookieJar(t, inside, lid = 0, lidAt = null) {
  const j = K5.jar, x0 = j.x - j.w / 2, top = j.bottom - j.h;
  paint(rrPts(x0, top, j.w, j.h, 40), { wash: KC5.glass, washOp: 170, ink: null });   // back glass
  push(); CTX.beginPath(); CTX.rect(x0 + 6, top + 6, j.w - 12, j.h - 10); CTX.clip(); if (inside) inside(); pop();
  paint(rrPts(x0, top, j.w, j.h, 40), { ink: '#7FA6B8', sw: 1.6 });
  inkLine([[x0 + 28, top + 50], [x0 + 28, top + 170]], 4, '#FFFFFF', 'ink', 0);
  inkLine([[x0 + 46, top + 60], [x0 + 46, top + 110]], 2.5, '#FFFFFF', 'ink', 0);
  // the lid: shut on the rim, or held at lidAt
  const L = lidAt || [j.x, top - 8];
  if (lid < 1 || lidAt) { push(); translate(L[0], L[1]); paint(rrPts(-j.w / 2 - 8, -22, j.w + 16, 34, 12), { wash: KC5.lid, sw: 1.4 }); paint(ellPts(0, -34, 30, 18, 16), { wash: KC5.lid, sw: 1.2 }); pop(); }
}
function cookie(x, y, r, bite = 0) {
  paint(ellPts(x, y, r, r * .9, 26), { wash: KC5.cookie, sw: 1.2, shade: true, shadeK: .5 });
  for (let i = 0; i < 6; i++) { const a = i * 1.1 + .3, d = r * (.25 + .45 * hash(i + 2)); paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .9, r * .12, r * .1, 8), { wash: KC5.chip, ink: null }); }
  if (bite > 0) for (let k = 0; k < 3; k++) paint(ellPts(x + r * .75, y - r * .5 + k * r * .35, r * .28 * bite, r * .28 * bite, 14), { wash: KC5.glass, ink: null });
}
function sparkle(x, y, s, t, ph = 0) { const k = Math.max(0, Math.sin(t * 3 + ph)); if (k > .2) paint(starPts(x, y, s * k, .22, 4), { wash: '#FFFFFF', ink: null }); }

// from story 03's props (effects)
function burst(x, y, r, age, n = 10, col = '#FFF4D6', seed = 1) {
  if (age < 0 || age > 1) return;
  const k = easeOut(age), a = 1 - age;
  for (let i = 0; i < n; i++) {
    const ang = i / n * TAU + hash(i + seed) * .4, r0 = r * (.45 + .35 * k), r1 = r * (.7 + .7 * k);
    inkLine([[x + Math.cos(ang) * r0, y + Math.sin(ang) * r0], [x + Math.cos(ang) * r1, y + Math.sin(ang) * r1]], 4 * a + .5, col, 'ink', 0);
  }
}
function puffCloud(x, y, r, age) {
  if (age < 0 || age > .7) return;
  const k = easeOut(age / .7), a = 1 - age / .7;
  for (let i = 0; i < 7; i++) { const ang = i / 7 * TAU; paint(ellPts(x + Math.cos(ang) * r * k, y + Math.sin(ang) * r * k * .7, r * .45 * a + 2, r * .4 * a + 2, 16), { wash: '#FFFFFF', washOp: 230 * a, ink: null }); }
}
function clipRects(rects, fn) { push(); CTX.beginPath(); for (const [x, y, w, h] of rects) CTX.rect(x, y, w, h); CTX.clip(); fn(); pop(); }
