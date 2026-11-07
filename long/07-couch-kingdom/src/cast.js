// cast.js: the folk of Lostland (long/07 "The Kingdom Under the Couch"), drawn in the series' flat style.
// Every character: fn(x, y, u, o) with (x, y) = the ground point, u = the SAME size unit as Pumpkin & Pip (so scale reads).
// o: view 'front' | 'q' | 'side', flip, rot, dy (in u), noShadow, boilKey, who (lip-sync), plus the shared face fields
// (eyes, lid, pupil, brow, browUp, mouth, talk, lookX, lookY, blush): use face('name') / faces(t, keys) as for the cast.
// Heights (u): Pip 6.6 · Sir Lint 5.6 (with helmet) · Queen Button 7.4 (with crown) · Sock Troll 6.4 · Oracle Cookie 3.2 · Dust Bunny 2.8
//
//   sirLint(x, y, u, o)        a knight made of a ball of lint: thimble helmet, bottle-cap shield, toothpick lance.
//                              o.poof 0..1: he sneezes and half of him puffs away (comes back as poof -> 0)
//   queenButton(x, y, u, o)    a big teal button: the top two holes are her eyes, a thread smile, a paper-clip crown,
//                              thread limbs, a sewing-needle sceptre. Side view: a thin disc (a button seen edge-on).
//   oracleCookie(x, y, u, o)   a talking fortune cookie that hovers; o.paper 0..1 slides her fortune out like a tongue,
//                              o.text = what it says.
//   sockTroll(x, y, u, o)      a lone striped sock standing on its cuff, toe = head with two sewn-button eyes. o.tears 0..1
//   dustBunny(x, y, u, o)      a tiny bunny made of dust: fluff ball, long fluffy ears. o.seed varies size and ears.
//   sockCape(x, y, u, o)       Pumpkin's cape (the troll's lost twin: same stripes). Draw it BEFORE pumpkin() with the same
//                              x, y, u, view, flip, rot. o.wind -1..1 blows it.
//   excalifork(lit)            Pumpkin's paw hook (armR): a plastic fork; lit 0..1 = magic glow.
//   pipPack(x, y, u, o)        Pip's cracker backpack (draw BEFORE pip()).
const LOST = {
  lint: '#B9BFD3', lintDk: '#8E95AD', lintLt: '#DCE0EA', thimble: '#C9CED6', thimbleDk: '#959CA8', cap: '#D2434B', capDk: '#9C2B33',
  pick: '#E3C38E', pickDk: '#B8945A', button: '#5FB3A8', buttonDk: '#3E8C82', buttonLt: '#8ED1C6', thread: '#F2EAD8', clip: '#B7BEC9',
  cookie: '#E9B860', cookieDk: '#C48A3A', cookieLt: '#F6D99A', paper: '#FFFDF6', mystic: '#B79CF2',
  sock: ['#3E8C82', '#F2C14E', '#FFF8EC'], sockDk: '#2C6B63', sockPink: ['#D9607A', '#F5A9B8', '#FFF4F4'], sockPinkDk: '#A8435A', btnEye: '#3B3F4A', dust: '#A3A0B0', dustDk: '#7C7889', dustLt: '#C9C6D3',
};

