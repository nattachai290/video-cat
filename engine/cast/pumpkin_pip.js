// pumpkin_pip.js: the "Pumpkin & Pip" cast, shared by every story in the series. Needs core.js (and clawd.js for emote()).
//
//   pumpkin(x, y, u, o)   a round orange tabby in a red vest that is one size too small. ~12.5u tall, ~9u wide.
//   pip(x, y, u, o)       a tiny grey mouse with big ears and a long green scarf. ~6.6u tall (about half of Pumpkin).
//   (x, y) is the ground point between the feet; u is the size unit. Use the SAME u for both so they stay in scale.
//   Shot sizes (Shorts, 1080 wide): Pumpkin medium u ≈ 38–48, close-up u ≈ 70–110; Pip medium u ≈ 38–48.
//
// Options (all optional; spread several objects together, later ones win):
//   pose    view: 'front' | 'q' (3/4) | 'side'; flip (face left); dx, dy (in u, -dy = up); sq (squash, < 0 stretches); noTail;
//           rot (pivots at the feet); aL, aR (arm angle: 0 straight out, + up, - down; default -1.1 hangs);
//           walk (leg phase, side view); tailWag 0..1; noShadow
//   face    eyes: open | wide | half | closed | happy | squeeze | spiral | dot  (or [left, right]);
//           lid / low 0..1 (upper / lower lid cover); pupil 0..1 (0 = slit/pinpoint, 1 = big round);
//           brow (-1 worried .. +1 angry), browUp (raise both), browL / browR (raise one side);
//           mouth: w | smile | grin | frown | flat | smirk | O | gritted | wobble; talk 0..1 (mouth open);
//           lookX, lookY (-1..1); blush 0..1; seed (blink timing)
//   who     'pumpkin' / 'pip': if src/dialog.js is loaded, the mouth opens with that character's voice (SPEAK)
//   states  Pumpkin: belly 0..1 (full of pie), wet 0..1 (soaked, thin, fur flat), puff 0..1 (fur dried into a ball)
//           Pip: scarfWind -1..1 (blows the scarf end), cracker (true: holds a cracker in the right paw)
//   hooks   armL(u, sw), armR(u, sw): drawn at the paw, in arm space (+x along the arm); draw(u, sw): body space
//   boil    boilKey: a stable id for this character's boil seeds (set it if characters come and go mid-shot)
//
// Expressions: face(name) returns the face fields of a preset (CAST_FACES); faces(t, keys) acts a change of face over
// time (a blink on the swap, numbers ease with a little overshoot):
//   pumpkin(x, y, u, { ...faces(lt, [[0, 'embarrassed'], [2.1, 'annoyed']]), who: 'pumpkin', view: 'q' })

const PUMPKIN_COL = { col: '#F0973A', dk: '#C0652A', lt: '#FBE7C8', stripe: '#B4572A', vest: '#C8363F', vestDk: '#8A222B',
                      button: '#EEC35A', nose: '#E8838C', iris: '#B7CC48', inner: '#F0A7B6' };
const PIP_COL = { col: '#A3A0B0', dk: '#757083', lt: '#DFDAE5', inner: '#F0A7B6', nose: '#E8838C', tail: '#EDA7B5',
                  scarf: '#4FA060', scarfDk: '#2F6E3E', cracker: '#E6B65F', crackerDk: '#B8813A' };

const CAST_FACES = {
  neutral:     { eyes: 'open', lid: .1, low: 0, pupil: .7, brow: 0, browUp: 0, mouth: 'w', blush: 0 },
  happy:       { eyes: 'happy', brow: -.1, browUp: .3, mouth: 'smile', blush: .3 },
  smug:        { eyes: 'open', lid: .45, low: .2, pupil: .35, brow: .2, browR: .5, mouth: 'smirk' },
  embarrassed: { eyes: 'open', lid: .25, low: .15, pupil: .5, brow: -.5, mouth: 'gritted', blush: .9, lookX: -.6 },
  annoyed:     { eyes: 'open', lid: .5, low: .1, pupil: .5, brow: .5, mouth: 'flat' },
  deadpan:     { eyes: 'open', lid: .55, low: .05, pupil: .6, brow: 0, mouth: 'flat' },
  sheepish:    { eyes: 'open', lid: .2, pupil: .9, brow: -.6, browUp: .2, mouth: 'wobble', blush: .5, lookY: .6 },
  proud:       { eyes: 'closed', brow: -.2, browUp: .5, mouth: 'smile' },
  surprised:   { eyes: 'wide', lid: 0, pupil: .2, brow: -.1, browUp: 1, mouth: 'O' },
  panic:       { eyes: 'wide', lid: 0, pupil: .05, brow: -.8, browUp: .8, mouth: 'wobble' },
  determined:  { eyes: 'open', lid: .3, low: .15, pupil: .6, brow: .7, mouth: 'flat' },
  teasing:     { eyes: ['open', 'half'], lid: .15, pupil: .8, brow: 0, browL: .6, mouth: 'smirk' },
  innocent:    { eyes: 'open', lid: 0, pupil: 1, brow: -.3, browUp: .6, mouth: 'w', lookY: -.4 },
  munching:    { eyes: 'half', lid: .35, pupil: .8, brow: -.1, mouth: 'w' },
  dazed:       { eyes: 'spiral', brow: -.3, mouth: 'wobble' },
  greedy:      { eyes: 'open', lid: 0, pupil: 1, brow: -.2, browUp: .7, mouth: 'grin', lookY: .5 },
  strain:      { eyes: 'squeeze', brow: .6, mouth: 'gritted', blush: .4 },
  soggy:       { eyes: 'open', lid: .45, low: .1, pupil: .5, brow: -.35, mouth: 'flat' },
};
function face(name, over = {}) { return { ...CAST_FACES.neutral, ...(CAST_FACES[name] || {}), ...over }; }

