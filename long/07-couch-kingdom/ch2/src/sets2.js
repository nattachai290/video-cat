// sets2.js: the places of chapter 2 "The Sock Bridge" (1920 x 1080 world, ground line TFY like chapter 1).
//   outsideRoad(t, scroll)    the dusty road outside Lostland under the sofa: dust dunes, giant lost things in the dark,
//                             the sofa's springs above. scroll (px) moves it left as the party walks right.
//   roadSign(x, y, label, pointLeft)  a toothpick signpost with a card arrow (it says RIGHT whichever way it points)
//   windupCar(x, y, s, t, o)  Sir Lint's wind-up toy car; o.key = key turn angle, o.back = drives backwards
//   canyon(t, o)              the crack between two floorboards: cliff left (x < BR.x0) and right (x > BR.x1), dark depth,
//                             far below the amber soda swamp. Over it the crumb bridge: cracker planks, pretzel railings.
//                             o.eaten 0..1 (the railing Pumpkin nibbles), o.fall: [[plankIndex, t0], ...] planks dropping
//   sodaSwamp(t, o)           the bottom of the canyon: a lake of spilled soda, bubbles, a bottle-cap boat
const BR = { x0: 560, x1: 1560, deck: TFY, planks: 10 };   // the bridge spans x0..x1 at the ground line
const SODA = '#C9873A', SODA_LT = '#E5A955', SODA_DK = '#8E5A22';