// soft scalloped outline (fluff): bumps round an ellipse
function fluff(cx, cy, rx, ry, n = 14, b = .12, seed = 1, jit = 0) {
  const pts = [];
  for (let i = 0; i < n; i++) for (let k = 0; k <= 5; k++) {
    const a = (i + k / 5) / n * TAU - Math.PI / 2, bump = Math.sin(k / 5 * Math.PI) * b * (.8 + .5 * hash(i * 3.1 + seed)) + jit * Math.sin(T * 17 + i) * .02;
    pts.push([cx + Math.cos(a) * rx * (1 + bump), cy + Math.sin(a) * ry * (1 + bump)]);
  }
  return pts;
}
function clipPoly(pts, fn) { push(); CTX.beginPath(); pts.forEach(([x, y], i) => i ? CTX.lineTo(x, y) : CTX.moveTo(x, y)); CTX.closePath(); CTX.clip(); fn(); pop(); }
// horizontal stripe bands (alternating cols) between y0 and y1, clipped by the caller
function bands(x0, x1, y0, y1, n, cols) { const h = (y1 - y0) / n; for (let i = 0; i < n; i++) paint(rectPts(x0, y0 + i * h, x1 - x0, h + 1), { wash: cols[i % cols.length], ink: null }); }
const folkSW = (u, o) => clamp(u / 16, .5, 2.8) * (o.swMul || 1) * .9;
// a two-eyed face centred at (fx, fy): bead eyes (style 'bead') or cat eyes, brows, mouth (lip-syncs with o.who)
function folkFace(fx, fy, u, o, sw, skin, { gap = .55, er = .3, my = .6, mw = .6, style = 'bead', brow = true, single = false, mouth = true } = {}) {
  const talk = o.talk ?? (o.who && typeof SPEAK === 'function' ? SPEAK(o.who, T) : 0);
  const kinds = Array.isArray(o.eyes) ? o.eyes : [o.eyes || 'open', o.eyes || 'open'];
  for (const s of single ? [1] : [-1, 1]) {
    const ex = fx + s * gap * u * (single ? 0 : 1), ey = fy;
    push(); translate(ex, ey); castEye(kinds[s < 0 ? 0 : 1], s, er * u, er * 1.15 * u, o, sw * .8, skin, '#3A3045', style); pop();
    if (brow) castBrow(ex, ey, er * 1.8 * u, er * 1.7 * u, s, o.brow || 0, (o.browUp || 0) + (s < 0 ? o.browL || 0 : o.browR || 0), sw * .7);
  }
  if (o.blush) for (const s of single ? [1] : [-1, 1]) paint(ellPts(fx + s * (gap + .35) * u * (single ? .3 : 1), fy + .45 * u, .3 * u, .16 * u, 10), { wash: '#E8607A', washOp: 150 * o.blush, ink: null });
  if (mouth) { push(); translate(fx + (single ? .25 * u : 0), fy + my * u); castMouth(o.mouth || 'w', talk, mw * u, sw * .8); pop(); }
}
function folkBegin(x, y, u, o, shadowRx) {
  const id = o.boilKey ?? ('lf' + (++CLAWD_N));
  boilSeed('folk ' + id);
  if (!o.noShadow) castShadow(x, y, shadowRx * u, u * .6, o.dy);
  push(); translate(x, y + (o.dy || 0) * u); if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + (o.sq || 0) * .6), 1 - (o.sq || 0));
}