// Acted face changes: keys = [[t0, 'neutral'], [t1, 'surprised', { lookX: .5 }], ...]. Numbers ease into the new face
// over .22 s with a little overshoot; the eyes blink across the swap so shapes never pop.
function faces(t, keys) {
  let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
  const [tc, name, over] = keys[i], cur = face(name, over);
  if (i === 0) return cur;
  const prev = face(keys[i - 1][1], keys[i - 1][2]), age = t - tc, k = backOut(seg(age, 0, .22));
  for (const f of ['lid', 'low', 'pupil', 'brow', 'browUp', 'browL', 'browR', 'blush', 'lookX', 'lookY'])
    cur[f] = lerp(prev[f] || 0, cur[f] || 0, k);
  if (age < .09) cur.eyes = 'closed';
  return cur;
}

// ---------- shared pieces ----------
const _P = (u, pts) => pts.map(([a, b]) => [a * u, b * u]);

// Points of an ellipse arc (cx, cy, rx, ry) from angle a0 to a1 (radians, y down), n steps.
function arcPts(cx, cy, rx, ry, a0, a1, n = 10) {
  const p = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return p;
}

// One eye, centred at (0, 0), radii rx, ry (px). Style 'cat' (sclera + iris + pupil) or 'bead' (a glossy black bead).
function castEye(kind, s, rx, ry, o, sw, skin, iris, style) {
  const lx = clamp(o.lookX || 0, -1, 1), ly = clamp(o.lookY || 0, -1, 1);
  const line = (pts, w = 1.2, c = .3) => inkLine(pts.map(([a, b]) => [a * rx, b * ry]), sw * w, PAL.ink, 'ink', c);
  const blink = (kind === 'open' || kind === 'wide') && ((T * .85 + (o.seed || 0) * 1.37 + (s > 0 ? .02 : 0)) % 3.7) < .11;
  if (blink || kind === 'closed') { line([[-1, -.05], [-.4, .35], [.4, .35], [1, -.05]], 1.2, .5); return; }
  if (kind === 'happy') { line([[-1, .3], [-.45, -.4], [.45, -.4], [1, .3]], 1.3, .5); return; }
  if (kind === 'squeeze') { line([[-.9 * -s, -.6], [.7 * -s, 0], [-.9 * -s, .6]], 1.3, 0); return; }
  if (kind === 'spiral') {
    const sp = []; for (let k = 0; k < 18; k++) { const a = k * .75 + T * 7 * s, r = k / 17; sp.push([Math.cos(a) * r * rx * .9, Math.sin(a) * r * ry * .9]); }
    paint(ellPts(0, 0, rx, ry, 18), { wash: PAL.cream, ink: PAL.ink, sw: sw * .7 }); inkLine(sp, sw * .6, PAL.ink, 'inkfine', .6); return;
  }
  const wide = kind === 'wide' ? 1.15 : 1, RX = rx * wide, RY = ry * wide;
  let lid = clamp(kind === 'half' ? Math.max(o.lid || 0, .5) : (o.lid || 0)), low = clamp(o.low || 0);
  if (o.squint) lid = Math.max(lid, o.squint * .9);
  if (style === 'cat') {
    paint(ellPts(0, 0, RX, RY, 20), { wash: '#FBF4E4', ink: null });
    const ir = Math.min(RX, RY) * .74, ix = lx * RX * .32, iy = ly * RY * .3;
    paint(ellPts(ix, iy, ir, ir * 1.05, 16), { wash: iris, ink: PAL.ink, sw: sw * .45 });
    const pk = clamp(o.pupil ?? .7), pw = ir * lerp(.16, .62, pk), ph = ir * lerp(.92, .66, pk);
    paint(ellPts(ix, iy, pw, ph, 12), { wash: PAL.ink, ink: null });
    paint(ellPts(ix - ir * .32, iy - ir * .38, ir * .22, ir * .26, 8), { wash: PAL.cream, ink: null });
  } else {
    const ix = lx * RX * .18, iy = ly * RY * .18, pk = clamp(o.pupil ?? .7), k = kind === 'wide' ? 1 : lerp(.8, 1, pk);
    paint(ellPts(ix, iy, RX * k, RY * k, 16), { wash: PAL.ink, ink: null });
    paint(ellPts(ix - RX * .3, iy - RY * .35, RX * .3, RY * .28, 8), { wash: PAL.cream, ink: null });
    paint(ellPts(ix + RX * .25, iy + RY * .3, RX * .12, RY * .12, 6), { wash: PAL.cream, washOp: 200, ink: null });
  }
  // lids: skin-coloured covers from the top (lid) and the bottom (low), each with its own ink line
  if (lid > .02) {
    const yl = -RY + 2 * RY * Math.min(lid, .98), a1 = Math.PI - Math.asin(yl / RY), a2 = TAU + Math.asin(yl / RY);
    const top = arcPts(0, 0, RX * 1.06, RY * 1.06, a1, a2, 12);
    paint(top, { wash: skin, ink: null });
    inkLine([[-RX * Math.cos(Math.asin(yl / RY)), yl], [0, yl + RY * .05], [RX * Math.cos(Math.asin(yl / RY)), yl]], sw * 1.1, PAL.ink, 'ink', .5);
  }
  if (low > .02) {
    const yb = RY - 2 * RY * Math.min(low, .9), b0 = Math.asin(yb / RY), b1 = Math.PI - b0;
    paint(arcPts(0, 0, RX * 1.06, RY * 1.06, b0, b1, 10), { wash: skin, ink: null });
    inkLine([[RX * Math.cos(b0), yb], [0, yb - RY * .05], [-RX * Math.cos(b0), yb]], sw * .7, PAL.ink, 'inkfine', .5);
  }
  if (style === 'cat' || lid > .02) paint(ellPts(0, 0, RX, RY, 20), { ink: PAL.ink, sw: sw * .9 });
}

// Brows over an eye at (ex, ey), h above its centre: brow -1 worried (inner end up) .. +1 angry (inner end down);
// up raises the brow (1 = by 45% of h). s = -1 left, 1 right.
function castBrow(ex, ey, len, h, s, b, up, sw) {
  const base = ey - h - up * h * .45, inner = base + b * h * .32, outer = base - b * h * .12;
  inkLine([[ex - s * len * .55, inner], [ex, (inner + outer) / 2 - h * .12], [ex + s * len * .55, outer]], sw * 1.15, PAL.ink, 'ink', .5);
}

