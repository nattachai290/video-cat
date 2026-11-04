// sets.js: the places of long/07 chapter 1 (1920 x 1080 world, 16:9) and their props.
//   couchSet(t)          the real living room: the big sofa face-on, its seat cushions with the gap between them
//   underDark(t, k)      the dark under the sofa: a slit of light above, k = how many glowing eyes are open (0..1)
//   slideTunnel(t, s)    the slide down through lost things; s = scroll (px) so the walls rush past
//   townSquare(t, o)     Lostland's square: matchbox houses, a coin wall, LED-lamp posts, bottle-cap paving.
//                        o.squash 0..1 squashes the house under Pumpkin; o.dark 0..1 dims it (the dragon's shadow)
// Props: matchbox, coin, pen, keyProp, chip, cheesePuff, receipt, marshmallowStone, pebble, crackerP, cookieP, dragonEyes,
//        titleCard
const CK = { wall: '#E8D9C2', wall2: '#DDCBB0', floor: '#B98157', floorDk: '#94603C', sofa: '#6D86C9', sofaDk: '#4E66A8', sofaLt: '#8FA4DC',
             dark: '#1E1A2B', dark2: '#2A2440', glow: '#FFE7A8', town: '#3A3354', town2: '#4A4268', ground: '#5B4B3F', groundLt: '#6E5B4C',
             match: '#E8C27A', matchDk: '#B98F48', matchLbl: '#C8363F', coin: '#E2B34A', coinDk: '#A97D22', led: '#9CF0B0' };
const TFY = 900;   // the town's ground line