// ---------- Sir Lint ----------
function sirLint(x, y, u, o = {}) {
  const C = LOST, sw = folkSW(u, o), view = o.view || 'front', q = view === 'q' ? 1 : 0, side = view === 'side';
  const poof = clamp(o.poof || 0);
  folkBegin(x, y, u, o, 1.7);
  const fx = side ? .9 * u : q * .45 * u;
  // legs: two stubby dark-grey legs with tiny boots
  for (const s of side ? [-.3, .5] : [-1, 1]) { const lx = (side ? s : s * .6) * u; paint(rrPts(lx - .22 * u, -1.1 * u, .44 * u, 1.0 * u, .2 * u), { wash: C.lintDk, ink: PAL.ink, sw: sw * .6 }); paint(ellPts(lx + (side ? .15 * u : 0), -.1 * u, .4 * u, .2 * u, 10), { wash: '#5A4A44', ink: PAL.ink, sw: sw * .6 }); }
  // the toothpick lance (behind in front view, held in his right nub)
  const lx = side ? 1.3 * u : 1.7 * u + q * .3 * u, la = o.lance ?? 0;
  push(); translate(lx, -1.8 * u); rotate(-.12 + la);
  paint([[-.09 * u, 1.6 * u], [.09 * u, 1.6 * u], [.05 * u, -3.4 * u], [0, -3.8 * u], [-.05 * u, -3.4 * u]], { wash: C.pick, ink: PAL.ink, sw: sw * .6 }); pop();
  // the lint body: a fluffy ball (part of it missing when he sneezes)
  const body = fluff(0, -2.4 * u, 1.75 * u * (1 - poof * .25), 1.65 * u * (1 - poof * .35), 15, .14, 3, 1);
  paint(body, { wash: C.lint, ink: PAL.ink, sw: sw * .85, shade: true, shadeK: .45 });
  for (let i = 0; i < 6; i++) { const a = hash(i * 7) * TAU, d = .3 + .5 * hash(i * 5); inkLine(arcPts(Math.cos(a) * 1.4 * u * d, -2.4 * u + Math.sin(a) * 1.3 * u * d, .3 * u, .14 * u, Math.PI * 1.1, Math.PI * 1.9, 4), sw * .5, C.lintDk, 'ink', .3); }
  // the nub arm holding the lance
  paint(fluff(lx - .2 * u, -1.9 * u, .38 * u, .32 * u, 6, .2, 9), { wash: C.lint, ink: PAL.ink, sw: sw * .6 });
  // face: under the helmet rim
  folkFace(fx, -2.35 * u, u, o, sw, C.lint, { gap: side ? 0 : .52, er: .27, my: .62, mw: .5, single: side });
  // bushy lint brows (the grand old knight look) on top of the plain brows
  for (const s of side ? [1] : [-1, 1]) { const bx = fx + s * (side ? 0 : .52) * u, by = -3.08 * u - (o.browUp || 0) * .12 * u + (s * (o.brow || 0) * .08 * u); paint(fluff(bx, by, .38 * u, .15 * u, 5, .3, 11 + s), { wash: C.lintLt, ink: PAL.ink, sw: sw * .45 }); }
  // the thimble helmet
  push(); translate(side ? .1 * u : q * .15 * u, -3.45 * u);
  paint([[-1.05 * u, 0], [1.05 * u, 0], [.85 * u, -1.6 * u], [.5 * u, -1.95 * u], [-.5 * u, -1.95 * u], [-.85 * u, -1.6 * u]], { wash: C.thimble, ink: PAL.ink, sw: sw * .8, curv: .4, shade: true, shadeK: .55 });
  paint(rrPts(-1.15 * u, -.28 * u, 2.3 * u, .36 * u, .14 * u), { wash: C.thimbleDk, ink: PAL.ink, sw: sw * .6 });
  for (let r = 0; r < 4; r++) for (let c = -3; c <= 3; c++) { const px = c * .26 * u * (1 - r * .09) + (r % 2) * .13 * u, py = -.55 * u - r * .3 * u; if (Math.abs(px) < .8 * u - r * .05 * u) paint(ellPts(px, py, .06 * u, .05 * u, 6), { wash: C.thimbleDk, ink: null }); }
  paint(rrPts(-.55 * u, -1.7 * u, .3 * u, .9 * u, .15 * u), { wash: '#FFFFFF', washOp: 120, ink: null });   // shine
  // a little lint plume on top
  paint(fluff(.1 * u, -2.2 * u, .35 * u, .4 * u, 6, .3, 13, 1), { wash: C.cap, ink: PAL.ink, sw: sw * .5 });
  pop();
  // the bottle-cap shield on his left (front of him in front / q; hidden behind in side)
  if (!side && !o.noShield) {
    push(); translate(-1.75 * u + q * .3 * u, -1.45 * u); rotate(-.1);
    const R = 1.0 * u, rim = []; for (let i = 0; i < 42; i++) { const a = i / 42 * TAU; rim.push([Math.cos(a) * R * (i % 2 ? 1.06 : .98) * (1 - q * .2), Math.sin(a) * R * (i % 2 ? 1.06 : .98)]); }
    paint(rim, { wash: C.capDk, ink: PAL.ink, sw: sw * .7 });
    paint(ellPts(0, 0, R * .82 * (1 - q * .2), R * .82, 20), { wash: C.cap, ink: null, shade: true, shadeK: .4 });
    paint(starPts(0, 0, R * .45, .45, 5), { wash: '#F2C14E', ink: PAL.ink, sw: sw * .4 });
    pop();
  }
  // the sneeze: a puff of lint drifting off
  if (poof > .02) for (let i = 0; i < 7; i++) { const a = -1.2 + i * .45, r = (1.6 + poof * 2.4 + hash(i) * .6) * u; paint(fluff(Math.cos(a) * r, -2.4 * u + Math.sin(a) * r * .6 - poof * u, (.25 + .2 * hash(i + 3)) * u * (1 - poof * .4), .22 * u, 5, .3, 20 + i), { wash: C.lint, washOp: 255 * (1 - poof * .6), ink: PAL.ink, sw: sw * .4 }); }
  pop();
}