// The mouth under a nose at (0, 0) (px), width w. Talk opens it.
function castMouth(m, talk, w, sw, dark = '#4A1F2A', tongue = PAL.rose) {
  const L = (pts, k = .9, c = .5) => inkLine(pts.map(([a, b]) => [a * w, b * w]), sw * k, PAL.ink, 'ink', c);
  const t = clamp(talk || 0);
  if (m === 'gritted') {
    const hh = .28 + .12 * t;
    paint(rrPts(-.75 * w, .25 * w, 1.5 * w, hh * w, .1 * w), { wash: PAL.cream, ink: PAL.ink, sw: sw * .7 });
    L([[-.72, .25 + hh / 2], [.72, .25 + hh / 2]], .45, 0);
    for (const x of [-.36, 0, .36]) L([[x, .27], [x, .23 + hh]], .4, 0);
    return;
  }
  if (t > .06 || m === 'O' || m === 'grin') {
    const rw = m === 'O' ? .32 + .1 * t : m === 'grin' ? .75 : .38 + .14 * t, rh = m === 'O' ? .38 + .2 * t : m === 'grin' ? .4 + .2 * t : .1 + .48 * t;
    const sad = m === 'frown' || m === 'wobble';
    const pts = m === 'grin' ? [[-rw, .25], [rw, .25], [rw * .7, .25 + rh], [0, .3 + rh * 1.15], [-rw * .7, .25 + rh]] : ellPts(0, .3 + rh * .8, rw, rh, 16).map(([a, b]) => [a, b + (sad ? -.04 : 0)]);
    paint(pts.map(([a, b]) => [a * w, b * w]), { wash: dark, ink: PAL.ink, sw: sw * .65, curv: .3 });
    if (rh > .2) paint(ellPts(0, (.3 + rh * 1.35) * w, rw * .55 * w, rh * .3 * w, 10), { wash: tongue, ink: null });
  }
  switch (m) {
    case 'w': L([[0, 0], [0, .22]], .7, 0); L([[-.7, .22], [-.35, .44], [0, .22], [.35, .44], [.7, .22]], .85); break;
    case 'smile': L([[0, 0], [0, .2]], .7, 0); L([[-.85, .05], [-.4, .42], [0, .22], [.4, .42], [.85, .05]], .9); break;
    case 'grin': L([[0, 0], [0, .2]], .7, 0); break;
    case 'frown': L([[0, 0], [0, .25]], .7, 0); L([[-.65, .55], [-.3, .3], [0, .27], [.3, .3], [.65, .55]], .85); break;
    case 'flat': L([[0, 0], [0, .25]], .7, 0); L([[-.6, .3], [0, .27], [.6, .3]], .85, 0); break;
    case 'smirk': L([[0, 0], [0, .22]], .7, 0); L([[-.6, .33], [0, .25], [.45, .2], [.8, -.02]], .9); break;
    case 'O': L([[0, 0], [0, .18]], .7, 0); break;
    case 'wobble': L([[0, 0], [0, .22]], .7, 0); L([[-.7, .35], [-.35, .25], [0, .37], [.35, .25], [.7, .35]], .8, .3); break;
  }
}

function castWhiskers(mx, my, s, len, sw, droop = 0, col = PAL.ink) {
  for (let k = 0; k < 3; k++) {
    const y0 = my + (k - 1) * len * .09, ang = (k - 1) * .2 + droop * .5 + .04 * Math.sin(T * 2.3 + k + s);
    inkLine([[mx, y0], [mx + s * len * .55, y0 + Math.sin(ang) * len * .3 - len * .03], [mx + s * len, y0 + Math.sin(ang) * len * .55]], sw * .45, col, 'inkfine', .6);
  }
}

// Side-view whiskers: a short fan from the muzzle (up, level, down) instead of three long lines pointing ahead.
function castWhiskersSide(mx, my, len, sw, droop = 0, col = PAL.ink) {
  [[-.55, .8], [-.12, 1], [.32, .85]].forEach(([a, l], k) => {
    const ang = a + droop * .6 + .05 * Math.sin(T * 2.3 + k), L = len * l;
    inkLine([[mx, my], [mx + Math.cos(ang) * L * .5, my + Math.sin(ang) * L * .5 + L * .04], [mx + Math.cos(ang + .12) * L, my + Math.sin(ang + .12) * L + L * .1]], sw * .45, col, 'inkfine', .6);
  });
}

// A short paw arm from a shoulder: angle a (0 out, + up), dir -1 left / 1 right, length len (px), width w (px).
// A bean arm: narrow at the shoulder (sx, sy), round and heavy at the paw. Angle a (0 out, + up, - down), dir -1 left /
// 1 right, length len (shoulder to paw centre, px), w = paw width (px). Two toe lines on the paw. The hook draws at the paw.
function castArm(sx, sy, a, dir, len, w, col, sw, hook, u) {
  const ux = dir * Math.cos(a), uy = -Math.sin(a), nx = -uy, ny = ux, ex = sx + ux * len, ey = sy + uy * len;
  const r0 = w * .27, r1 = w * .7, bulge = len * .1;
  const bean = through([[sx + nx * r0, sy + ny * r0], [sx + ux * len * .55 + nx * (r1 * .8 + bulge * .3), sy + uy * len * .55 + ny * (r1 * .8 + bulge * .3)],
    [ex + nx * r1, ey + ny * r1], [ex + ux * r1 * 1.05, ey + uy * r1 * 1.05], [ex - nx * r1, ey - ny * r1],
    [sx + ux * len * .55 - nx * r1 * .75, sy + uy * len * .55 - ny * r1 * .75], [sx - nx * r0, sy - ny * r0]], 5);
  paint(bean, { wash: col, ink: PAL.ink, sw: sw * .85, shade: true, shadeK: .7 });
  for (const d of [-.32, .32]) {
    const ca = Math.cos(d), sa = Math.sin(d), dx = ux * ca - uy * sa, dy = ux * sa + uy * ca;
    inkLine([[ex + dx * r1 * .4, ey + dy * r1 * .4], [ex + dx * r1 * .95, ey + dy * r1 * .95]], sw * .6, mixCol(col, '#2A1A30', .45), 'inkfine', 0);
  }
  if (hook) { push(); translate(ex, ey); rotate(dir < 0 ? Math.PI + a : -a); if (dir < 0) scale(1, -1); hook(u, sw); pop(); }
}