// ---------- the real world ----------
function couchSet(t) {
  boilSeed('couch');
  paint(rectPts(-400, -300, 2800, 1100), { wash: CK.wall, ink: null });
  for (let i = -4; i < 30; i++) paint(rectPts(i * 110, -300, 40, 1100), { wash: CK.wall2, ink: null });
  paint(rectPts(-400, 780, 2800, 700), { wash: CK.floor, ink: null });
  for (let i = 0; i < 6; i++) inkLine([[-400, 820 + i * 50 + i * i * 6], [2400, 820 + i * 50 + i * i * 6]], 1.5, CK.floorDk, 'ink', 0);
  // a picture frame and a lamp for scale
  paint(rrPts(1420, 90, 220, 170, 10), { wash: '#FFF8EC', sw: 1.3 }); paint(rrPts(1440, 110, 180, 130, 6), { wash: '#9CC8E8', ink: null });
  paint([[1500, 240], [1560, 170], [1620, 240]], { wash: '#7FB36A', ink: null });
  // the sofa: back, two seat cushions with a gap at x 960, arms
  paint(rrPts(240, 200, 1440, 420, 70), { wash: CK.sofaDk, sw: 2, shade: true, shadeK: .4 });
  for (const x of [300, 980]) paint(rrPts(x, 250, 640, 330, 60), { wash: CK.sofa, sw: 1.6, shade: true, shadeK: .35 });
  for (const [x, w] of [[270, 690], [960, 690]]) paint(rrPts(x, 560, w, 200, 50), { wash: CK.sofaLt, sw: 1.8, shade: true, shadeK: .4 });
  paint(rectPts(948, 575, 24, 170), { wash: CK.dark, ink: null });   // the gap
  for (const x of [130, 1650]) paint(rrPts(x, 380, 160, 400, 60), { wash: CK.sofaDk, sw: 1.8, shade: true, shadeK: .45 });
  paint(rectPts(240, 760, 1440, 70), { wash: CK.sofaDk, sw: 1.6 });
  for (const x of [300, 1600]) paint(rrPts(x, 820, 40, 50, 8), { wash: '#5A3E2B', ink: null });
}
// ---------- under the sofa ----------
function underDark(t, k = 1) {
  paint(rectPts(-400, -300, 2800, 1700), { wash: CK.dark, ink: null });
  // the slit of light from the cushion gap, far above
  glow(960, -20, 300, CK.glow, .45); paint([[900, -60], [1020, -60], [1180, 1100], [740, 1100]], { wash: CK.glow, washOp: 22, ink: null });
  // dust motes in the beam
  for (let i = 0; i < 14; i++) { const y = (hash(i) * 1100 + t * 30) % 1100, x = 900 + (hash(i + 3) - .5) * 260 * (y / 1100 + .3); paint(ellPts(x, y, 3, 3, 6), { wash: CK.glow, washOp: 120, ink: null }); }
  // glowing eyes: pairs that blink open one by one
  const N = 22;
  for (let i = 0; i < N; i++) {
    if (hash(i * 3.3) > k) continue;
    const up = t > 7.4 && t < 9.6 ? -14 * ease(seg(t, 7.4, 7.7)) : 0, x = 120 + hash(i * 7.1) * 1680 + Math.sin(t * .8 + i) * 18, y = 520 + hash(i * 1.7) * 480 + Math.cos(t * .6 + i * 2) * 8, r = 7 + 9 * hash(i * 2.9), bl = ((t + i * .37) % 4) < .12;
    if (Math.abs(x - 960) < 160 && y < 700) continue;
    const talk = (i === 4 && ((t > .8 && t < 1.8) || (t > 3.8 && t < 5.2))) || (i === 9 && ((t > 2.4 && t < 3.3) || (t > 5.8 && t < 7.4)));   // the two whisperers
    for (const s of [-1, 1]) { glow(x + s * r * 2, y, r * (talk ? 5 : 3), '#FFE27A', talk ? .55 : .25); paint(ellPts(x + s * r * 2, y + up * .3, r, bl ? 1 : r * 1.15, 10), { wash: '#FFE98A', ink: null }); paint(ellPts(x + s * r * 2, y + up * .3 - r * .3 + up * .02, r * .45, r * .5, 8), { wash: '#2B2233', ink: null }); }
  }
}
// ---------- the slide ----------
function slideTunnel(t, s = 0) {
  paint(rectPts(-400, -400, 2800, 1900), { wash: CK.dark2, ink: null });
  // rushing wall stripes (lint and dust), scrolling up
  for (let i = 0; i < 18; i++) { const y = ((i * 140 - s) % 2520 + 2520) % 2520 - 720; paint(rrPts(-400, y, 2800, 26, 12), { wash: CK.dark, washOp: 160, ink: null }); }
  // the slide itself: a dented chute running down the middle
  paint(rectPts(560, -400, 800, 1900), { wash: '#5E5A7A', ink: null });
  inkLine([[560, -400], [560, 1500]], 4, '#2B2233', 'ink', 0); inkLine([[1360, -400], [1360, 1500]], 4, '#2B2233', 'ink', 0);
  for (let i = 0; i < 9; i++) { const y = ((i * 260 - s * 1.2) % 2340 + 2340) % 2340 - 400; inkLine([[600, y], [1320, y + 40]], 2, '#4B4766', 'ink', .3); }
}
// lost things flying past in the slide: [kind, x, phase]. scroll s.
const SLIDE_JUNK = [['pen', 300, 0], ['coin', 1560, .1], ['sock', 200, .25], ['key', 1650, .35], ['pen', 1500, .45], ['remote', 280, .6], ['coin', 380, .7], ['pen', 1700, .8], ['button', 1600, .9]];
function slideJunk(t, s) {
  SLIDE_JUNK.forEach(([k, x, ph], i) => {
    const y = 1300 - ((s * 1.6 + ph * 2200) % 2200), r = t * (1 + i % 3) * (i % 2 ? 1 : -1);
    if (k === 'pen') pen(x, y, r, i); else if (k === 'coin') coin(x, y, r); else if (k === 'sock') sockFlat(x, y, r); else if (k === 'key') keyProp(x, y, r); else if (k === 'remote') remoteP(x, y, r); else if (k === 'button') paint(ellPts(x, y, 30, 30, 18), { wash: '#E2464E', sw: 1.4 });
  });
}
// ---------- Lostland ----------
// The town is built from lost things, and every house is TALLER than its folk (folk: 5.5-7.5u = 220-300 px; houses 300-520 px):
// a thread-spool tower, a mug house, a sneaker house, a tin-can house, and the matchbox cottage with a playing-card roof that
// Pumpkin flattens. Above: the underside of the sofa (webbing straps, coil springs, the glowing gap). Floor: wooden boards.
const LOT = [   // [kind, centre x, scale]
  ['mug2', -1150, 1.55], ['can', -560, 1.55], ['spool', 30, 1.55], ['mug', 420, 1.55], ['sneaker', 1640, 1.55], ['spool2', 2260, 1.5], ['can2', 2700, 1.55], ['sneaker2', 3350, 1.55],
];
const COTTAGE = [960, 470, 430];   // centre x, w, h of the matchbox cottage Pumpkin lands on
function townSquare(t, o = {}) {
  boilSeed('town');
  // the underside of the sofa: dark lining, webbing straps, springs
  paint(rectPts(-900, -600, 3800, 1700), { wash: CK.town, ink: null });
  for (let i = -6; i < 22; i++) paint(rectPts(i * 170, -600, 90, 420), { wash: CK.town2, washOp: 140, ink: null });   // straps (down)
  for (const y of [-260, -80]) paint(rectPts(-900, y, 3800, 70), { wash: CK.town2, washOp: 120, ink: null });         // straps (across)
  glow(960, -60, 420, CK.glow, .6); paint(rrPts(870, -120, 180, 70, 24), { wash: CK.glow, ink: null });              // the gap, far up
  for (let i = 0; i < 9; i++) { const x = -500 + i * 380 + (i % 2) * 90; if (Math.abs(x - 960) < 200) continue; const sw = Math.sin(t * 1.3 + i) * 4; for (let k = 0; k < 7; k++) paint(ellPts(x + sw * k * .2, -70 + k * 24, 34, 9, 14), { ink: '#2A2440', sw: 3 }); }   // coil springs
  // far away: giant lost things as soft silhouettes (a pencil, a toy block, a slipper, a marble)
  const sil = '#2F2947';
  paint([[-300, TFY - 40], [80, TFY - 560], [120, TFY - 540], [-260, TFY - 20]], { wash: sil, ink: null });
  paint(rrPts(560, TFY - 470, 330, 330, 30), { wash: sil, ink: null });
  paint(ellPts(1560, TFY - 120, 420, 160, 26), { wash: sil, ink: null });
  paint(ellPts(2150, TFY - 220, 150, 150, 24), { wash: sil, ink: null });
  // a bunting line of thread with stamp flags, strung across the square
  const bunt = x => TFY - 650 + Math.pow((x - 960) / 960, 2) * 160 + Math.sin(t * 1.5 + x * .01) * 4;
  inkLine(Array.from({ length: 25 }, (_, i) => [-300 + i * 105, bunt(-300 + i * 105)]), 2, '#F2EAD8', 'ink', .2);
  for (let i = 0; i < 24; i++) { const x = -250 + i * 105, y = bunt(x); paint([[x - 22, y], [x + 22, y], [x, y + 42]], { wash: ['#E2464E', '#F2C14E', '#5FB3A8', '#9C8AD8'][i % 4], ink: PAL.ink, sw: 1 }); }
  // the floor: wooden boards, a crumb or two
  paint(rectPts(-900, TFY, 3800, 700), { wash: CK.floor, ink: null });
  for (let i = 0; i < 4; i++) inkLine([[-900, TFY + 40 + i * 60 + i * i * 10], [2900, TFY + 40 + i * 60 + i * i * 10]], 2, CK.floorDk, 'ink', 0);
  for (let i = 0; i < 12; i++) { const x = -800 + i * 330 + (i % 3) * 60; inkLine([[x, TFY + 40 + (i % 4) * 60], [x, TFY + 100 + (i % 4) * 70]], 2, CK.floorDk, 'ink', 0); }
  // matchstick lamp posts with LED lights
  for (const x of [-260, 200, 1270, 2000, 2480]) { paint(rectPts(x - 7, TFY - 420, 14, 420), { wash: '#E3C38E', ink: PAL.ink, sw: 1.2 }); paint(ellPts(x, TFY - 428, 15, 22, 12), { wash: '#C8363F', ink: PAL.ink, sw: 1.2 }); glow(x, TFY - 470, 90, CK.led, .55); paint(ellPts(x, TFY - 470, 16, 16, 10), { wash: CK.led, ink: PAL.ink, sw: 1 }); }
  // the houses
  LOT.forEach(([k, x, sc], i) => house(k, x, TFY, sc, t, i));
  if (o.house !== false) cottage(COTTAGE[0], TFY, o.squash || 0, t);
  if (o.dark) paint(rectPts(-900, -600, 3800, 1800), { wash: '#0E0B18', washOp: 200 * o.dark, ink: null });
}
// a lit window (warm glow), round or square
function win(x, y, w, h, round = false, t = 0, i = 0) {
  const lit = .75 + .25 * Math.sin(t * 1.7 + i * 2.3);
  glow(x, y, Math.max(w, h) * 1.1, '#FFD27A', .35 * lit);
  paint(round ? ellPts(x, y, w / 2, h / 2, 16) : rrPts(x - w / 2, y - h / 2, w, h, 6), { wash: '#FFE7A8', ink: PAL.ink, sw: 1.3 });
  if (round) { inkLine([[x - w / 2, y], [x + w / 2, y]], 1.2, PAL.ink, 'ink', 0); inkLine([[x, y - h / 2], [x, y + h / 2]], 1.2, PAL.ink, 'ink', 0); }
  else { inkLine([[x, y - h / 2], [x, y + h / 2]], 1.2, PAL.ink, 'ink', 0); paint(rectPts(x - w / 2 - 6, y + h / 2, w + 12, 8), { wash: '#B98F48', ink: PAL.ink, sw: 1 }); }
}
function door(x, y, w, h, col = '#8E5A3A') { paint([[x - w / 2, y], [x - w / 2, y - h + w / 2], ...arcPts(x, y - h + w / 2, w / 2, w / 2, Math.PI, TAU, 8), [x + w / 2, y]], { wash: col, ink: PAL.ink, sw: 1.4 }); paint(ellPts(x + w * .25, y - h * .45, 5, 5, 8), { wash: '#F2C14E', ink: PAL.ink, sw: .8 }); }
function house(kind, x, y, sc, t, i) {
  push(); translate(x, y); scale(sc, sc); translate(-x, -y);
  if (kind.startsWith('spool')) {   // a thread-spool tower with a bottle-cap roof and a pennant
    const c = kind === 'spool' ? '#E2464E' : '#5FB3A8', w = 190, h = 420;
    paint(ellPts(x, y - 12, w * .62, 22, 20), { wash: '#C9A26B', ink: PAL.ink, sw: 1.5 });
    paint(rectPts(x - w / 2, y - h + 30, w, h - 50), { wash: c, ink: PAL.ink, sw: 1.6, shade: true, shadeK: .45 });
    for (let k = 0; k < 14; k++) inkLine([[x - w / 2, y - 40 - k * 25], [x + w / 2, y - 30 - k * 25]], 1.2, mixCol(c, '#000000', .25), 'ink', 0);   // the wound thread
    paint(ellPts(x, y - h + 30, w * .62, 22, 20), { wash: '#C9A26B', ink: PAL.ink, sw: 1.5 });
    paint([[x - w * .66, y - h + 30], [x, y - h - 110], [x + w * .66, y - h + 30]], { wash: '#F2C14E', ink: PAL.ink, sw: 1.6, shade: true, shadeK: .5 });   // roof
    for (let k = -4; k <= 4; k++) inkLine([[x + k * w * .14, y - h + 32], [x + k * w * .05, y - h - 40]], 1, '#C9932F', 'ink', 0);
    inkLine([[x, y - h - 110], [x, y - h - 190]], 2.4, PAL.ink, 'ink', 0); paint([[x, y - h - 190], [x + 70 + Math.sin(t * 4) * 8, y - h - 175], [x, y - h - 155]], { wash: '#F2EAD8', ink: PAL.ink, sw: 1.2 });
    win(x, y - 320, 64, 64, true, t, i); door(x, y - 12, 104, 200);
    paint(rrPts(x + 60, y - 260, 80, 12, 4), { wash: '#C9CED6', ink: PAL.ink, sw: 1 });   // a hair-clip balcony
  } else if (kind.startsWith('mug')) {   // a mug house: polka dots, the handle is a balcony, a sugar-cube chimney
    const c = kind === 'mug' ? '#F6EBDA' : '#BFD9F2', w = 300, h = 330;
    const hp = arcPts(x + w / 2 - 10, y - h / 2 - 10, 95, 115, -Math.PI / 2 + .1, Math.PI / 2 - .1, 14);   // the handle (a balcony with a rail)
    paint(ribbon(hp, 44, 44), { wash: c, ink: PAL.ink, sw: 1.6 });
    inkLine([[x + w / 2 + 40, y - h / 2 - 50], [x + w / 2 + 40, y - h / 2 + 30]], 2, PAL.ink, 'ink', 0);
    paint([[x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2 - 14, y], [x - w / 2 + 14, y]], { wash: c, ink: PAL.ink, sw: 1.7, shade: true, shadeK: .4 });
    for (let k = 0; k < 9; k++) paint(ellPts(x - w / 2 + 30 + (k % 3) * 120 + (Math.floor(k / 3) % 2) * 50, y - h + 60 + Math.floor(k / 3) * 100, 14, 14, 10), { wash: '#E2848C', ink: null });
    paint(ellPts(x, y - h, w / 2, 20, 22), { wash: '#6E4A3A', ink: PAL.ink, sw: 1.5 });   // coffee on top = the roof
    paint(rrPts(x - 90, y - h - 70, 60, 60, 6), { wash: '#FFFFFF', ink: PAL.ink, sw: 1.3 });   // sugar-cube chimney
    for (let k = 0; k < 3; k++) { const f = frac(t * .4 + k / 3); paint(ellPts(x - 60 + Math.sin(f * 6) * 10, y - h - 90 - f * 120, 14 + f * 14, 10 + f * 10, 10), { wash: '#FFFFFF', washOp: 160 * (1 - f), ink: null }); }
    win(x - 95, y - 240, 54, 64, false, t, i); win(x + 95, y - 240, 54, 64, false, t, i + 1); door(x, y - 6, 110, 205, '#5E7FC8');
  } else if (kind.startsWith('sneaker')) {   // a lost sneaker lying on its side: the toe is the porch, the opening the roof garden
    const c = kind === 'sneaker' ? '#5E7FC8' : '#E2464E', w = 520;
    paint(rrPts(x - w / 2, y - 50, w, 50, 22), { wash: '#F6F1E6', ink: PAL.ink, sw: 1.6 });   // the sole
    for (let k = 0; k < 9; k++) inkLine([[x - w / 2 + 30 + k * 55, y - 30], [x - w / 2 + 50 + k * 55, y - 10]], 1.2, '#C9C3B6', 'ink', 0);
    const body = [[x - w / 2, y - 45], [x - w / 2 + 10, y - 260], [x - w / 2 + 110, y - 330], [x - 30, y - 300], [x + 60, y - 210], [x + w / 2 - 40, y - 160], [x + w / 2, y - 90], [x + w / 2, y - 45]];
    paint(body, { wash: c, ink: PAL.ink, sw: 1.7, curv: .35, shade: true, shadeK: .45 });
    paint([[x + 120, y - 45], [x + 140, y - 175], [x + w / 2 - 40, y - 160], [x + w / 2, y - 90], [x + w / 2, y - 45]], { wash: '#F6F1E6', ink: PAL.ink, sw: 1.4, curv: .35 });   // toe cap
    for (let k = 0; k < 4; k++) { const lx = x - 110 + k * 42, ly = y - 262 + k * 20; paint(ellPts(lx - 22, ly + 4, 6, 6, 8), { wash: '#F2EAD8', ink: PAL.ink, sw: .8 }); paint(ellPts(lx + 22, ly + 14, 6, 6, 8), { wash: '#F2EAD8', ink: PAL.ink, sw: .8 }); inkLine([[lx - 22, ly + 4], [lx + 22, ly + 14]], 6, '#FFFFFF', 'ink', 0); }   // eyelets + laces, on the instep
    paint(rrPts(x - 230, y - 110, 300, 26, 12), { wash: '#FFFFFF', washOp: 200, ink: PAL.ink, sw: 1 });   // a side stripe
    win(x + 200, y - 110, 54, 54, true, t, i); win(x - 190, y - 200, 56, 56, true, t, i + 1); door(x - 70, y - 48, 104, 200, '#F2C14E');
    paint(ellPts(x - w / 2 + 70, y - 320, 70, 18, 14), { wash: '#3B3F4A', ink: PAL.ink, sw: 1.2 });   // the opening = a roof garden
    for (let k = 0; k < 4; k++) paint(ellPts(x - w / 2 + 30 + k * 28, y - 340 - (k % 2) * 14, 16, 16, 10), { wash: '#7FB36A', ink: PAL.ink, sw: .8 });
  } else if (kind.startsWith('can')) {   // a tin-can house: ridges, a paper label, a bottle-cap roof
    const c = kind === 'can' ? '#F2C14E' : '#9C8AD8', w = 240, h = 430;
    paint(rectPts(x - w / 2, y - h, w, h), { wash: '#C9CED6', ink: PAL.ink, sw: 1.6, shade: true, shadeK: .5 });
    for (let k = 0; k < 6; k++) inkLine([[x - w / 2, y - 20 - k * 8], [x + w / 2, y - 20 - k * 8]], 1, '#959CA8', 'ink', 0);
    paint(rectPts(x - w / 2, y - h + 40, w, 110), { wash: c, ink: PAL.ink, sw: 1.3 });   // the label
    letter('BEANS', x, y - h + 95, 34, '#2B2233', { font: '800 34px "Baloo 2", sans-serif', ink: false });
    paint(ellPts(x, y - h, w / 2, 18, 20), { wash: '#DCE0EA', ink: PAL.ink, sw: 1.4 });
    castCrown(x, y - h + 4, 70, { col: '#E2464E' }, 1.6);   // a red bottle cap for a roof
    win(x - 82, y - 245, 40, 54, false, t, i); win(x + 82, y - 245, 40, 54, false, t, i + 1); door(x, y, 110, 210, '#5A3E2B');
  }
  pop();
}
// the matchbox cottage with a folded playing-card roof and a crayon chimney. squash 0..1 flattens it (Pumpkin lands on it).
function cottage(x, y, squash, t) {
  const [, w, h] = COTTAGE, H = h * (1 - squash * .8), W2 = w * (1 + squash * .3), X = x - W2 / 2, roofH = 120 * (1 - squash * .85);
  paint(rectPts(X, y - H, W2, H), { wash: CK.match, ink: PAL.ink, sw: 1.6, shade: true, shadeK: .4 });
  paint(rectPts(X, y - H + 30, 26, H - 30), { wash: '#8E5A3A', ink: PAL.ink, sw: 1 });   // the striker strip
  paint([[X - 40, y - H], [x, y - H - roofH * 1.3], [X + W2 + 40, y - H]], { wash: '#C8363F', ink: PAL.ink, sw: 1.6 });   // the card roof (its back)
  if (roofH > 30) { for (let k = 0; k < 4; k++) inkLine([[X + 20 + k * 40, y - H - 6], [x - 10 + k * 20, y - H - roofH + 16]], 1, '#F2EAD8', 'ink', 0); paint(rectPts(X + W2 - 70, y - H - roofH * .9, 26, roofH * .7), { wash: '#5FB3A8', ink: PAL.ink, sw: 1.2 }); }   // pattern + crayon chimney
  if (squash < .5) { win(X + 90, y - H * .66, 70, 76, false, t, 7); door(X + W2 - 130, y, 150, Math.min(290, H - 40)); }
  else for (let i = 0; i < 4; i++) inkLine([[X + W2 * (.15 + i * .22), y - H], [X + W2 * (.2 + i * .22), y - H * .3]], 1.4, CK.matchDk, 'ink', .4);
}
// (kept for the slide etc.)
function matchbox(x, y, w, h, c, squash = 0) { cottage(x + w / 2, y, squash, 0); }
function coin(x, y, r = 0, s = 1, flat = false) {
  push(); translate(x, y); rotate(r); scale(s, s);
  paint(ellPts(0, 0, 34, flat ? 30 : 34 * Math.abs(Math.cos(r * 2)) + 4, 18), { wash: CK.coin, ink: PAL.ink, sw: 1.2 });
  paint(ellPts(0, 0, 24, flat ? 21 : 24 * Math.abs(Math.cos(r * 2)) + 2, 16), { ink: CK.coinDk, sw: 1.4 });
  pop();
}
function pen(x, y, r = 0, i = 0) { push(); translate(x, y); rotate(r); const c = ['#2E5AA8', '#C8363F', '#2B2233'][i % 3]; paint(rrPts(-90, -11, 160, 22, 10), { wash: c, sw: 1.2 }); paint([[70, -9], [100, 0], [70, 9]], { wash: '#E8D9C2', sw: 1 }); paint(rectPts(-60, -15, 50, 6), { wash: '#C9CED6', ink: null }); pop(); }
function keyProp(x, y, r = 0) { push(); translate(x, y); rotate(r); paint(ellPts(-40, 0, 26, 26, 16), { wash: '#C9CED6', sw: 1.3 }); paint(ellPts(-40, 0, 10, 10, 10), { wash: CK.dark2, ink: null }); paint(rectPts(-16, -7, 90, 14), { wash: '#C9CED6', sw: 1.2 }); for (const k of [40, 58]) paint(rectPts(k, 7, 10, 14), { wash: '#C9CED6', sw: 1 }); pop(); }
function sockFlat(x, y, r = 0) { push(); translate(x, y); rotate(r); paint([[-30, -80], [30, -80], [30, 20], [80, 40], [80, 75], [-10, 75], [-30, 40]], { wash: '#F6F1E6', sw: 1.3, curv: .4 }); for (const yy of [-64, -48]) inkLine([[-30, yy], [30, yy]], 6, '#E2464E', 'ink', 0); pop(); }
function remoteP(x, y, r = 0) { push(); translate(x, y); rotate(r); paint(rrPts(-30, -90, 60, 180, 16), { wash: '#3B3F4A', sw: 1.3 }); paint(ellPts(0, -62, 12, 12, 10), { wash: '#E2464E', ink: null }); for (let rr = 0; rr < 3; rr++) for (const c of [-1, 1]) paint(ellPts(c * 13, -24 + rr * 28, 7, 6, 8), { wash: '#C9D3DB', ink: null }); pop(); }
function chip(x, y, r = 0, s = 1) { push(); translate(x, y); rotate(r); scale(s, s); paint([[-34, -6], [-20, -26], [10, -30], [34, -12], [30, 14], [4, 26], [-24, 20]], { wash: '#F2C14E', sw: 1.2, curv: .5 }); paint(ellPts(-6, -6, 8, 4, 6), { wash: '#FFE08A', ink: null }); pop(); }
function cheesePuff(x, y, r = 0, s = 1) { push(); translate(x, y); rotate(r); scale(s, s); paint(fluff(0, 0, 70, 24, 10, .18, 4), { wash: '#F59A2C', ink: PAL.ink, sw: 1.4, shade: true, shadeK: .4 }); for (let i = 0; i < 6; i++) paint(ellPts(-50 + i * 20, (i % 2 ? -6 : 6), 4, 3, 6), { wash: '#C9661A', ink: null }); pop(); }
function pebble(x, y, s = 1) { paint(ellPts(x, y - 16 * s, 30 * s, 20 * s, 14), { wash: '#9A938C', sw: 1.2, shade: true, shadeK: .4 }); }
function crackerP(x, y, r = 0, s = 1) { push(); translate(x, y); rotate(r); scale(s, s); paint(rrPts(-28, -20, 56, 40, 7), { wash: '#E6B65F', sw: 1.2 }); for (const [a, b] of [[-12, -8], [10, -8], [-12, 8], [10, 8]]) paint(ellPts(a, b, 3, 3, 6), { wash: '#B8813A', ink: null }); pop(); }
function cookieP(x, y, r = 0, s = 1) { push(); translate(x, y); rotate(r); scale(s, s); paint(ellPts(0, 0, 42, 40, 18), { wash: '#D9A35C', sw: 1.3, shade: true, shadeK: .4 }); for (const [a, b] of [[-14, -10], [12, -14], [4, 10], [-16, 14], [20, 8]]) paint(ellPts(a, b, 6, 5, 8), { wash: '#5A3A28', ink: null }); pop(); }
// the Ancient Receipt: a long curling paper strip from (x, y), unrolled to length L, with a cheese-puff doodle at the end
function receipt(x, y, L, t, showPuff = true) {
  const pts = []; for (let i = 0; i <= 20; i++) { const k = i / 20; pts.push([x + Math.sin(k * 6 + t) * 10, y + k * L]); }
  paint(ribbon(pts, 120, 120), { wash: '#FFFDF6', ink: PAL.ink, sw: 1.2 });
  for (let i = 1; i < 14 && i * 40 < L - 60; i++) inkLine([[x - 40, y + i * 40], [x + 30 - (i % 3) * 14, y + i * 40]], 2.5, '#B9B2A6', 'ink', 0);   // the printed lines
  if (showPuff && L > 300) cheesePuff(x, y + L - 70, .1, .7);
  paint(ellPts(x, y, 66, 18, 14), { wash: '#F1EAD8', ink: PAL.ink, sw: 1.2 });   // the roll
}
// the sword in the stone: Excalifork stuck in a marshmallow. pulled 0..1
function marshmallowStone(x, y, pulled = 0, t = 0) {
  paint(rrPts(x - 90, y - 120, 180, 120, 30), { wash: '#FFF4F2', sw: 1.6, shade: true, shadeK: .4 });
  paint(ellPts(x, y - 120, 90, 22, 18), { wash: '#FFFFFF', ink: PAL.ink, sw: 1.4 });
  if (pulled < 1) { push(); translate(x, y - 130 - pulled * 90); rotate(-Math.PI / 2); excalifork(.3 + .3 * Math.sin(t * 4))(40, 1.8); pop(); }
}
// the dragon's eyes in the far dark: two huge red glows. k 0..1 open. x, y centre.
function dragonEyes(x, y, k, t) {
  if (k <= 0) return;
  for (const s of [-1, 1]) { glow(x + s * 140, y, 160 * k, '#FF3A3A', .6 * k); paint(ellPts(x + s * 140, y, 70, 34 * k, 18), { wash: '#FF4A4A', ink: null }); paint(ellPts(x + s * 140, y, 26, 18 * k, 12), { wash: '#FFE0E0', ink: null }); }
}
// end-of-chapter title card
function titleCard(t, top, main, k = 1) {
  paint(rectPts(-10, -10, W + 20, H + 20), { wash: '#15121F', ink: null });
  letter(top, W / 2, 430, 56, '#C9C3F2', { font: '800 56px "Baloo 2", sans-serif', screen: true, alpha: k });
  letter(main, W / 2, 560, 120, '#FFE27A', { font: '800 120px "Baloo 2", sans-serif', stroke: '#2B2233', screen: true, alpha: k });
}