// ---------- Queen Button ----------
function queenButton(x, y, u, o = {}) {
  const C = o.col ? { ...LOST, ...o.col } : LOST, sw = folkSW(u, o), view = o.view || 'front', q = view === 'q' ? 1 : 0, side = view === 'side';
  folkBegin(x, y, u, o, 1.8);
  const cy = -3.6 * u, R = 2.5 * u, rx = side ? .55 * u : R * (1 - q * .22);
  // thread legs and arms (drawn first, the disc covers their roots)
  for (const s of [-1, 1]) { inkLine([[s * .5 * u, -1.4 * u], [s * .6 * u, -.15 * u]], sw * 1.4, PAL.ink, 'ink', .2); paint(ellPts(s * .7 * u, -.1 * u, .32 * u, .16 * u, 10), { wash: C.buttonDk, ink: PAL.ink, sw: sw * .5 }); }
  const aL = o.aL ?? -.9, aR = o.aR ?? .5;
  for (const [s, a] of side ? [[1, aR]] : [[-1, aL], [1, aR]]) { const sx = s * rx * .95, sy = cy + .3 * u, ex = sx + s * Math.cos(a) * 1.5 * u, ey = sy - Math.sin(a) * 1.5 * u;
    inkLine([[sx, sy], [lerp(sx, ex, .5), lerp(sy, ey, .5) + .1 * u], [ex, ey]], sw * 1.4, PAL.ink, 'ink', .2); paint(ellPts(ex, ey, .2 * u, .2 * u, 8), { wash: C.thread, ink: PAL.ink, sw: sw * .5 });
    if (s > 0 && o.sceptre !== false) {   // the sewing-needle sceptre, thread trailing from its eye
      push(); translate(ex, ey); rotate(-.15);
      paint([[-.07 * u, 1.3 * u], [.07 * u, 1.3 * u], [.08 * u, -2.2 * u], [0, -2.6 * u], [-.08 * u, -2.2 * u]], { wash: C.clip, ink: PAL.ink, sw: sw * .6 });
      paint(ellPts(0, -1.95 * u, .04 * u, .18 * u, 8), { wash: '#FFFFFF', ink: PAL.ink, sw: sw * .4 });
      inkLine([[0, -1.95 * u], [-.5 * u, -1.4 * u + Math.sin(T * 3) * .1 * u], [-.3 * u, -.4 * u], [-.7 * u, .3 * u]], sw * .9, '#E2464E', 'ink', .4);
      pop();
    }
  }
  // the disc: the edge (thickness) shows in 3/4 and side view
  if (q || side) paint(ellPts(side ? -.2 * u : -.25 * u, cy, rx, R, 30), { wash: C.buttonDk, ink: PAL.ink, sw });
  paint(ellPts(0, cy, rx, R, 30), { wash: C.button, ink: PAL.ink, sw, shade: true, shadeK: .45 });
  if (!side) {
    paint(ellPts(0, cy, rx * .82, R * .82, 28), { ink: C.buttonDk, sw: sw * 1.6 });   // the raised rim
    paint(ellPts(-rx * .35, cy - R * .5, rx * .25, R * .12, 12), { wash: C.buttonLt, ink: null });
    // four holes: the top two are her eyes, the bottom two are stitched with a thread smile
    const hx = .62 * u * (1 - q * .2), fx = q * .3 * u;
    for (const s of [-1, 1]) paint(ellPts(fx + s * hx, cy + .55 * u, .26 * u * (1 - q * .2), .26 * u, 12), { wash: C.buttonDk, ink: PAL.ink, sw: sw * .5 });
    folkFace(fx, cy - .45 * u, u, o, sw, C.button, { gap: hx / u, er: .36, style: 'bead', mouth: false });
    // the thread mouth between the lower holes: a smile / frown / O / talk
    const talk = o.talk ?? (o.who && typeof SPEAK === 'function' ? SPEAK(o.who, T) : 0);
    push(); translate(fx, cy + .9 * u); castMouth(o.mouth || 'smile', talk, .9 * u, sw * .8); pop();
    for (const s of [-1, 1]) inkLine([[fx + s * hx, cy + .55 * u], [fx + s * hx * .7, cy + .85 * u]], sw * .8, C.thread, 'ink', 0);
  } else {
    // edge-on: one eye on the rim, the crown tilted
    folkFace(.15 * u, cy - .5 * u, u, o, sw, C.button, { er: .2, my: .7, mw: .35, single: true });
  }
  // the paper-clip crown (citizens: o.noCrown)
  if (!o.noCrown) {
  push(); translate(side ? 0 : q * .2 * u, cy - R * .96); rotate(side ? .1 : 0); scale(side ? .45 : 1 - q * .15, 1);
  const P = [[-1.2, 0], [-1.2, -1.0], [-.6, -.45], [0, -1.3], [.6, -.45], [1.2, -1.0], [1.2, 0]].map(([a, b]) => [a * u, b * u]);
  inkLine(P, sw * 3.2, PAL.ink, 'ink', 0); inkLine(P, sw * 2.0, C.clip, 'ink', 0);
  for (const [a, b] of [[-1.2, -1.0], [0, -1.3], [1.2, -1.0]]) paint(ellPts(a * u, b * u, .16 * u, .16 * u, 8), { wash: '#E2464E', ink: PAL.ink, sw: sw * .4 });
  pop();
  }
  pop();
}
// a button citizen: a smaller plain button in another colour, no crown, no sceptre
const BTN_COLS = [{ button: '#E2848C', buttonDk: '#B85A63', buttonLt: '#F5B5BA' }, { button: '#F2C14E', buttonDk: '#C9932F', buttonLt: '#FFE08A' }, { button: '#9C8AD8', buttonDk: '#7564B0', buttonLt: '#C3B6EE' }];
function buttonFolk(x, y, u, o = {}) { queenButton(x, y, u * .7, { ...o, col: BTN_COLS[(o.seed || 0) % 3], noCrown: true, sceptre: false }); }