function castShadow(x, y, rx, u, dyU) {
  const f = 1 - Math.min(.55, Math.abs(dyU || 0) * .05);
  paint(ellPts(x, y + u * .1, rx * f, u * .65 * f, 22), { fill: PAL.ink, fillOp: 85, bleed: .25, tex: .3, border: .1, ink: null });
}

// ---------- Pumpkin ----------
function pumpkin(x, y, u, o = {}) {
  const id = o.boilKey ?? ('pk' + (++CLAWD_N)), rs = part => boilSeed(`pumpkin ${id} ${part}`);
  const C = PUMPKIN_COL, view = o.view || 'front', q = view === 'q' ? 1 : 0, side = view === 'side';
  const sw = clamp(u / 15, .5, 3) * (o.swMul || 1);
  const wet = clamp(o.wet || 0), puff = clamp(o.puff || 0), belly = clamp(o.belly || 0);
  const fat = 1 + belly * .32 - wet * .3 + puff * .22;
  const col = mixCol(C.col, '#8E6A55', wet * .45), dk = mixCol(C.dk, '#6E4A3A', wet * .4), lt = mixCol(C.lt, '#D8C6B0', wet * .3);
  const talk = o.talk ?? (o.who && typeof SPEAK === 'function' ? SPEAK(o.who, T) : 0);
  const sq = o.sq || 0, dy = (o.dy || 0) * u;
  x += (o.dx || 0) * u;

  rs('shadow'); if (!o.noShadow) castShadow(x, y, u * (side ? 5 : 4.6) * fat, u, o.dy);
  push(); translate(x, y + dy); if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  // fur outline: smooth, wet (spiky drips), or puffed (a ragged ball)
  const furry = (pts, cx, cy, amt, spikes = 26) => amt < .02 ? pts : pts.map(([px, py], i) => {
    const dx = px - cx, dy2 = py - cy, k = 1 + amt * (i % 2 ? .1 : -.04) * (1 + .5 * hash(i * 7.3)); return [cx + dx * k, cy + dy2 * k];
  });

  if (side) { pumpkinSide(u, o, sw, { col, dk, lt, C, fat, wet, puff, belly, talk, rs, furry }); pop(); rs('after'); return; }

  const tw = (o.tailWag ?? .4), ts = Math.sin(T * (1.4 + tw * 3)) * (.25 + tw * .5);
  // tail (behind): one ribbon curling up on the far side
  rs('tail');
  if (!o.noTail) {
    const P = [[2.4, -2.2], [4.3 + ts * .3, -2.6], [5.4 + ts * .6, -4.2], [5.1 + ts, -6.0 - wet * -1.5], [4.2 + ts * 1.4, -6.8 + wet * 2.2]];
    const Pt = P.map(([a, b]) => [(a + q * .8) * u * fat * .95, b * u]);
    paint(ribbon(Pt, u * (1.25 + puff * .9 - wet * .45), u * (.7 + puff * .7 - wet * .3)), { wash: col, ink: PAL.ink, sw: sw * .85 });
    for (let k = 1; k < 4; k++) { const a = Pt[k], b = Pt[k + 1] || Pt[k]; const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; inkLine([[mx - u * .45, my - u * .1], [mx + u * .35, my + u * .2]], sw * .7, C.stripe, 'ink', .3); }
  }
  // feet
  rs('feet');
  for (const s of [-1, 1]) paint(ellPts((s * 1.9 + q * .5) * u * Math.min(fat, 1.15), -.45 * u, 1.2 * u, .6 * u, 14, u * .03), { wash: col, fill: lt, fillOp: 80, tex: .5, ink: PAL.ink, sw: sw * .8 });
  // far arm (3/4 view hides most of it behind the body)
  rs('armFar');
  const shY = -6.4 * u, shX = 3.15 * u * fat;
  if (q) castArm(-shX + q * .9 * u, shY, o.aL ?? -1.14, -1, 3.0 * u, 1.4 * u, mixCol(col, dk, .35), sw, o.armL, u);
  // body
  rs('body');
  const bcx = q * .4 * u, bcy = -3.9 * u, brx = 4.3 * u * fat, bry = 3.7 * u * (1 - belly * .02);
  const body = furry(ellPts(bcx, bcy, brx, bry, 28, u * .04), bcx, bcy, puff * 1.2 + wet * .3);
  paint(body, { wash: col, ink: null, shade: true });
  paint(ellPts(bcx + q * .5 * u, -3.1 * u, 2.6 * u * fat, 2.55 * u, 20), { wash: lt, washOp: 235, ink: null });           // belly
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) {   // side stripes
    const sx = bcx + s * (brx - u * (.25 + k * .05)), sy = -5.2 * u + k * 1.1 * u;
    inkLine([[sx, sy], [sx - s * u * .8, sy + u * .25], [sx - s * u * 1.3, sy + u * .15]], sw * 1.2, C.stripe, 'ink', .5);
  }
  paint(body, { ink: PAL.ink, sw });
  // vest: two panels one size too small, so the belly shows between them
  rs('vest');
  const vf = fat * (1 - puff * .12), gap = .55 + belly * .9 + puff * .6;
  for (const s of [-1, 1]) {
    const off = q * .5 * (s > 0 ? 1.15 : .8);
    const pts = [[s * gap * .5 + off, -7.25], [s * 3.4 * vf + off, -6.7], [s * 4.0 * vf + off, -4.9], [s * 2.9 * vf + off, -3.75], [s * gap * 1.35 + off, -4.15]];
    paint(_P(u, pts), { wash: C.vest, ink: PAL.ink, sw: sw * .85, curv: .25, shade: true, shadeK: .6 });
    paint(_P(u, [[s * gap * .6 + off, -7.1], [s * 2.6 * vf + off, -6.7], [s * 2.2 * vf + off, -6.2], [s * gap * .9 + off, -6.5]]), { fill: '#E2646B', fillOp: 90, bleed: .1, tex: .5, ink: null });
    if (s < 0) for (const by of [-6.3, -5.0]) paint(ellPts((s * (gap * .55 + .5) + off) * u, by * u, .28 * u, .28 * u, 10), { wash: C.button, ink: PAL.ink, sw: sw * .5 });
  }
  // near arm(s)
  rs('arms');
  if (!q) castArm(-shX, shY, o.aL ?? -1.14, -1, 3.0 * u, 1.4 * u, col, sw, o.armL, u);
  castArm(shX + q * .5 * u, shY, o.aR ?? -1.14, 1, 3.0 * u, 1.4 * u, col, sw, o.armR, u);
  // head
  rs('head');
  push(); translate(q * .55 * u, -8.5 * u + puff * -.4 * u);
  const hx = 3.35 * u * (1 + puff * .18 - wet * .1), hy = 2.85 * u * (1 + puff * .12 - wet * .05), fx = q * 1.0 * u;
  for (const s of [-1, 1]) {   // ears (the head covers their bases)
    const far = q && s < 0, ex = s * 1.95 * u + fx * .5 - (far ? .35 * u : 0), droop = wet * .9;
    const tip = [ex + s * .65 * u + s * droop * u * 1.2, -3.85 * u + droop * 1.6 * u];
    paint([[ex - 1.1 * u, -1.6 * u], tip, [ex + 1.1 * u, -1.7 * u]], { wash: far ? mixCol(col, dk, .3) : col, ink: PAL.ink, sw: sw * .85 });
    paint([[ex - .55 * u, -1.9 * u], [lerp(ex, tip[0], .85), lerp(-1.9 * u, tip[1], .8)], [ex + .55 * u, -1.95 * u]], { wash: C.inner, ink: null });
  }
  const head = furry(ellPts(0, 0, hx, hy, 26, u * .04).map(([a, b], i) => {
    const ang = Math.atan2(b / hy, a / hx), cheek = Math.abs(Math.sin(ang)) < .45 && b > -hy * .1 ? .18 * u : 0;   // cheek tufts
    return [a + Math.sign(a) * cheek * (i % 2 ? 1 : .4), b];
  }), 0, 0, puff * 1.1 + wet * .25);
  paint(head, { wash: col, ink: null, shade: true, shadeK: .8 });
  for (const k of [-1, 0, 1]) inkLine([[fx * .4 + k * .45 * u, -2.75 * u], [fx * .4 + k * .5 * u, -2.05 * u]], sw * 1.15, C.stripe, 'ink', 0);   // the M
  for (const s of [-1, 1]) inkLine([[s * hx * .97, -.5 * u], [s * (hx - .9 * u), -.35 * u]], sw * 1.05, C.stripe, 'ink', .3);
  paint(head, { ink: PAL.ink, sw });
  // face
  rs('face');
  pumpkinFace(u, o, sw, fx, q, { col, lt, C, talk, wet });
  pop();
  rs('draw'); if (o.draw) o.draw(u, sw);
  pop();
  rs('emote'); if (o.emote && typeof emote === 'function') emote(o.emote, x + (o.flip ? -1 : 1) * 3.8 * u, y + dy - 12.6 * u, u * .9, o.emoteK ?? 1, o.emoteAge ?? T);
  rs('after');
}