// ---------- the palace: a big round butter-cookie tin ----------
// Front (outside): the tin's blue side with a gold rim, a tall arched door, ribbon banners, steps made of stacked coins;
// spool towers either side. STEP = the height of the top step (the Queen stands on it, x 960).
const STEP = 150;
function tinPrint(x0, y0, w, h, col, t) { for (let r = 0; r < Math.ceil(h / 110); r++) for (let c = 0; c < Math.ceil(w / 120); c++) { const x = x0 + 60 + c * 120 + (r % 2) * 60, y = y0 + 55 + r * 110; if (x > x0 + w - 20) continue; paint(starPts(x, y, 22, .45, 6, t * .0), { wash: col, ink: null }); paint(ellPts(x, y, 6, 6, 8), { wash: '#3E64B0', ink: null }); } }
function palaceFront(t, o = {}) {
  boilSeed('palace');
  paint(rectPts(-900, -600, 3800, 1700), { wash: CK.town, ink: null });
  for (let i = -6; i < 22; i++) paint(rectPts(i * 170, -600, 90, 420), { wash: CK.town2, washOp: 140, ink: null });
  glow(960, -60, 420, CK.glow, .5);
  // the tin
  const L = 380, R = 1540, top = TFY - 820;
  paint(rectPts(L, top, R - L, TFY - top), { wash: '#4F78C8', ink: PAL.ink, sw: 2, shade: true, shadeK: .4 });
  tinPrint(L, top + 60, R - L, TFY - top - 120, '#F6F1E6', t);
  paint(rectPts(L - 20, top - 10, R - L + 40, 70), { wash: '#F2C14E', ink: PAL.ink, sw: 1.8 });   // the lid rim
  paint(ellPts((L + R) / 2, top - 10, (R - L) / 2 + 20, 40, 30), { wash: '#F6D27A', ink: PAL.ink, sw: 1.6 });
  paint(rectPts(L - 10, TFY - 60, R - L + 20, 60), { wash: '#F2C14E', ink: PAL.ink, sw: 1.6 });   // the base rim
  // banners: ribbons hanging from the rim
  for (const x of [520, 1400]) { const sw = Math.sin(t * 2 + x) * 8; paint([[x - 50, top + 60], [x + 50, top + 60], [x + 50 + sw, top + 420], [x + sw, top + 380], [x - 50 + sw, top + 420]], { wash: '#C8363F', ink: PAL.ink, sw: 1.4 }); paint(starPts(x + sw * .5, top + 200, 30, .45, 5), { wash: '#F2C14E', ink: null }); }
  // the great door (arched), open a crack of light
  door(960, TFY - STEP, 300, 520, '#8E5A3A'); if (!o.shut) paint(rectPts(955, TFY - STEP - 460, 10, 460), { wash: '#FFE7A8', ink: null });
  // the steps: stacked coins
  for (let k = 0; k < 3; k++) { const h = STEP / 3, y = TFY - (k + 1) * h, w = 760 - k * 160; paint(rrPts(960 - w / 2, y, w, h, 10), { wash: CK.coin, ink: PAL.ink, sw: 1.5 }); for (let j = 0; j < w / 30; j++) inkLine([[960 - w / 2 + 10 + j * 30, y + 6], [960 - w / 2 + 10 + j * 30, y + h - 6]], 1, CK.coinDk, 'ink', 0); }
  // spool towers either side
  house('spool', 160, TFY, 1.55, t, 3); house('spool2', 1760, TFY, 1.55, t, 4);
  paint(rectPts(-900, TFY, 3800, 700), { wash: CK.floor, ink: null });
  for (let i = 0; i < 4; i++) inkLine([[-900, TFY + 40 + i * 60 + i * i * 10], [2900, TFY + 40 + i * 60 + i * i * 10]], 2, CK.floorDk, 'ink', 0);
}
// Inside the tin: the throne room. Blue tin walls (printed), paper cookie-cups as wall lamps, a throne made of a pink eraser
// with a pin-cushion seat, a red ribbon carpet.
function throneRoom(t) {
  boilSeed('throne');
  paint(rectPts(-900, -600, 3800, 1700), { wash: '#3E64B0', ink: null });
  tinPrint(-900, -500, 3800, TFY + 400, '#5C82D0', t);
  for (const x of [200, 760, 1160, 1720]) { glow(x, TFY - 560, 110, '#FFD27A', .5); paint([[x - 60, TFY - 600], [x + 60, TFY - 600], [x + 44, TFY - 520], [x - 44, TFY - 520]], { wash: '#F6F1E6', ink: PAL.ink, sw: 1.3 }); for (let k = -3; k <= 3; k++) inkLine([[x + k * 16, TFY - 598], [x + k * 12, TFY - 522]], 1, '#C9C3B6', 'ink', 0); paint(ellPts(x, TFY - 520, 26, 14, 10), { wash: '#FFE7A8', ink: null }); }
  // the throne at the back (centre-left): an eraser with a pin-cushion
  paint(rrPts(380, TFY - 520, 280, 520, 30), { wash: '#F2A0AE', ink: PAL.ink, sw: 1.8, shade: true, shadeK: .4 });
  paint(rectPts(380, TFY - 210, 280, 90), { wash: '#5F8FD0', ink: PAL.ink, sw: 1.4 });
  paint(ellPts(520, TFY - 230, 150, 60, 20), { wash: '#C8363F', ink: PAL.ink, sw: 1.6 });
  for (let k = 0; k < 5; k++) { const px = 420 + k * 50; inkLine([[px, TFY - 250], [px + 10, TFY - 310]], 2, '#C9CED6', 'ink', 0); paint(ellPts(px + 10, TFY - 314, 8, 8, 8), { wash: ['#F2C14E', '#5FB3A8', '#9C8AD8'][k % 3], ink: PAL.ink, sw: .8 }); }
  // the floor: the tin's bottom (pale gold) and a ribbon carpet
  paint(rectPts(-900, TFY, 3800, 700), { wash: '#E9C878', ink: null });
  paint([[-900, TFY + 40], [2900, TFY + 40], [2900, TFY + 120], [-900, TFY + 120]], { wash: '#C8363F', ink: null });
  for (let i = 0; i < 3; i++) inkLine([[-900, TFY + 160 + i * 70], [2900, TFY + 160 + i * 70]], 2, '#C9A453', 'ink', 0);
}
// The edge of town: the last houses on the left, a gate of two coin stacks with a thread-and-button arch, and beyond it the
// dark under the sofa: dust dunes and, far away, the Dragon's lair. dark 0..1.
function townGate(t, o = {}) {
  boilSeed('gate');
  paint(rectPts(-900, -600, 3800, 1700), { wash: '#221D33', ink: null });
  for (let i = -6; i < 22; i++) paint(rectPts(i * 170, -600, 90, 420), { wash: CK.town, washOp: 160, ink: null });
  // dust dunes beyond the gate (right)
  for (const [x, w, c] of [[1500, 900, '#2C2640'], [2200, 1100, '#272138'], [1100, 700, '#302A46']]) paint(ellPts(x, TFY + 40, w / 2, 220, 30), { wash: c, ink: null });
  // the last houses, left
  house('mug', 140, TFY, 1.55, t, 5); house('spool', 560, TFY, 1.55, t, 6);
  // the gate: two coin stacks and an arch of thread with button beads
  for (const x of [880, 1420]) { for (let k = 0; k < 14; k++) paint(ellPts(x, TFY - 20 - k * 38, 70, 20, 18), { wash: CK.coin, ink: PAL.ink, sw: 1.3 }); }
  const arch = arcPts(1150, TFY - 560, 270, 160, Math.PI, TAU, 16);
  inkLine(arch, 6, '#F2EAD8', 'ink', .2); arch.forEach(([x, y], i) => { if (i % 3 === 0) paint(ellPts(x, y, 16, 16, 10), { wash: ['#E2464E', '#F2C14E', '#5FB3A8'][i % 3], ink: PAL.ink, sw: 1 }); });
  letter('LOSTLAND', 1150, TFY - 640, 46, '#F2C14E', { font: '800 46px "Baloo 2", sans-serif', stroke: '#2B2233' });
  paint(rectPts(-900, TFY, 3800, 700), { wash: CK.floor, ink: null });
  for (let i = 0; i < 4; i++) inkLine([[-900, TFY + 40 + i * 60 + i * i * 10], [2900, TFY + 40 + i * 60 + i * i * 10]], 2, CK.floorDk, 'ink', 0);
  if (o.dark) paint(rectPts(-900, -600, 3800, 1800), { wash: '#0E0B18', washOp: 190 * o.dark, ink: null });
}