// ---------- Oracle Cookie ----------
function oracleCookie(x, y, u, o = {}) {
  const C = LOST, sw = folkSW(u, o), hov = Math.sin(T * 2.2) * .25 * u, paperK = clamp(o.paper ?? 0);
  folkBegin(x, y, u, { ...o, noShadow: true }, 1.4);
  if (!o.noShadow) paint(ellPts(0, 0, 1.4 * u, .3 * u, 16), { wash: PAL.ink, washOp: 50, ink: null });
  translate(0, -2.1 * u + hov);
  glow(0, 0, 3.4 * u, C.mystic, .45);
  for (let i = 0; i < 5; i++) { const a = T * 1.3 + i * TAU / 5; paint(starPts(Math.cos(a) * 2.4 * u, Math.sin(a) * .9 * u, .14 * u, .4, 4), { wash: '#FFF2C4', ink: null }); }
  // the cookie: a folded crescent. Front: a dome with the two pinched wings curling down at the sides and the fold (a V notch)
  // in the bottom middle; the fortune slides out of the fold like a tongue
  const shell = [[-2.3 * u, .55 * u], [-2.2 * u, -.3 * u], [-1.4 * u, -1.15 * u], [0, -1.45 * u], [1.4 * u, -1.15 * u], [2.2 * u, -.3 * u], [2.3 * u, .55 * u],
                 [1.75 * u, .75 * u], [1.0 * u, .45 * u], [.35 * u, .8 * u], [0, .3 * u], [-.35 * u, .8 * u], [-1.0 * u, .45 * u], [-1.75 * u, .75 * u]];
  paint(shell, { wash: C.cookie, ink: PAL.ink, sw, curv: .4, shade: true, shadeK: .45 });
  for (const s2 of [-1, 1]) paint([[s2 * 2.25 * u, .5 * u], [s2 * 1.75 * u, .72 * u], [s2 * 1.2 * u, .5 * u], [s2 * 1.75 * u, .15 * u]], { wash: C.cookieDk, ink: PAL.ink, sw: sw * .7, curv: .4 });   // inner side of the wings
  inkLine([[0, .3 * u], [0, -.25 * u]], sw * .9, C.cookieDk, 'ink', .3);   // the fold
  paint(ellPts(-.8 * u, -.85 * u, .5 * u, .14 * u, 10), { wash: C.cookieLt, ink: null });
  if (paperK > .01) {
    const L = paperK * 3.0 * u;
    push(); translate(0, .5 * u); rotate(.12);
    paint(rectPts(-.1 * u, -.2 * u, L, .4 * u), { wash: C.paper, ink: PAL.ink, sw: sw * .5 });
    for (let i = 0; i < 4; i++) inkLine([[.25 * u + i * L * .2, 0], [.25 * u + i * L * .2 + L * .12, 0]], sw * .9, '#B23A44', 'ink', 0);   // the writing (as marks; the words come in the subtitles)
    pop();
  }
  const talk = o.talk ?? (o.who && typeof SPEAK === 'function' ? SPEAK(o.who, T) : 0);
  if (talk > .05) paint(ellPts(0, .45 * u, .35 * u, .2 * u * talk + .03 * u, 10), { wash: '#4A1F2A', ink: PAL.ink, sw: sw * .6 });
  // half-lidded mystic eyes
  for (const s of [-1, 1]) { push(); translate(s * .7 * u, -.55 * u); castEye((Array.isArray(o.eyes) ? o.eyes[s < 0 ? 0 : 1] : o.eyes) || 'open', s, .3 * u, .3 * u, { ...o, lid: o.lid ?? .45, pupil: o.pupil ?? .6 }, sw * .8, C.cookie, C.mystic, 'cat'); pop(); }
  for (const s of [-1, 1]) castBrow(s * .7 * u, -.55 * u, .5 * u, .45 * u, s, o.brow || 0, o.browUp || 0, sw * .6);
  pop();
}