function pumpkinFace(u, o, sw, fx, q, k) {
  const C = k.C, kinds = Array.isArray(o.eyes) ? o.eyes : [o.eyes || 'open', o.eyes || 'open'];
  // muzzle
  paint(ellPts(fx - .62 * u, .95 * u, .78 * u, .55 * u, 14), { wash: k.lt, ink: null });
  paint(ellPts(fx + .62 * u, .95 * u, .78 * u, .55 * u, 14), { wash: k.lt, ink: null });
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(fx + s * 2.05 * u * (s < 0 ? 1 - q * .2 : 1), .55 * u, .75 * u, .4 * u, 14), { wash: '#E8607A', washOp: 150 * clamp(o.blush), ink: null });
  for (const s of [-1, 1]) {
    const far = q && s < 0, ex = fx + s * 1.35 * u * (far ? .82 : 1), ey = -.35 * u, rx = .78 * u * (far ? .82 : 1), ry = .88 * u;
    push(); translate(ex, ey); castEye(kinds[s < 0 ? 0 : 1], s, rx, ry, o, sw, k.col, C.iris, 'cat'); pop();
    castBrow(ex, ey, 1.25 * u * (far ? .8 : 1), 1.25 * u, s, o.brow || 0, (o.browUp || 0) + (s < 0 ? o.browL || 0 : o.browR || 0), sw);
  }
  // nose and mouth
  paint([[fx - .32 * u, .42 * u], [fx + .32 * u, .42 * u], [fx, .72 * u]], { wash: C.nose, ink: PAL.ink, sw: sw * .55 });
  push(); translate(fx, .72 * u); castMouth(o.mouth || 'w', k.talk, 1.15 * u, sw); pop();
  for (const s of [-1, 1]) castWhiskers(fx + s * 1.05 * u, .95 * u, s, 3.0 * u * (q && s < 0 ? .7 : 1), sw, k.wet * .8 + (o.mouth === 'frown' ? .3 : 0));
}