function underSky(t) {
  paint(rectPts(-900, -600, 3800, 1700), { wash: '#272138', ink: null });
  for (let i = -6; i < 22; i++) paint(rectPts(i * 170, -600, 90, 420), { wash: CK.town, washOp: 150, ink: null });
  for (let i = 0; i < 7; i++) { const x = -400 + i * 470; const sw = Math.sin(t * 1.3 + i) * 4; for (let k = 0; k < 7; k++) paint(ellPts(x + sw * k * .2, -70 + k * 24, 34, 9, 14), { ink: '#1E1A2B', sw: 3 }); }
}
function outsideRoad(t, scroll = 0) {
  boilSeed('road');
  underSky(t);
  // far: giant lost things, parallax .3
  push(); translate(-scroll * .3, 0);
  const sil = '#2F2947';
  for (let r = 0; r < 4; r++) { const x0 = r * 2400; paint(ellPts(x0 + 300, TFY - 160, 260, 260, 26), { wash: sil, ink: null }); paint([[x0 + 900, TFY], [x0 + 1300, TFY - 620], [x0 + 1360, TFY - 600], [x0 + 980, TFY]], { wash: sil, ink: null }); paint(rrPts(x0 + 1700, TFY - 420, 380, 420, 40), { wash: sil, ink: null }); for (const [dx, dy] of [[1800, -330], [1960, -200], [1880, -100]]) paint(ellPts(x0 + dx, TFY + dy, 22, 22, 10), { wash: '#3A3354', ink: null }); }
  pop();
  // mid: dust dunes, parallax .6
  push(); translate(-scroll * .6, 0);
  for (let i = 0; i < 14; i++) paint(ellPts(i * 520 - 300, TFY + 30, 380, 150, 26), { wash: i % 2 ? '#3A3354' : '#342E4E', ink: null });
  pop();
  // the road: floorboards
  push(); translate(-scroll, 0);
  paint(rectPts(-900 + scroll, TFY, 3800, 700), { wash: CK.floor, ink: null });
  for (let i = 0; i < 4; i++) inkLine([[-900 + scroll, TFY + 40 + i * 60 + i * i * 10], [2900 + scroll, TFY + 40 + i * 60 + i * i * 10]], 2, CK.floorDk, 'ink', 0);
  const n0 = Math.floor(scroll / 330) - 3; for (let i = n0; i < n0 + 12; i++) { const x = i * 330 + (((i % 3) + 3) % 3) * 60; inkLine([[x, TFY + 40 + (((i % 4) + 4) % 4) * 60], [x, TFY + 100 + (((i % 4) + 4) % 4) * 70]], 2, CK.floorDk, 'ink', 0); }
  // crumbs and a lost coin on the road
  for (let i = n0; i < n0 + 12; i++) { const x = i * 330 + 140; paint(ellPts(x, TFY + 70, 9, 6, 8), { wash: '#E6B65F', ink: null }); if (((i % 5) + 5) % 5 === 2) coin(x + 80, TFY + 30, 0, .7, true); }
  pop();
}
function roadSign(x, y, label = 'RIGHT', pointLeft = false, k = 1) {
  paint(rectPts(x - 7, y - 380, 14, 380), { wash: '#E3C38E', ink: PAL.ink, sw: 1.2 });
  const d = pointLeft ? -1 : 1, w = 270;
  paint([[x - d * 40, y - 380], [x + d * (w - 40), y - 380], [x + d * w, y - 330], [x + d * (w - 40), y - 280], [x - d * 40, y - 280]], { wash: '#F6EBDA', ink: PAL.ink, sw: 1.6 });
  letter(`${label} →`, x + d * (w / 2 - 20), y - 330, 46, '#C8363F', { font: '800 46px "Baloo 2", sans-serif', ink: false });
}
// Sir Lint's wind-up toy car (a red tin car with a big key on the back), (x, y) = ground under its middle, facing right.
function windupCar(x, y, s, t, o = {}) {
  push(); translate(x, y); scale(s * (o.flip ? -1 : 1), s);
  const bob = o.moving ? Math.abs(Math.sin(t * 18)) * 4 : 0;
  translate(0, -bob);
  paint(rrPts(-120, -110, 240, 80, 30), { wash: '#D2434B', ink: PAL.ink, sw: 1.8, shade: true, shadeK: .45 });   // body
  paint([[-60, -110], [-40, -160], [50, -160], [80, -110]], { wash: '#E2646B', ink: PAL.ink, sw: 1.6 });              // cabin
  paint([[-36, -112], [-24, -148], [20, -148], [20, -112]], { wash: '#BFE4F2', ink: PAL.ink, sw: 1.2 });
  paint(ellPts(110, -75, 14, 12, 10), { wash: '#FFE27A', ink: PAL.ink, sw: 1 });                                   // headlight
  for (const wx of [-70, 70]) { paint(ellPts(wx, -30, 32, 32, 16), { wash: '#2B2233', ink: PAL.ink, sw: 1.4 }); paint(ellPts(wx, -30, 12, 12, 10), { wash: '#C9CED6', ink: null }); const a = (o.wheel ?? t * 8); inkLine([[wx, -30], [wx + Math.cos(a) * 26, -30 + Math.sin(a) * 26]], 3, '#C9CED6', 'ink', 0); }
  // the wind-up key on the back
  push(); translate(-130, -80); rotate(o.key || 0);
  paint(rectPts(-30, -6, 30, 12), { wash: '#C9CED6', ink: PAL.ink, sw: 1.2 });
  for (const sy of [-1, 1]) paint(ellPts(-44, sy * 20, 16, 22, 12), { wash: '#C9CED6', ink: PAL.ink, sw: 1.2 });
  pop();
  if (o.moving) for (let i = 0; i < 3; i++) { const k = frac(t * 3 + i / 3); paint(ellPts(-150 - k * 120 * (o.back ? -1 : 1) * -1, -10 - k * 30, 14 * (1 - k) + 4, 10 * (1 - k) + 3, 8), { wash: '#EFE3CF', washOp: 180 * (1 - k), ink: null }); }
  pop();
}
// ---------- the canyon and the crumb bridge ----------
function canyon(t, o = {}) {
  boilSeed('canyon');
  underSky(t);
  // the depth: dark walls going down, the soda glow far below
  paint(rectPts(BR.x0, TFY, BR.x1 - BR.x0, 2000), { wash: '#15121F', ink: null });
  glow((BR.x0 + BR.x1) / 2, TFY + 900, 600, SODA, .35);
  for (let i = 0; i < 8; i++) { const y = TFY + 80 + i * 110; paint(rectPts(BR.x0, y, 40 + (i % 3) * 20, 70), { wash: '#2A2440', ink: null }); paint(rectPts(BR.x1 - 50 - (i % 2) * 20, y + 40, 50 + (i % 2) * 20, 60), { wash: '#2A2440', ink: null }); }
  // the cliffs: thick floorboards, cut ends facing the gap
  for (const [x0, x1] of [[-900, BR.x0], [BR.x1, 2900]]) {
    paint(rectPts(x0, TFY, x1 - x0, 2000), { wash: CK.floor, ink: null });
    for (let i = 0; i < 4; i++) inkLine([[x0, TFY + 40 + i * 60 + i * i * 10], [x1, TFY + 40 + i * 60 + i * i * 10]], 2, CK.floorDk, 'ink', 0);
    const ex = x0 < BR.x0 ? x1 : x0; for (let k = 0; k < 6; k++) inkLine(arcPts(ex, TFY + 300, 12 + k * 14, 40 + k * 30, -Math.PI / 2, Math.PI / 2, 8).map(([a, b]) => [ex + (ex === x1 ? -1 : 1) * (a - ex) * .4, b]), 1.5, CK.floorDk, 'ink', .2);   // end grain
  }
  crumbBridge(t, o);
}
// planks: cracker squares laid across ropes of licorice; railings: pretzel sticks on posts
function crumbBridge(t, o = {}) {
  const n = BR.planks, pw = (BR.x1 - BR.x0) / n, eaten = o.eaten || 0, fall = o.fall || [];
  const sag = x => 30 * Math.sin(((x - BR.x0) / (BR.x1 - BR.x0)) * Math.PI);
  const gone = i => { const f = fall.find(([j]) => j === i); return f ? seg(t, f[1], f[1] + 1.2) : 0; };
  // ropes
  for (const dy of [0, -150]) { const P = []; for (let i = 0; i <= 20; i++) { const x = lerp(BR.x0 - 20, BR.x1 + 20, i / 20); P.push([x, BR.deck + dy + sag(x) * (dy ? .6 : 1)]); } inkLine(P, 6, '#5A2A2E', 'ink', .2); }
  // planks
  for (let i = 0; i < n; i++) {
    const g = gone(i); if (g >= 1) continue;
    const x = BR.x0 + i * pw, y = BR.deck + sag(x + pw / 2) + g * g * 900, r = g * (i % 2 ? 3 : -3);
    push(); translate(x + pw / 2, y); rotate(r + (o.shake ? Math.sin(t * 40 + i) * .03 * o.shake : 0));
    paint(rrPts(-pw / 2 + 3, -10, pw - 6, 34, 6), { wash: '#E6B65F', ink: PAL.ink, sw: 1.4 });
    for (const dx of [-pw * .25, pw * .2]) paint(ellPts(dx, 6, 4, 4, 6), { wash: '#B8813A', ink: null });
    if (o.cracks && i % 3 === 1 && t > o.cracks) inkLine([[-pw * .3, -8], [-pw * .05, 6], [-pw * .15, 22]], 2, PAL.ink, 'ink', .4);
    pop();
  }
  // posts + pretzel railings (the left part of the near railing gets eaten: eaten 0..1 = from x1 back towards x0)
  for (let i = 0; i <= n; i += 2) { if (gone(Math.min(i, n - 1)) > 0) continue; const x = BR.x0 + i * pw, y = BR.deck + sag(x); paint(rectPts(x - 8, y - 160, 16, 170), { wash: '#B8813A', ink: PAL.ink, sw: 1.2 }); }
  const cut = BR.x1 - eaten * (BR.x1 - BR.x0);
  for (let i = 0; i < n; i++) {
    const x = BR.x0 + i * pw; if (gone(i) > 0 || x + pw > cut + pw && x > cut) continue;
    const y = BR.deck + sag(x + pw / 2) - 130;
    paint(rrPts(x, y - 10, Math.min(pw, cut - x), 20, 10), { wash: '#C98A3E', ink: PAL.ink, sw: 1.2 });
    for (let k = 0; k < 3; k++) paint(ellPts(x + pw * (.2 + k * .3), y - 4, 3, 2, 6), { wash: '#FFFFFF', ink: null });   // salt
  }
}
// ---------- the soda swamp (the canyon floor) ----------
function sodaSwamp(t, o = {}) {
  boilSeed('soda');
  paint(rectPts(-900, -600, 3800, 1700), { wash: '#15121F', ink: null });
  // canyon walls left and right, rising out of frame
  for (const [x0, w] of [[-900, 900], [1560, 1400]]) { paint(rectPts(x0, -600, w, 1800), { wash: '#2A2440', ink: null }); for (let i = 0; i < 9; i++) inkLine([[x0, -500 + i * 150], [x0 + w, -470 + i * 150]], 2, '#211C33', 'ink', 0); }
  glow(960, -400, 500, '#FFE7A8', .25);   // the crack of light far above
  // the soda lake
  paint(rectPts(-900, TFY - 40, 3800, 800), { wash: SODA, ink: null });
  paint(rectPts(-900, TFY - 40, 3800, 30), { wash: SODA_LT, ink: null });
  for (let i = 0; i < 26; i++) { const x = (hash(i) * 2400) - 200, k = frac(t * (.4 + hash(i + 3) * .5) + hash(i + 7)), y = TFY + 300 - k * 330; paint(ellPts(x, y, 8 + hash(i + 1) * 10, 8 + hash(i + 1) * 10, 10), { wash: '#F6D9A8', washOp: 200 * (1 - k * .5), ink: null }); }
  // fizz on the surface
  for (let i = 0; i < 30; i++) { const x = -200 + i * 80 + Math.sin(t * 3 + i) * 10; paint(ellPts(x, TFY - 38, 10, 6, 8), { wash: '#FFF2D6', washOp: 200, ink: null }); }
  if (o.boat !== false) { push(); translate(1300, TFY - 30 + Math.sin(t * 2) * 6); rotate(Math.sin(t * 1.5) * .05); castCrown(0, 0, 70, { col: '#2E5AA8' }, 1.6); pop(); }   // a bottle-cap boat, for later
}
// the soda splash: a crown of amber drops. age 0..1
function sodaSplash(x, y, age) {
  if (age < 0 || age > 1) return;
  for (let i = 0; i < 14; i++) { const a = -Math.PI * (.1 + .8 * i / 13), r = 80 + 380 * easeOut(age), g = 600 * age * age; paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r * 1.3 + g, 16 * (1 - age) + 4, 22 * (1 - age) + 4, 10), { wash: SODA_LT, ink: PAL.ink, sw: 1 }); }
}