// ---------- Sock Troll ----------
// Side view: an upside-down L. The cuff stands on the ground, the leg goes up, the heel is the bump at the back of the bend
// and the foot points forward at the top: the toe is his head (face on the side of the foot). Front: a tube, toe on top.
function sockOutline(u, side, bend = 0) {
  const b = bend * .3 * u;
  if (!side) return [[-1.0 * u, -.25 * u], [-1.0 * u, -4.2 * u], [-.8 * u, -5.4 * u], [0, -5.9 * u], [.8 * u, -5.4 * u], [1.0 * u, -4.2 * u], [1.0 * u, -.25 * u]];
  return [[-1.0 * u, -.25 * u], [-1.05 * u, -3.4 * u], [-1.35 * u, -4.5 * u], [-.9 * u, -5.5 * u], [0, -5.85 * u + b], [1.3 * u, -5.9 * u + b], [2.3 * u, -5.55 * u + b],
          [2.55 * u, -4.85 * u + b], [2.1 * u, -4.2 * u + b], [1.2 * u, -4.0 * u], [.95 * u, -3.4 * u], [1.0 * u, -.25 * u]];
}
function sockTroll(x, y, u, o = {}) {
  const C = o.pink ? { ...LOST, sock: LOST.sockPink, sockDk: LOST.sockPinkDk } : LOST, sw = folkSW(u, o), side = (o.view || 'side') !== 'front';
  folkBegin(x, y, u, o, 1.6);
  const bend = o.bend ?? Math.sin(T * 2) * .4, P = sockOutline(u, side, bend), b = bend * .3 * u;
  paint(P, { wash: C.sock[2], ink: null, curv: .35 });
  clipPoly(P, () => {
    bands(-3 * u, 3 * u, -3.6 * u, -.5 * u, 6, [C.sock[0], C.sock[2], C.sock[1], C.sock[2]]);                                   // the striped leg
    if (side) { paint(ellPts(-1.2 * u, -4.9 * u, .9 * u, .8 * u, 16), { wash: C.sock[0], ink: null }); paint(ellPts(2.75 * u, -4.95 * u + b, .95 * u, 1.1 * u, 18), { wash: C.sock[0], ink: null }); }   // heel + toe patches
    else paint(ellPts(0, -5.6 * u, 1.3 * u, 1.0 * u, 18), { wash: C.sock[0], ink: null });
    paint(P.map(([px, py]) => [px * .9 - .1 * u, py]), { wash: '#000000', washOp: 0, ink: null, shade: true, shadeK: .35 });
  });
  paint(P, { ink: PAL.ink, sw, curv: .35 });
  paint(rrPts(-1.1 * u, -.55 * u, 2.2 * u, .6 * u, .22 * u), { wash: C.sock[0], ink: PAL.ink, sw: sw * .8 });   // the ribbed cuff
  for (let i = -3; i <= 3; i++) inkLine([[i * .28 * u, -.48 * u], [i * .28 * u, -.02 * u]], sw * .5, C.sockDk, 'ink', 0);
  // two sewn-on button eyes (four thread holes each, a shine), stitched brows
  const eyes = side ? [[.45 * u, -5.0 * u + b], [1.15 * u, -5.05 * u + b]] : [[-.42 * u, -4.6 * u], [.42 * u, -4.6 * u]];
  const shut = o.eyes === 'closed' || o.eyes === 'happy';
  eyes.forEach(([ex, ey], i) => {
    const r = .3 * u * (side && i === 0 ? .85 : 1), s = i ? 1 : -1;
    if (shut) { inkLine([[ex - r, ey + (o.eyes === 'happy' ? .1 * u : 0)], [ex, ey + (o.eyes === 'happy' ? -.12 * u : .1 * u)], [ex + r, ey + (o.eyes === 'happy' ? .1 * u : 0)]], sw * 1.3, PAL.ink, 'ink', .4); }
    else {
      paint(ellPts(ex, ey, r, r, 14), { wash: C.btnEye, ink: PAL.ink, sw: sw * .6 });
      const lx = (o.lookX || 0) * r * .25, ly = (o.lookY || 0) * r * .25;
      for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) paint(ellPts(ex + lx + dx * r * .28, ey + ly + dy * r * .28, r * .1, r * .1, 6), { wash: '#1B1D24', ink: null });
      paint(ellPts(ex - r * .45, ey - r * .45, r * .2, r * .14, 6), { wash: '#FFFFFF', washOp: 200, ink: null });
    }
    if (o.pink && !shut) for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + (k - 1) * .45 + (i ? .35 : -.35); inkLine([[ex + Math.cos(a) * r, ey + Math.sin(a) * r], [ex + Math.cos(a) * r * 1.55, ey + Math.sin(a) * r * 1.55]], sw * 1.1, PAL.ink, 'ink', 0); }   // eyelashes
    const br = o.brow || 0, up = (o.browUp || 0) * .12 * u;
    inkLine([[ex - .32 * u, ey - .48 * u + s * br * .13 * u - up], [ex + .32 * u, ey - .48 * u - s * br * .13 * u - up]], sw * 1.1, PAL.ink, 'ink', .2);
  });
  // the mouth: a slit near the toe that opens when he talks
  const talk = o.talk ?? (o.who && typeof SPEAK === 'function' ? SPEAK(o.who, T) : 0);
  push(); translate(side ? 1.35 * u : 0, (side ? -4.45 * u + b : -4.0 * u)); castMouth(o.mouth || 'frown', talk, .65 * u, sw * .8); pop();
  if (o.tears) for (let i = 0; i < 2; i++) { const [ex, ey] = eyes[i], k = frac(T * 1.4 + i * .5); paint(ellPts(ex, ey + .35 * u + k * 1.2 * u, .12 * u, .18 * u, 8), { wash: '#8FD3F0', washOp: 255 * o.tears * (1 - k), ink: null }); }
  pop();
}