// Pumpkin in profile, facing right: a long round body, the head at the front, four stubby legs (walk), the tail behind.
function pumpkinSide(u, o, sw, k) {
  // Side view drawn like a real cat in profile (long body, four walking legs, tail curled up from the rump, head with a
  // muzzle at the front), kept chubby and flat. Faces +x; ground at y = 0.
  const { col, dk, lt, C, fat, wet, puff, talk, rs, furry } = k;
  const walk = o.walk, farCol = mixCol(col, dk, .45);
  const bodyY = -4.6 * u, brx = 4.4 * u * fat, bry = 2.45 * u * (1 + k.belly * .25);
  const hip = [-2.6 * u * fat, -4.4 * u], sho = [2.4 * u * fat, -4.6 * u];
  const raise = o.aR != null && o.aR > -.9 ? clamp((o.aR + .9) / 2.2) : 0;   // near front paw lifted (a swipe / a reach)
  // a leg: a tapered column from a joint to a round paw; swing = angle (+ = forward)
  const leg = (j, len, swing, w0, w1, c, hook) => {
    const ex = j[0] + Math.sin(swing) * len, ey = j[1] + Math.cos(swing) * len;
    paint(ribbon([[j[0], j[1]], [lerp(j[0], ex, .55) - Math.sin(swing) * .1 * u, lerp(j[1], ey, .55)], [ex, ey - .25 * u]], w0, w1), { wash: c, ink: PAL.ink, sw: sw * .8 });
    paint(ellPts(ex + .25 * u, ey - .3 * u, .62 * u, .38 * u, 12), { wash: c, ink: PAL.ink, sw: sw * .8 });
    if (hook) { push(); translate(ex + .25 * u, ey - .3 * u); rotate(-Math.PI / 2 + swing); hook(u, sw); pop(); }
  };
  const ph = i => walk == null ? 0 : Math.sin((walk + [0, .5, .5, 0][i]) * TAU) * .55;
  const L = -bodyY - .2 * u;
  // tail: up from the rump in an S, tip curling forward
  rs('tail');
  const ts = Math.sin(T * (1.4 + (o.tailWag ?? .4) * 3)) * (.25 + (o.tailWag ?? .4) * .4);
  if (!o.noTail) {
    const P = [[-4.0 * fat, -5.6], [-5.3 * fat, -6.6 + ts * .2], [-5.7 * fat + ts * .5, -8.6 + wet * 2.5], [-5.0 * fat + ts, -10.0 + wet * 3.5], [-4.2 * fat + ts * 1.3, -10.2 + wet * 3.6]].map(([a, b2]) => [a * u, b2 * u]);
    paint(ribbon(P, u * (1.1 + puff * .8 - wet * .4), u * (.65 + puff * .6 - wet * .3)), { wash: col, ink: PAL.ink, sw: sw * .85 });
    for (let i = 1; i < 4; i++) { const m = [(P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2]; inkLine([[m[0] - .4 * u, m[1] - .1 * u], [m[0] + .35 * u, m[1] + .15 * u]], sw * .7, C.stripe, 'ink', .3); }
  }
  // far legs (darker), then the body, then the near legs
  rs('legsFar');
  leg([hip[0] + .5 * u, hip[1]], L, ph(1), 1.15 * u, .8 * u, farCol);
  leg([sho[0] - .4 * u, sho[1]], L - .2 * u, ph(2), 1.0 * u, .75 * u, farCol);
  rs('body');
  const body = furry(ellPts(0, bodyY, brx, bry, 30, u * .04), 0, bodyY, puff * 1.2 + wet * .3);
  paint(body, { wash: col, ink: null, shade: true });
  paint(ellPts(.3 * u, bodyY + 1.3 * u, brx * .8, bry * .48, 20), { wash: lt, washOp: 230, ink: null });   // belly
  for (let i = 0; i < 5; i++) { const sx = (-3.0 + i * 1.25) * u * fat; inkLine([[sx, bodyY - bry * .95], [sx + .3 * u, bodyY - bry * .5], [sx + .1 * u, bodyY - bry * .15]], sw * 1.2, C.stripe, 'ink', .5); }
  paint(body, { ink: PAL.ink, sw });
  rs('vest');   // the too-small vest: a band round the chest
  paint(_P(u, [[.6 * fat, -7.0], [3.3 * fat, -6.8], [4.1 * fat, -5.0], [3.4 * fat, -3.2], [1.2 * fat, -3.0], [.2 * fat, -4.6]]), { wash: C.vest, ink: PAL.ink, sw: sw * .85, curv: .3, shade: true, shadeK: .6 });
  paint(ellPts(3.5 * u * fat, -4.4 * u, .26 * u, .26 * u, 10), { wash: C.button, ink: PAL.ink, sw: sw * .5 });
  rs('legsNear');
  leg([hip[0], hip[1] + .3 * u], L - .3 * u, ph(0), 1.35 * u, .85 * u, col);
  leg(sho, L, raise ? -2.2 * raise + ph(3) * (1 - raise) : ph(3), 1.15 * u, .8 * u, col, o.armR);
  // head: in front of and above the shoulders, with a muzzle
  rs('head');
  push(); translate(4.7 * u * fat, -7.7 * u);
  const hx = 2.35 * u * (1 + puff * .15 - wet * .08), hy = 2.15 * u * (1 + puff * .12 - wet * .05);
  for (const [ex, far] of [[-.9, 1], [.4, 0]]) {   // ears
    const droop = wet * .9, tip = [(ex + .2 + droop) * u, (-3.4 + droop * 1.6) * u];
    paint([[(ex - .85) * u, -1.2 * u], tip, [(ex + .95) * u, -1.5 * u]], { wash: far ? mixCol(col, dk, .35) : col, ink: PAL.ink, sw: sw * .85 });
    if (!far) paint([[(ex - .4) * u, -1.5 * u], [lerp((ex + .2) * u, tip[0], .85), lerp(-1.5 * u, tip[1], .8)], [(ex + .5) * u, -1.65 * u]], { wash: C.inner, ink: null });
  }
  const head = furry(ellPts(0, 0, hx, hy, 24, u * .04), 0, 0, puff + wet * .2);
  const MZ = [1.95 * u, .6 * u, 1.0 * u, .8 * u];
  paint(ellPts(...MZ, 18), { wash: col, ink: PAL.ink, sw });
  paint(head, { wash: col, ink: null, shade: true, shadeK: .8 });
  for (const kx of [-.9, -.4, .1]) inkLine([[kx * u, -2.05 * u], [(kx + .15) * u, -1.45 * u]], sw * 1.1, C.stripe, 'ink', 0);
  inkLine([[-hx * .95, .1 * u], [-hx * .6, .35 * u]], sw, C.stripe, 'ink', .3);
  paint(head, { ink: PAL.ink, sw });
  paint(ellPts(MZ[0], MZ[1], MZ[2] - sw * .9, MZ[3] - sw * .9, 18), { wash: col, ink: null });
  paint(ellPts(2.1 * u, .85 * u, .85 * u, .5 * u, 14), { wash: lt, ink: null });
  rs('face');
  const kinds = Array.isArray(o.eyes) ? o.eyes : [o.eyes || 'open', o.eyes || 'open'];
  push(); translate(.9 * u, -.35 * u); castEye(kinds[1], 1, .55 * u, .72 * u, { ...o, lookX: (o.lookX ?? .5) }, sw, col, C.iris, 'cat'); pop();
  castBrow(.9 * u, -.35 * u, .95 * u, 1.05 * u, 1, o.brow || 0, (o.browUp || 0) + (o.browR || 0), sw);
  if (o.blush) paint(ellPts(1.2 * u, .6 * u, .6 * u, .32 * u, 12), { wash: '#E8607A', washOp: 150 * clamp(o.blush), ink: null });
  paint([[2.65 * u, .05 * u], [3.05 * u, .17 * u], [2.82 * u, .45 * u]], { wash: C.nose, ink: PAL.ink, sw: sw * .5 });
  push(); translate(2.6 * u, .72 * u); scale(.75, 1); castMouth(o.mouth || 'w', talk, .7 * u, sw); pop();
  castWhiskersSide(2.1 * u, .8 * u, 1.6 * u, sw, wet * .8);
  pop();
  rs('draw'); if (o.draw) o.draw(u, sw);
}

// ---------- Pip ----------
function pip(x, y, u, o = {}) {
  const id = o.boilKey ?? ('pp' + (++CLAWD_N)), rs = part => boilSeed(`pip ${id} ${part}`);
  const C = PIP_COL, view = o.view || 'front', q = view === 'q' ? 1 : 0, side = view === 'side';
  const sw = clamp(u / 17, .45, 2.6) * (o.swMul || 1);
  const talk = o.talk ?? (o.who && typeof SPEAK === 'function' ? SPEAK(o.who, T) : 0);
  const sq = o.sq || 0, dy = (o.dy || 0) * u, wind = o.scarfWind ?? 0;
  x += (o.dx || 0) * u;
  rs('shadow'); if (!o.noShadow) castShadow(x, y, u * (side ? 2.6 : 2.1), u, o.dy);
  push(); translate(x, y + dy); if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  // tail: long, thin, curling along the ground and up
  rs('tail');
  const tw = Math.sin(T * 2.1) * .35;
  const tailP = side ? [[-1.7, -1.2], [-3.2, -.6], [-4.6, -.9 + tw * .5], [-5.4, -2.0 + tw], [-5.0, -2.8 + tw]]
                     : [[.9, -.6], [2.2, -.3], [3.4, -.8 + tw * .4], [3.9, -2.0 + tw], [3.3, -2.8 + tw]];
  paint(ribbon(_P(u, tailP), u * .32, u * .12), { wash: C.tail, ink: PAL.ink, sw: sw * .6 });

  if (side) {
    rs('legs');
    [[-1.0, 1], [.9, 1], [-.6, 0], [1.3, 0]].forEach(([lx, far], i) => {
      let sx = 0, h = .8;
      if (o.walk != null) { const ph = (o.walk + [0, .5, .5, 0][i]) * TAU; sx = Math.sin(ph) * .5; h = .8 - Math.max(0, Math.cos(ph)) * .35; }
      paint(ellPts((lx + sx) * u, -h * .5 * u, .32 * u, h * .6 * u, 10), { wash: far ? C.dk : C.tail, ink: PAL.ink, sw: sw * .6 });
    });
    rs('body');
    paint(ellPts(0, -1.85 * u, 2.1 * u, 1.45 * u, 22, u * .03), { wash: C.col, ink: PAL.ink, sw, shade: true });
    paint(ellPts(.6 * u, -1.3 * u, 1.2 * u, .6 * u, 14), { wash: C.lt, washOp: 220, ink: null });
    rs('scarf'); pipScarf(u, sw, C, wind, 1, 'side');
    rs('arm'); castArm(1.3 * u, -2.5 * u, o.aR ?? -1.14, 1, 1.3 * u, .6 * u, C.col, sw, o.cracker ? pipCracker : o.armR, u);
    rs('head');
    push(); translate(1.9 * u, -3.4 * u);
    paint(ellPts(-.5 * u, -1.25 * u, 1.05 * u, 1.15 * u, 18), { wash: C.col, ink: PAL.ink, sw: sw * .8 });            // the ear
    paint(ellPts(-.45 * u, -1.2 * u, .68 * u, .78 * u, 14), { wash: C.inner, ink: null });
    paint([[-1.1 * u, -.8 * u], [-.6 * u, -1.15 * u], [.4 * u, -.9 * u], [1.75 * u, .15 * u], [1.0 * u, .7 * u], [-.6 * u, .8 * u], [-1.2 * u, .2 * u]], { wash: C.col, ink: PAL.ink, sw, curv: .5 });
    paint(ellPts(1.8 * u, .15 * u, .2 * u, .18 * u, 10), { wash: C.nose, ink: PAL.ink, sw: sw * .4 });
    const kinds = Array.isArray(o.eyes) ? o.eyes : [o.eyes || 'open', o.eyes || 'open'];
    push(); translate(.45 * u, -.25 * u); castEye(kinds[1], 1, .28 * u, .34 * u, o, sw * .8, C.col, '#3A3045', 'cat'); pop();
    castBrow(.45 * u, -.25 * u, .5 * u, .55 * u, 1, o.brow || 0, (o.browUp || 0) + (o.browR || 0), sw * .6);
    push(); translate(1.45 * u, .42 * u); scale(.7, 1); castMouth(o.mouth || 'w', talk, .6 * u, sw * .8); pop();
    castWhiskersSide(1.3 * u, .3 * u, 1.0 * u, sw * .8);
    pop();
    rs('draw'); if (o.draw) o.draw(u, sw);
    pop(); rs('after'); return;
  }

  rs('feet');
  for (const s of [-1, 1]) paint(ellPts((s * .75 + q * .2) * u, -.2 * u, .55 * u, .25 * u, 10), { wash: C.tail, ink: PAL.ink, sw: sw * .6 });
  rs('body');
  const bcx = q * .15 * u;
  paint(ellPts(bcx, -1.75 * u, 1.55 * u, 1.75 * u, 22, u * .03), { wash: C.col, ink: PAL.ink, sw, shade: true });
  paint(ellPts(bcx + q * .25 * u, -1.35 * u, .95 * u, 1.05 * u, 16), { wash: C.lt, washOp: 220, ink: null });
  rs('arms');
  const hookR = o.cracker ? pipCracker : o.armR;
  castArm(-1.2 * u + bcx, -2.7 * u, o.aL ?? -1.14, -1, 1.3 * u, .6 * u, q ? C.dk : C.col, sw, o.armL, u);
  rs('scarf'); pipScarf(u, sw, C, wind, q, 'front');
  rs('armR'); castArm(1.2 * u + bcx + q * .1 * u, -2.7 * u, o.aR ?? -1.14, 1, 1.3 * u, .6 * u, C.col, sw, hookR, u);
  // head
  rs('head');
  push(); translate(q * .25 * u, -4.55 * u);
  const fx = q * .45 * u;
  for (const s of [-1, 1]) {   // the big ears
    const far = q && s < 0, ex = s * 1.45 * u + fx * .3 - (far ? .2 * u : 0), r = 1.15 * u * (far ? .9 : 1), wob = .04 * Math.sin(T * 3 + s);
    push(); translate(ex, -1.2 * u); rotate(s * (.25 + wob));
    paint(ellPts(0, 0, r, r * 1.05, 20), { wash: far ? mixCol(C.col, C.dk, .3) : C.col, ink: PAL.ink, sw: sw * .8 });
    paint(ellPts(s * .05 * u, .05 * u, r * .66, r * .7, 16), { wash: C.inner, ink: null });
    pop();
  }
  paint(ellPts(0, 0, 1.5 * u, 1.3 * u, 22, u * .03), { wash: C.col, ink: null, shade: true, shadeK: .8 });
  paint(ellPts(fx, .55 * u, .85 * u, .55 * u, 14), { wash: C.lt, washOp: 230, ink: null });   // snout
  paint(ellPts(0, 0, 1.5 * u, 1.3 * u, 22, u * .03), { ink: PAL.ink, sw });
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(fx + s * .95 * u, .4 * u, .36 * u, .2 * u, 10), { wash: '#E8607A', washOp: 160 * clamp(o.blush), ink: null });
  const kinds = Array.isArray(o.eyes) ? o.eyes : [o.eyes || 'open', o.eyes || 'open'];
  for (const s of [-1, 1]) {
    const far = q && s < 0, ex = fx + s * .58 * u * (far ? .8 : 1), ey = -.2 * u;
    push(); translate(ex, ey); castEye(kinds[s < 0 ? 0 : 1], s, .3 * u * (far ? .85 : 1), .36 * u, o, sw * .8, C.col, '#3A3045', 'cat'); pop();
    castBrow(ex, ey, .55 * u, .55 * u, s, o.brow || 0, (o.browUp || 0) + (s < 0 ? o.browL || 0 : o.browR || 0), sw * .6);
  }
  paint(ellPts(fx, .3 * u, .2 * u, .16 * u, 10), { wash: C.nose, ink: PAL.ink, sw: sw * .45 });
  push(); translate(fx, .45 * u); castMouth(o.mouth || 'w', talk, .6 * u, sw * .8); pop();
  for (const s of [-1, 1]) castWhiskers(fx + s * .35 * u, .5 * u, s, 1.5 * u * (q && s < 0 ? .7 : 1), sw * .8);
  pop();
  rs('draw'); if (o.draw) o.draw(u, sw);
  pop();
  rs('emote'); if (o.emote && typeof emote === 'function') emote(o.emote, x + (o.flip ? -1 : 1) * 2.2 * u, y + dy - 7.4 * u, u * .55, o.emoteK ?? 1, o.emoteAge ?? T);
  rs('after');
}