// ---------- Dust Bunny ----------
function dustBunny(x, y, u, o = {}) {
  const C = LOST, sw = folkSW(u, o) * .8, sd = o.seed || 1, s = .85 + .3 * hash(sd), ear = .8 + .4 * hash(sd + 3);
  folkBegin(x, y, u * s, o, 1.0);
  const U = u * s, hop = o.hop ? -Math.abs(Math.sin(T * 9 + sd)) * .6 * U : 0;
  translate(0, hop);
  for (const d of [-1, 1]) { push(); translate(d * .4 * U, -2.0 * U); rotate(d * (.25 + .08 * Math.sin(T * 4 + sd))); paint(fluff(0, -.75 * U * ear, .32 * U, .85 * U * ear, 8, .18, sd + d), { wash: C.dust, ink: PAL.ink, sw }); paint(ellPts(0, -.75 * U * ear, .12 * U, .5 * U * ear, 8), { wash: mixCol(C.dust, '#F0A7B6', .5), ink: null }); pop(); }
  paint(fluff(0, -1.15 * U, 1.15 * U, 1.05 * U, 12, .16, sd, 1), { wash: C.dust, ink: PAL.ink, sw, shade: true, shadeK: .4 });
  for (const d of [-1, 1]) paint(ellPts(d * .5 * U, -.05 * U, .28 * U, .14 * U, 8), { wash: C.dustDk, ink: PAL.ink, sw: sw * .6 });
  for (const d of [-1, 1]) { push(); translate(d * .38 * U, -1.35 * U); castEye(o.eyes || 'open', d, .16 * U, .19 * U, { ...o, pupil: 1 }, sw, C.dust, '#2B2233', 'bead'); pop(); }
  paint(ellPts(0, -1.0 * U, .1 * U, .08 * U, 8), { wash: '#F0A7B6', ink: null });
  if (o.mouth && o.mouth !== 'w') { push(); translate(0, -.75 * U); castMouth(o.mouth, o.talk || 0, .35 * U, sw * .8); pop(); }
  pop();
}