// The scarf: a band round the neck and one long end that hangs, or streams back in the wind (wind -1..1).
function pipScarf(u, sw, C, wind, q, view) {
  const side = view === 'side', cx = side ? 1.3 * u : q * .2 * u, cy = side ? -3.05 * u : -3.25 * u;
  paint(ellPts(cx, cy, (side ? 1.0 : 1.35) * u, .42 * u, 16, u * .03), { wash: C.scarf, ink: PAL.ink, sw: sw * .8, shade: true });
  for (let k = -1; k <= 1; k++) inkLine([[cx + k * .45 * u, cy - .3 * u], [cx + k * .45 * u + .1 * u, cy + .3 * u]], sw * .5, C.scarfDk, 'inkfine', 0);
  const w = wind, fl = Math.sin(T * (4 + Math.abs(w) * 6)), ox = side ? cx - .6 * u : cx + .55 * u;
  const end = [];
  for (let k = 0; k <= 4; k++) {
    const f = k / 4, hang = [ox + .25 * u * f, cy + .2 * u + 2.0 * u * f], blow = [ox - w * 3.2 * u * f, cy + .1 * u - .3 * u * f];
    const a = clamp(Math.abs(w)), p = [lerp(hang[0], blow[0], a), lerp(hang[1], blow[1], a)];
    p[1] += fl * .18 * u * f * (.3 + a) * (1 - a) + a * (Math.sin(T * 16 - f * 6) * .4 * u * f + .35 * u * f); p[0] += Math.cos(T * 3 + f * 3) * .06 * u * f;
    end.push(p);
  }
  paint(ribbon(end, .55 * u, .5 * u), { wash: C.scarf, ink: PAL.ink, sw: sw * .7 });
  inkLine([[end[4][0] - .25 * u, end[4][1]], [end[4][0] - .3 * u, end[4][1] + .25 * u]], sw * .5, C.scarfDk, 'inkfine', 0);
  inkLine([[end[4][0] + .2 * u, end[4][1]], [end[4][0] + .22 * u, end[4][1] + .25 * u]], sw * .5, C.scarfDk, 'inkfine', 0);
}

// The cracker Pip carries, drawn in the paw's arm space (it follows the arm). Bitten on one corner.
function pipCracker(u, sw) {
  const C = PIP_COL, s = .62 * u;
  const pts = [[-s * .2, -s], [s * 1.6, -s], [s * 1.6, s * .3], [s * 1.25, s * .55], [s * 1.35, s], [-s * .2, s]];
  paint(pts, { wash: C.cracker, ink: PAL.ink, sw: sw * .6 });
  for (const [a, b] of [[.3, -.45], [.9, -.45], [.3, .4], [.9, .4], [.6, 0]]) paint(ellPts(a * s, b * s, s * .08, s * .08, 6), { wash: C.crackerDk, ink: null });
}