// ---------- Pumpkin's costume & Pip's backpack ----------
// The sock cape: the troll's twin (same stripes), hanging from the shoulders BEHIND the body; it peeks out at both sides and
// its green toe shows under him. Same x, y, u, view, flip, rot as pumpkin(). o.wind -1..1 blows it.
function sockCape(x, y, u, o = {}) {
  const C = { ...LOST, sock: LOST.sockPink }, sw = clamp(u / 15, .5, 3), view = o.view || 'front', side = view === 'side', q = view === 'q';
  const wind = o.wind ?? Math.sin(T * 2) * .12, wv = wind * u;
  push(); translate(x, y + (o.dy || 0) * u); if (o.rot) rotate(o.rot); scale(o.flip ? -1 : 1, 1);
  let P;
  if (side) P = [[.2 * u, -8.9 * u], [-1.6 * u, -8.4 * u], [-4.7 * u - 2 * wv, -1.1 * u], [-4.3 * u - 2.4 * wv, .05 * u], [-1.2 * u - wv, .05 * u], [0, -7.2 * u]];   // behind the upright (two-legged) profile
  else { const o2 = q ? .5 * u : 0; P = [[-4.2 * u + o2, -8.0 * u], [4.2 * u + o2, -8.0 * u], [6.6 * u + o2 + wv, -1.2 * u], [6.1 * u + o2 + wv, .05 * u], [-6.1 * u + o2 + wv, .05 * u], [-6.6 * u + o2 + wv, -1.2 * u]]; }
  paint(P, { wash: C.sock[2], ink: null, curv: .25 });
  clipPoly(P, () => {
    bands(-8 * u, 8 * u, -8.1 * u, -1.2 * u, 8, [C.sock[0], C.sock[2], C.sock[1], C.sock[2]]);
    paint(rectPts(-8 * u, -1.2 * u, 16 * u, 2 * u), { wash: C.sock[0], ink: null });   // the toe end
  });
  paint(P, { ink: PAL.ink, sw, curv: .25 });
  pop();
}
// Excalifork: Pumpkin's right-paw hook. lit 0..1: a magic glow and sparkles at the tines.
function excalifork(lit = 0) {
  return (u, sw) => {
    paint(rrPts(.05 * u, -.17 * u, 2.4 * u, .34 * u, .15 * u), { wash: '#F6F1E6', ink: PAL.ink, sw: sw * .7 });                     // handle
    paint([[2.35 * u, -.32 * u], [2.95 * u, -.5 * u], [2.95 * u, .5 * u], [2.35 * u, .32 * u]], { wash: '#F6F1E6', ink: PAL.ink, sw: sw * .7 });
    for (let k = -1.5; k <= 1.5; k++) paint(rrPts(2.9 * u, k * .3 * u - .07 * u, 1.3 * u, .14 * u, .06 * u), { wash: '#F6F1E6', ink: PAL.ink, sw: sw * .5 });   // 4 tines
    if (lit > 0) { glow(3.8 * u, 0, 1.6 * u, '#FFE27A', .7 * lit); for (let i = 0; i < 4; i++) { const a = T * 6 + i * TAU / 4; paint(starPts(3.9 * u + Math.cos(a) * .9 * u, Math.sin(a) * .9 * u, .25 * u * lit, .4, 4), { wash: '#FFF2C4', ink: null }); } }
  };
}
function pipPack(x, y, u, o = {}) {
  const sw = clamp(u / 17, .45, 2.6), view = o.view || 'front', side = view === 'side';
  push(); translate(x, y + (o.dy || 0) * u); if (o.rot) rotate(o.rot); scale(o.flip ? -1 : 1, 1);
  const px = side ? -1.9 * u : (view === 'q' ? -1.4 * u : 1.45 * u);
  paint(rrPts(px - .8 * u, -3.3 * u, 1.6 * u, 1.9 * u, .45 * u), { wash: '#E6B65F', ink: PAL.ink, sw: sw * .8, shade: true, shadeK: .45 });
  for (const [a, b] of [[-.35, -2.8], [.3, -2.8], [-.35, -2.1], [.3, -2.1]]) paint(ellPts(px + a * u, b * u, .09 * u, .09 * u, 6), { wash: '#B8813A', ink: null });
  paint(rrPts(px - .6 * u, -3.5 * u, 1.2 * u, .45 * u, .2 * u), { wash: '#C8363F', ink: PAL.ink, sw: sw * .6 });   // the flap
  pop();
}
